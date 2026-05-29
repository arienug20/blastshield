/**
 * Input Validation Utilities
 */

import { ConfinementLevel, CongestionLevel, WallType, BoundaryCondition } from '../types';

/**
 * Validate a positive number
 */
export function validatePositiveNumber(value: number, fieldName: string): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  if (value <= 0) {
    return { valid: false, error: `${fieldName} must be greater than 0` };
  }
  return { valid: true };
}

/**
 * Validate a non-negative number
 */
export function validateNonNegativeNumber(value: number, fieldName: string): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  if (value < 0) {
    return { valid: false, error: `${fieldName} must be non-negative` };
  }
  return { valid: true };
}

/**
 * Validate a number within range
 */
export function validateRange(
  value: number,
  fieldName: string,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  if (value < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }
  if (value > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` };
  }
  return { valid: true };
}

/**
 * Validate confinement level
 */
export function validateConfinement(confinement: string): { valid: boolean; error?: string } {
  const validLevels: ConfinementLevel[] = ['1D', '2D', '2.5D', '3D'];
  if (!validLevels.includes(confinement as ConfinementLevel)) {
    return { valid: false, error: 'Invalid confinement level' };
  }
  return { valid: true };
}

/**
 * Validate congestion level
 */
export function validateCongestion(congestion: string): { valid: boolean; error?: string } {
  const validLevels: CongestionLevel[] = ['low', 'medium', 'high'];
  if (!validLevels.includes(congestion as CongestionLevel)) {
    return { valid: false, error: 'Invalid congestion level' };
  }
  return { valid: true };
}

/**
 * Validate wall type
 */
export function validateWallType(wallType: string): { valid: boolean; error?: string } {
  const validTypes: WallType[] = ['steel_plate', 'reinforced_concrete', 'precast', 'modular'];
  if (!validTypes.includes(wallType as WallType)) {
    return { valid: false, error: 'Invalid wall type' };
  }
  return { valid: true };
}

/**
 * Validate boundary condition
 */
export function validateBoundaryCondition(bc: string): { valid: boolean; error?: string } {
  const validConditions: BoundaryCondition[] = ['simply_supported', 'fixed_fixed', 'cantilever', 'fixed_pinned'];
  if (!validConditions.includes(bc as BoundaryCondition)) {
    return { valid: false, error: 'Invalid boundary condition' };
  }
  return { valid: true };
}

/**
 * Validate VCE inputs
 */
export function validateVCEInputs(
  flammableMass: number,
  standoffDistance: number,
  ambientPressure: number,
  ambientTemperature: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const massCheck = validatePositiveNumber(flammableMass, 'Flammable mass');
  if (!massCheck.valid) errors.push(massCheck.error!);

  const distanceCheck = validatePositiveNumber(standoffDistance, 'Standoff distance');
  if (!distanceCheck.valid) errors.push(distanceCheck.error!);

  const pressureCheck = validatePositiveNumber(ambientPressure, 'Ambient pressure');
  if (!pressureCheck.valid) errors.push(pressureCheck.error!);

  const tempCheck = validatePositiveNumber(ambientTemperature, 'Ambient temperature');
  if (!tempCheck.valid) errors.push(tempCheck.error!);

  // Additional reasonable range checks
  if (flammableMass > 1000000) {
    errors.push('Flammable mass appears unrealistically large (> 1000 tonnes)');
  }

  if (standoffDistance > 10000) {
    errors.push('Standoff distance appears unrealistically large (> 10 km)');
  }

  if (ambientPressure < 0.8 || ambientPressure > 1.2) {
    errors.push('Ambient pressure should be close to 1.013 bar (0.8-1.2 bar typical)');
  }

  if (ambientTemperature < 200 || ambientTemperature > 350) {
    errors.push('Ambient temperature should be realistic (200-350 K)');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate wall design inputs
 */
export function validateWallDesignInputs(
  wallHeight: number,
  wallWidth: number,
  peakOverpressure: number,
  positivePhaseImpulse: number,
  deflectionLimitRatio: number,
  ductilityLimit: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const heightCheck = validatePositiveNumber(wallHeight, 'Wall height');
  if (!heightCheck.valid) errors.push(heightCheck.error!);

  const widthCheck = validatePositiveNumber(wallWidth, 'Wall width');
  if (!widthCheck.valid) errors.push(widthCheck.error!);

  const pressureCheck = validatePositiveNumber(peakOverpressure, 'Peak overpressure');
  if (!pressureCheck.valid) errors.push(pressureCheck.error!);

  const impulseCheck = validatePositiveNumber(positivePhaseImpulse, 'Positive phase impulse');
  if (!impulseCheck.valid) errors.push(impulseCheck.error!);

  const deflectionCheck = validatePositiveNumber(deflectionLimitRatio, 'Deflection limit ratio');
  if (!deflectionCheck.valid) errors.push(deflectionCheck.error!);

  const ductilityCheck = validatePositiveNumber(ductilityLimit, 'Ductility limit');
  if (!ductilityCheck.valid) errors.push(ductilityCheck.error!);

  // Additional reasonable range checks
  if (wallHeight > 20) {
    errors.push('Wall height appears unrealistically large (> 20 m)');
  }

  if (wallWidth > 50) {
    errors.push('Wall width appears unrealistically large (> 50 m)');
  }

  if (peakOverpressure > 10) {
    errors.push('Peak overpressure appears unrealistically high (> 10 bar)');
  }

  if (deflectionLimitRatio < 10) {
    errors.push('Deflection limit ratio too restrictive (< span/10)');
  }

  if (deflectionLimitRatio > 1000) {
    errors.push('Deflection limit ratio appears unrealistic (> span/1000)');
  }

  if (ductilityLimit < 1) {
    errors.push('Ductility limit must be >= 1 (elastic response minimum)');
  }

  if (ductilityLimit > 20) {
    errors.push('Ductility limit appears unrealistic (> 20)');
  }

  return { valid: errors.length === 0, errors };
}