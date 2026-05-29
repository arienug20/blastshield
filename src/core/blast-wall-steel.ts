import type { BlastWallOutput, BoundaryCondition } from '../types';

/**
 * Steel Plate Blast Wall Sizing (Yield Line Theory)
 * Based on plastic analysis and UFC 3-340-02
 */

// Steel grades database
export const steelGrades = {
  'A36': { fy: 250, fu: 400, E: 200000, name: 'A36' },
  'A572_Gr50': { fy: 345, fu: 450, E: 200000, name: 'A572 Gr.50' },
  'A516_Gr70': { fy: 260, fu: 485, E: 200000, name: 'A516 Gr.70' },
  'A992': { fy: 345, fu: 450, E: 200000, name: 'A992' },
  'A514': { fy: 690, fu: 760, E: 200000, name: 'A514' },
  'SS304': { fy: 205, fu: 515, E: 193000, name: 'SS 304' },
  'SS316': { fy: 205, fu: 515, E: 193000, name: 'SS 316' }
};

// Dynamic Increase Factors (DIF) for steel at high strain rates
const STEEL_DIF = {
  100: 1.10,
  500: 1.15,
  1000: 1.20,
  2000: 1.25
};

/**
 * Get DIF based on strain rate (1/s)
 */
function getSteelDIF(strainRate: number): number {
  if (strainRate < 100) return 1.0;
  if (strainRate >= 2000) return 1.25;

  const rates = [100, 500, 1000, 2000];
  const difs = [1.10, 1.15, 1.20, 1.25];

  for (let i = 0; i < rates.length - 1; i++) {
    if (strainRate >= rates[i] && strainRate < rates[i + 1]) {
      const ratio = (strainRate - rates[i]) / (rates[i + 1] - rates[i]);
      return difs[i] + ratio * (difs[i + 1] - difs[i]);
    }
  }

  return 1.20;
}

/**
 * Calculate yield line pattern length
 */
function calculateYieldLineLength(
  width: number,          // m
  height: number,         // m
  boundaryCondition: BoundaryCondition
): number {
  switch (boundaryCondition) {
    case 'simply_supported':
      // Diagonal yield lines from corners to center
      return 2 * Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));

    case 'fixed_fixed':
      // More complex yield line pattern with additional lines
      return 2 * Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) + width + height;

    case 'cantilever':
      // Single yield line at support
      return width;

    case 'fixed_pinned':
      return 2 * Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) + height / 2;

    default:
      return 2 * Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
  }
}

/**
 * Run Steel Plate Wall Design
 */
export function designSteelPlateWall(
  peakOverpressure: number,           // bar
  positivePhaseImpulse: number,       // bar·ms
  wallHeight: number,                 // m
  wallWidth: number,                  // m
  boundaryCondition: BoundaryCondition,
  steelGrade: keyof typeof steelGrades = 'A36',
  deflectionLimitRatio: number = 60,  // span/XX
  ductilityLimit: number = 3.0,
  strainRate: number = 500            // 1/s (typical for blast)
): BlastWallOutput {
  const steel = steelGrades[steelGrade];

  // Apply Dynamic Increase Factor
  const dif = getSteelDIF(strainRate);
  const fyD = steel.fy * dif; // Dynamic yield strength (MPa)

  // Convert overpressure to design load (kPa)
  const designPressure = peakOverpressure * 100; // kPa

  // Positive phase duration (estimate from impulse)
  const td = (2 * positivePhaseImpulse) / peakOverpressure; // ms

  // Plastic moment capacity: Mp = fy × Zp
  // For rectangular plate: Zp = b × t² / 4
  // We need to find t such that work equation is satisfied

  // Work equation: External work = Internal work
  // External work = pressure × area × deflection
  // Internal work = Mp × yield line length × rotation

  // Simplified: Calculate required thickness using yield line theory
  // t = sqrt((6 × pressure × area²) / (fy × Lyl × k))

  const span = Math.min(wallHeight, wallWidth);
  const area = wallHeight * wallWidth;
  const yieldLineLength = calculateYieldLineLength(wallWidth, wallHeight, boundaryCondition);

  // Geometry factor based on boundary condition
  const kFactor = boundaryCondition === 'fixed_fixed' ? 8.0 :
                  boundaryCondition === 'cantilever' ? 2.0 :
                  boundaryCondition === 'fixed_pinned' ? 6.0 :
                  6.0; // simply supported

  // Required thickness (mm)
  const requiredThickness = Math.sqrt(
    (6 * designPressure * Math.pow(span * 1000, 2)) /
    (fyD * yieldLineLength * 1000 * kFactor)
  );

  // Round up to nearest mm
  const thicknessRounded = Math.ceil(requiredThickness);

  // Plastic modulus: Zp = b × t² / 4
  const widthMm = wallWidth * 1000;
  const zp = (widthMm * Math.pow(thicknessRounded, 2)) / 4; // mm³

  // Plastic moment capacity: Mp = fyD × Zp
  const mp = fyD * zp; // N·mm

  // Maximum deflection (plastic response)
  // Using simplified correlation
  const maxDeflection = (designPressure * area * 1000 * Math.pow(span * 1000, 2)) / (10 * mp); // mm

  // Ductility ratio
  const yieldDeflection = (mp * Math.pow(span * 1000, 3)) / (12 * steel.E * 1000 * zp); // mm (approximate)
  const ductilityRatio = yieldDeflection > 0 ? maxDeflection / yieldDeflection : 0;

  // Support reactions
  const supportReaction = (designPressure * area) / 2; // kN
  const supportMoment = (designPressure * area * span) / 8; // kN·m

  // Shear at support
  const shearAtSupport = designPressure * span / 2; // kN/m

  // Weight per unit area
  const steelDensity = 7850; // kg/m³
  const weightPerUnitArea = thicknessRounded / 1000 * steelDensity; // kg/m²

  // Check deflection limit
  const maxAllowableDeflection = (span * 1000) / deflectionLimitRatio;
  const passDeflection = maxDeflection <= maxAllowableDeflection;

  // Check ductility limit
  const passDuctility = ductilityRatio <= ductilityLimit;

  // Material recommendation
  let materialRecommendation = steel.name;
  if (!passDeflection || !passDuctility) {
    // Suggest higher grade
    if (steelGrade === 'A36') {
      materialRecommendation = 'A572 Gr.50 or higher grade';
    } else if (steelGrade === 'A572_Gr50') {
      materialRecommendation = 'A514 or increase thickness';
    } else {
      materialRecommendation = 'Increase thickness significantly';
    }
  }

  return {
    requiredThickness: thicknessRounded,
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