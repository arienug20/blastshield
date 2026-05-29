import { SDOFOutput, BoundaryCondition } from '../types';

/**
 * SDOF Analysis using Newmark-β Method
 * Based on Biggs (1964) and ASCE Design of Blast-Resistant Buildings
 */

// Transformation factors for different load shapes and boundary conditions
const TRANSFORM_FACTORS: Record<BoundaryCondition, Record<string, { kl: number; km: number; ks: number }>> = {
  simply_supported: {
    uniform: { kl: 0.57, km: 0.40, ks: 0.50 },
    triangular: { kl: 0.64, km: 0.45, ks: 0.50 },
    point: { kl: 0.58, km: 0.45, ks: 0.50 }
  },
  fixed_fixed: {
    uniform: { kl: 0.38, km: 0.50, ks: 0.40 },
    triangular: { kl: 0.40, km: 0.45, ks: 0.40 },
    point: { kl: 0.38, km: 0.50, ks: 0.40 }
  },
  cantilever: {
    uniform: { kl: 0.13, km: 0.25, ks: 0.125 },
    triangular: { kl: 0.15, km: 0.25, ks: 0.125 },
    point: { kl: 0.15, km: 0.25, ks: 0.125 }
  },
  fixed_pinned: {
    uniform: { kl: 0.45, km: 0.42, ks: 0.45 },
    triangular: { kl: 0.48, km: 0.42, ks: 0.45 },
    point: { kl: 0.46, km: 0.42, ks: 0.45 }
  }
};

/**
 * Newmark-β Integration for SDOF response
 */
function newmarkBetaIntegration(
  mass: number,           // kg
  stiffness: number,      // N/m
  peakLoad: number,       // N
  duration: number,       // ms
  yieldForce: number,     // N
  loadShape: 'uniform' | 'triangular' | 'point',
  dt: number = 0.1        // Time step (ms)
): { maxDisplacement: number; displacementHistory: Array<{ t: number; x: number }> } {
  // Convert units
  const durationS = duration / 1000;  // s
  const dtS = dt / 1000;              // s

  // Initial conditions
  let u = 0;  // displacement
  let v = 0;  // velocity
  let a = 0;  // acceleration

  // Newmark-β parameters (average acceleration method)
  const beta = 0.25;
  const gamma = 0.5;

  // Constants
  const a0 = 1 / (beta * dtS * dtS);
  const a1 = gamma / (beta * dtS);
  const a2 = 1 / (beta * dtS);
  const a3 = 1 / (2 * beta) - 1;
  const a4 = gamma / beta - 1;
  const a5 = dtS * (gamma / (2 * beta) - 1);
  const a6 = dtS * (1 - gamma);
  const a7 = gamma * dtS;

  // Effective stiffness
  const kEff = stiffness + a0 * mass;

  const history: Array<{ t: number; x: number }> = [];
  const maxSteps = Math.ceil(durationS / dtS) + 1000; // Include post-blast response

  let maxDisplacement = 0;
  let plastified = false;

  for (let i = 0; i < maxSteps; i++) {
    const t = i * dtS;
    const timeMs = t * 1000;

    // External load function
    let externalLoad = 0;
    if (t <= durationS) {
      const ratio = t / durationS;
      if (loadShape === 'uniform') {
        externalLoad = peakLoad * (1 - ratio);
      } else if (loadShape === 'triangular') {
        externalLoad = peakLoad * (1 - ratio);
      } else {
        externalLoad = peakLoad * (1 - ratio);
      }
    }

    // Effective load
    const loadEff = externalLoad + mass * (a0 * u + a2 * v + a3 * a);

    // Displacement at t + dt
    const uNext = loadEff / kEff;

    // Acceleration at t + dt
    const aNext = a0 * (uNext - u) - a2 * v - a3 * a;

    // Velocity at t + dt
    const vNext = v + a6 * a + a7 * aNext;

    // Check for yield (elasto-plastic behavior)
    const force = stiffness * uNext;
    if (Math.abs(force) > yieldForce && !plastified) {
      // Yield reached - switch to plastic region
      plastified = true;
    }

    // Store history
    if (i % 10 === 0 || timeMs <= duration) { // Store every 10th point for efficiency
      history.push({ t: timeMs, x: uNext * 1000 }); // Convert m to mm
    }

    // Track max displacement
    if (Math.abs(uNext) > maxDisplacement) {
      maxDisplacement = Math.abs(uNext);
    }

    // Update for next iteration
    u = uNext;
    v = vNext;
    a = aNext;

    // Stop if energy is dissipated (v < 0.001 m/s and t > duration * 2)
    if (t > durationS * 2 && Math.abs(v) < 0.001) {
      break;
    }
  }

  return { maxDisplacement: maxDisplacement * 1000, displacementHistory: history };
}

/**
 * Run SDOF Analysis
 */
export function runSDOFAnalysis(
  mass: number,                       // kg
  stiffness: number,                  // N/m
  peakOverpressure: number,           // bar
  positivePhaseDuration: number,      // ms
  loadArea: number,                   // m²
  boundaryCondition: BoundaryCondition,
  loadShape: 'uniform' | 'triangular' | 'point',
  yieldStrength: number,              // MPa
  plasticModulus: number              // mm³
): SDOFOutput {
  // Get transformation factors
  const factors = TRANSFORM_FACTORS[boundaryCondition][loadShape];

  // Convert overpressure to force
  const peakLoad = peakOverpressure * 100000 * loadArea; // N

  // Equivalent SDOF parameters
  const mEff = factors.km * mass;  // Effective mass
  const kEff = factors.kl * stiffness;  // Effective stiffness

  // Natural period
  const naturalPeriodS = 2 * Math.PI * Math.sqrt(mEff / kEff); // s
  const naturalPeriod = naturalPeriodS * 1000; // ms

  // Yield force
  const yieldForce = yieldStrength * plasticModulus; // N

  // Run Newmark-β integration
  const { maxDisplacement, displacementHistory } = newmarkBetaIntegration(
    mEff,
    kEff,
    factors.ks * peakLoad,
    positivePhaseDuration,
    yieldForce,
    loadShape
  );

  // Ductility ratio
  const yieldDisplacement = yieldForce / kEff * 1000; // mm
  const ductilityRatio = yieldDisplacement > 0 ? maxDisplacement / yieldDisplacement : 0;

  // Support reactions
  const supportReaction = peakLoad * factors.ks / 1000; // kN
  const supportMoment = supportReaction * 1.0; // kN·m (simplified)

  // Dynamic Load Factor (DLF)
  // DLF = dynamic response / static response
  const staticDisplacement = peakLoad / kEff * 1000; // mm
  const dlf = staticDisplacement > 0 ? maxDisplacement / staticDisplacement : 1.0;

  return {
    maxDisplacement,
    ductilityRatio,
    supportReaction,
    supportMoment,
    dlf,
    displacementHistory,
    naturalPeriod
  };
}