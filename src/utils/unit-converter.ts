/**
 * Unit Converter Utilities
 */

/**
 * Convert bar to kPa
 */
export function barToKPa(bar: number): number {
  return bar * 100;
}

/**
 * Convert kPa to bar
 */
export function kPaToBar(kPa: number): number {
  return kPa / 100;
}

/**
 * Convert bar to psi
 */
export function barToPsi(bar: number): number {
  return bar * 14.50377377;
}

/**
 * Convert psi to bar
 */
export function psiToBar(psi: number): number {
  return psi / 14.50377377;
}

/**
 * Convert meters to feet
 */
export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

/**
 * Convert feet to meters
 */
export function feetToMeters(feet: number): number {
  return feet / 3.28084;
}

/**
 * Convert kg to lbs
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert lbs to kg
 */
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

/**
 * Convert MPa to ksi
 */
export function mpaToKsi(mpa: number): number {
  return mpa * 0.145038;
}

/**
 * Convert ksi to MPa
 */
export function ksiToMpa(ksi: number): number {
  return ksi / 0.145038;
}

/**
 * Convert ms to seconds
 */
export function msToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * Convert seconds to ms
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Format number with specified precision
 */
export function formatNumber(value: number, precision: number = 3): string {
  if (value === 0) return '0';
  if (Math.abs(value) < 0.001) return value.toExponential(precision);
  if (Math.abs(value) >= 1000) return value.toFixed(0);
  return value.toFixed(precision);
}

/**
 * Format overpressure value with appropriate unit
 */
export function formatOverpressure(bar: number): string {
  if (bar < 0.1) {
    return `${formatNumber(bar * 100, 2)} kPa`;
  }
  return `${formatNumber(bar, 4)} bar`;
}

/**
 * Format distance value with appropriate unit
 */
export function formatDistance(meters: number): string {
  if (meters < 1) {
    return `${formatNumber(meters * 1000, 0)} mm`;
  } else if (meters >= 1000) {
    return `${formatNumber(meters / 1000, 2)} km`;
  }
  return `${formatNumber(meters, 2)} m`;
}

/**
 * Format mass value with appropriate unit
 */
export function formatMass(kg: number): string {
  if (kg >= 1000) {
    return `${formatNumber(kg / 1000, 2)} tonnes`;
  }
  return `${formatNumber(kg, 2)} kg`;
}

/**
 * Format force value with appropriate unit
 */
export function formatForce(newtons: number): string {
  if (newtons >= 1000) {
    return `${formatNumber(newtons / 1000, 2)} kN`;
  }
  return `${formatNumber(newtons, 2)} N`;
}

/**
 * Format moment value with appropriate unit
 */
export function formatMoment(nm: number): string {
  if (nm >= 1000) {
    return `${formatNumber(nm / 1000, 2)} kN·m`;
  }
  return `${formatNumber(nm, 2)} N·m`;
}