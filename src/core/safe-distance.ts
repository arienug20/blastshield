import type { BSTOutput, TNTOutput, TNOOutput, SafeDistanceResult } from '../types';

/**
 * Safe Distance Calculator
 * Uses bisection solver to find distance where overpressure = threshold
 */

interface BSTFunction {
  (distance: number): BSTOutput;
}

interface TNTFunction {
  (distance: number): TNTOutput;
}

interface TNOFunction {
  (distance: number): TNOOutput;
}

/**
 * Bisection solver for finding safe distance
 */
function bisectionSolver(
  f: (x: number) => number,
  target: number,
  minR: number = 0.1,
  maxR: number = 10000,
  tolerance: number = 0.001,
  maxIter: number = 100
): number {
  let low = minR;
  let high = maxR;

  for (let i = 0; i < maxIter; i++) {
    const mid = (low + high) / 2;
    const value = f(mid);

    if (Math.abs(value - target) < tolerance) {
      return mid;
    }

    if (value > target) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Calculate safe distances using BST method
 */
export function calculateBSTSafeDistances(
  bstAnalysis: BSTFunction,
  thresholds: Array<{ label: string; value: number }>
): SafeDistanceResult {
  const distances = thresholds.map(threshold => ({
    label: threshold.label,
    threshold: threshold.value,
    distance: bisectionSolver(
      (r) => bstAnalysis(r).peakOverpressure,
      threshold.value
    )
  }));

  return {
    method: 'BST (Baker-Strehlow-Tang)',
    distances
  };
}

/**
 * Calculate safe distances using TNT equivalent method
 */
export function calculateTNTSafeDistances(
  tntAnalysis: TNTFunction,
  thresholds: Array<{ label: string; value: number }>
): SafeDistanceResult {
  const distances = thresholds.map(threshold => ({
    label: threshold.label,
    threshold: threshold.value,
    distance: bisectionSolver(
      (r) => tntAnalysis(r).peakOverpressure,
      threshold.value
    )
  }));

  return {
    method: 'TNT Equivalent',
    distances
  };
}

/**
 * Calculate safe distances using TNO method
 */
export function calculateTNOSafeDistances(
  tnoAnalysis: TNOFunction,
  thresholds: Array<{ label: string; value: number }>
): SafeDistanceResult {
  const distances = thresholds.map(threshold => ({
    label: threshold.label,
    threshold: threshold.value,
    distance: bisectionSolver(
      (r) => tnoAnalysis(r).peakOverpressure,
      threshold.value
    )
  }));

  return {
    method: 'TNO Multi-Energy',
    distances
  };
}

/**
 * Default safe distance thresholds
 */
export const SAFE_DISTANCE_THRESHOLDS = [
  { label: 'Safe - No injury', value: 0.03 },
  { label: 'Glass protection', value: 0.02 },
  { label: 'Eardrum protection', value: 0.21 },
  { label: 'Lung damage threshold', value: 0.35 },
  { label: '50% lethality', value: 0.55 },
  { label: 'Near 100% lethality', value: 2.0 }
];

/**
 * Building damage thresholds
 */
export const BUILDING_DAMAGE_THRESHOLDS = [
  { label: 'No damage', value: 0.01 },
  { label: 'Minor (windows crack)', value: 0.02 },
  { label: 'Light (windows shattered)', value: 0.03 },
  { label: 'Moderate (walls cracked)', value: 0.07 },
  { label: 'Heavy (structural damage)', value: 0.15 },
  { label: 'Very heavy (partial collapse)', value: 0.30 },
  { label: 'Extreme (near total destruction)', value: 0.50 },
  { label: 'Catastrophic', value: 1.0 }
];