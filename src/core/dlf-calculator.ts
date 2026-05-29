/**
 * Dynamic Load Factor (DLF) Calculator
 * Based on td/Tn ratio for different load shapes
 */

/**
 * DLF for triangular load pulse (undamped)
 * DLF = 2 * sin(π * td / Tn) / (π * td / Tn)
 */
export function calculateDLFTriangular(td: number, tn: number): number {
  const ratio = td / tn;

  if (ratio === 0) return 1.0;

  const dlf = (2 * Math.sin(Math.PI * ratio)) / (Math.PI * ratio);
  return Math.abs(dlf);
}

/**
 * DLF for rectangular load pulse (undamped)
 */
export function calculateDLFRectangular(td: number, tn: number): number {
  const ratio = td / tn;

  if (ratio === 0) return 1.0;

  const dlf = 2 * Math.sin(Math.PI * ratio) / (Math.PI * ratio);
  return Math.abs(dlf);
}

/**
 * DLF with damping
 */
export function calculateDLFDamped(td: number, tn: number, dampingRatio: number = 0.05): number {
  const ratio = td / tn;
  const wn = 2 * Math.PI / tn; // Natural frequency (rad/s)
  const wd = wn * Math.sqrt(1 - dampingRatio * dampingRatio); // Damped frequency

  if (ratio === 0) return 1.0;

  const t = td / 1000; // ms to s
  const wnS = wn / 1000;

  // Simplified DLF with damping
  const dlf = (1 / (1 - Math.pow(ratio, 2))) * (1 - Math.exp(-dampingRatio * wnS * t) * (Math.cos(wd * t) + (dampingRatio / Math.sqrt(1 - dampingRatio * dampingRatio)) * Math.sin(wd * t)));

  return Math.abs(dlf);
}

/**
 * Generate DLF curve data
 */
export function generateDLFCurve(
  loadShape: 'triangular' | 'rectangular',
  maxRatio: number = 5.0,
  dampingRatio?: number,
  steps: number = 100
): Array<{ td_Tn: number; dlf: number }> {
  const curve: Array<{ td_Tn: number; dlf: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const ratio = (maxRatio * i) / steps;
    let dlf: number;

    if (dampingRatio !== undefined) {
      dlf = calculateDLFDamped(ratio, 1.0, dampingRatio);
    } else {
      if (loadShape === 'triangular') {
        dlf = calculateDLFTriangular(ratio, 1.0);
      } else {
        dlf = calculateDLFRectangular(ratio, 1.0);
      }
    }

    curve.push({ td_Tn: ratio, dlf });
  }

  return curve;
}