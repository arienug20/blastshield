import { BlastWallOutput, BoundaryCondition } from '../types';

/**
 * Reinforced Concrete Blast Wall Sizing (Ultimate Strength Method)
 * Based on UFC 3-340-02 and ACI 318
 */

// Concrete grades database
export const concreteGrades = {
  'C25_30': { fc: 25, Ec: 31000, density: 2400, name: 'C25/30' },
  'C30_37': { fc: 30, Ec: 33000, density: 2400, name: 'C30/37' },
  'C40_50': { fc: 40, Ec: 35000, density: 2400, name: 'C40/50' },
  'C50_60': { fc: 50, Ec: 37000, density: 2400, name: 'C50/60' },
  'UHPC': { fc: 150, Ec: 50000, density: 2500, name: 'UHPC' }
};

// Rebar grades database
export const rebarGrades = {
  'Grade300': { fy: 300, fu: 420, name: 'Grade 300' },
  'Grade420': { fy: 420, fu: 620, name: 'Grade 420' },
  'Grade520': { fy: 520, fu: 750, name: 'Grade 520' }
};

// Dynamic Increase Factors (DIF) for concrete and rebar
const CONCRETE_DIF = {
  1: 1.0,
  10: 1.10,
  50: 1.15,
  100: 1.19,
  500: 1.25
};

const REBAR_DIF = {
  1: 1.0,
  10: 1.10,
  50: 1.15,
  100: 1.17,
  500: 1.29
};

/**
 * Get DIF for concrete
 */
function getConcreteDIF(strainRate: number): number {
  if (strainRate < 1) return 1.0;
  if (strainRate >= 500) return 1.25;

  const rates = [1, 10, 50, 100, 500];
  const difs = [1.0, 1.10, 1.15, 1.19, 1.25];

  for (let i = 0; i < rates.length - 1; i++) {
    if (strainRate >= rates[i] && strainRate < rates[i + 1]) {
      const ratio = (strainRate - rates[i]) / (rates[i + 1] - rates[i]);
      return difs[i] + ratio * (difs[i + 1] - difs[i]);
    }
  }

  return 1.20;
}

/**
 * Get DIF for rebar
 */
function getRebarDIF(strainRate: number): number {
  if (strainRate < 1) return 1.0;
  if (strainRate >= 500) return 1.29;

  const rates = [1, 10, 50, 100, 500];
  const difs = [1.0, 1.10, 1.15, 1.17, 1.29];

  for (let i = 0; i < rates.length - 1; i++) {
    if (strainRate >= rates[i] && strainRate < rates[i + 1]) {
      const ratio = (strainRate - rates[i]) / (rates[i + 1] - rates[i]);
      return difs[i] + ratio * (difs[i + 1] - difs[i]);
    }
  }

  return 1.20;
}

/**
 * Run Reinforced Concrete Wall Design
 */
export function designConcreteWall(
  peakOverpressure: number,               // bar
  positivePhaseImpulse: number,           // bar·ms
  wallHeight: number,                     // m
  wallWidth: number,                      // m
  boundaryCondition: BoundaryCondition,
  concreteGrade: keyof typeof concreteGrades = 'C30_37',
  rebarGrade: keyof typeof rebarGrades = 'Grade420',
  deflectionLimitRatio: number = 60,      // span/XX
  ductilityLimit: number = 3.0,
  strainRate: number = 100,               // 1/s
  cover: number = 40,                      // mm
  spacing: number = 200                   // mm
): BlastWallOutput {
  const concrete = concreteGrades[concreteGrade];
  const rebar = rebarGrades[rebarGrade];

  // Apply Dynamic Increase Factors
  const difConcrete = getConcreteDIF(strainRate);
  const difRebar = getRebarDIF(strainRate);

  const fcD = concrete.fc * difConcrete; // Dynamic concrete strength (MPa)
  const fyD = rebar.fy * difRebar;        // Dynamic rebar strength (MPa)

  // Convert overpressure to design load (kPa)
  const designPressure = peakOverpressure * 100; // kPa

  // Calculate span and effective depth
  const span = Math.min(wallHeight, wallWidth);
  const coverM = cover / 1000; // m
  const spacingM = spacing / 1000; // m

  // Assume reasonable thickness and iterate
  let thickness = 0.2; // Initial guess: 200mm
  const minThickness = 0.15;
  const maxThickness = 1.0;

  for (let iter = 0; iter < 10; iter++) {
    // Effective depth
    const d = thickness - coverM - (12 / 1000); // Assume #4 rebar

    // Design moment: Mu = w × L² / 8
    const w = designPressure * 1.0; // kN/m per meter width
    const L = span;
    const Mu = w * Math.pow(L, 2) / 8; // kN·m

    // Convert to N·mm
    const MuNmm = Mu * 1000000;

    // Assume reinforcement ratio (ρ) typical range: 0.5% to 1.5%
    const rho = 0.01;

    // Calculate neutral axis depth: a = (ρ × fy × d) / (0.85 × fc)
    const a = (rho * fyD * d) / (0.85 * fcD);

    // Check if a <= d (compression block within section)
    if (a > d) {
      // Increase thickness or reduce reinforcement
      thickness += 0.05;
      continue;
    }

    // Plastic moment capacity: φMn = φ × As × fy × (d - a/2)
    const phi = 0.9; // Strength reduction factor
    const As = rho * d * 1000; // mm² per m width
    const Mn = As * fyD * (d * 1000 - a * 1000 / 2); // N·mm
    const phiMn = phi * Mn; // N·mm

    // Check if capacity is sufficient
    if (phiMn >= MuNmm) {
      break;
    }

    // Increase thickness
    thickness += 0.05;

    if (thickness > maxThickness) {
      thickness = maxThickness;
      break;
    }
  }

  // Round up to nearest 25mm
  const thicknessRounded = Math.ceil(thickness * 40) / 40;

  // Calculate final design parameters
  const d = thicknessRounded - coverM - (12 / 1000);
  const rho = 0.01;
  const a = (rho * fyD * d) / (0.85 * fcD);
  const As = rho * d * 1000; // mm² per m width

  // Plastic moment capacity
  const phi = 0.9;
  const Mn = As * fyD * (d * 1000 - a * 1000 / 2); // N·mm
  const phiMn = phi * Mn / 1000000; // kN·m

  // Maximum deflection (simplified)
  // Using cracked section stiffness
  const Icr = As * Math.pow(d * 1000 - a * 1000 / 2, 2); // mm⁴
  const EcModulus = concrete.Ec * 1000; // MPa
  const EIcr = EcModulus * Icr; // N·mm²

  const w = designPressure; // kN/m
  const L = span;
  const maxDeflection = (5 * w * Math.pow(L * 1000, 4)) / (384 * EIcr); // mm

  // Ductility ratio
  const yieldMoment = phiMn;
  const yieldDeflection = (5 * w * Math.pow(L * 1000, 4)) / (384 * EIcr * 2); // Approximate
  const ductilityRatio = yieldDeflection > 0 ? maxDeflection / yieldDeflection : 0;

  // Support reactions
  const supportReaction = (designPressure * wallHeight * wallWidth) / 2; // kN
  const supportMoment = (designPressure * wallHeight * Math.pow(wallWidth, 2)) / 8; // kN·m

  // Shear at support
  const shearAtSupport = designPressure * span / 2; // kN/m

  // Weight per unit area
  const weightPerUnitArea = thicknessRounded * concrete.density; // kg/m²

  // Check deflection limit
  const maxAllowableDeflection = (span * 1000) / deflectionLimitRatio;
  const passDeflection = maxDeflection <= maxAllowableDeflection;

  // Check ductility limit
  const passDuctility = ductilityRatio <= ductilityLimit;

  // Material recommendation
  let materialRecommendation = `Concrete ${concrete.name} with ${rebar.name} rebar`;
  if (!passDeflection || !passDuctility) {
    materialRecommendation = `Increase thickness or use higher grade (C40/50 or UHPC)`;
  }

  return {
    requiredThickness: thicknessRounded * 1000, // mm
    weightPerUnitArea,
    maxDeflection,
    ductilityRatio,
    supportReaction,
    supportMoment,
    shearAtSupport,
    passDeflection,
    passDuctility,
    materialRecommendation
  };
}