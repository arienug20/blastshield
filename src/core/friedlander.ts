/**
 * Friedlander Waveform for Blast Pressure Time-History
 */

export interface FriedlanderParams {
  ps: number;        // Peak positive overpressure (bar)
  td: number;        // Positive phase duration (ms)
  alpha: number;     // Decay coefficient
  pmin?: number;     // Peak negative overpressure (bar)
  tdNeg?: number;    // Negative phase duration (ms)
  beta?: number;     // Negative phase decay coefficient
}

/**
 * Friedlander equation for positive phase
 * P(t) = Ps × (1 - t/td) × e^(-αt/td)
 */
export function friedlanderPositivePhase(t: number, params: FriedlanderParams): number {
  const { ps, td, alpha } = params;

  if (t < 0) return 0;
  if (t > td) return 0;

  return ps * (1 - t / td) * Math.exp(-alpha * t / td);
}

/**
 * Friedlander equation for negative phase
 * P(t) = -Pmin × (t/td_neg - 1) × e^(-β(t-td)/td_neg)
 */
export function friedlanderNegativePhase(t: number, params: FriedlanderParams): number {
  const { ps, td, alpha, pmin, tdNeg, beta } = params;

  if (t <= td) return 0;
  if (!pmin || !tdNeg || !beta) return 0;
  if (t > td + tdNeg) return 0;

  return -pmin * (t / tdNeg - 1) * Math.exp(-beta * (t - td) / tdNeg);
}

/**
 * Full Friedlander waveform
 */
export function friedlanderWaveform(t: number, params: FriedlanderParams): number {
  const { ps, td, alpha, pmin, tdNeg, beta } = params;

  if (t < 0) return 0;

  if (t <= td) {
    return friedlanderPositivePhase(t, { ps, td, alpha });
  }

  if (pmin && tdNeg && beta && t <= td + tdNeg) {
    return friedlanderNegativePhase(t, { ps, td, alpha, pmin, tdNeg, beta });
  }

  return 0;
}

/**
 * Calculate impulse from Friedlander parameters
 */
export function calculateFriedlanderImpulse(params: FriedlanderParams): number {
  const { ps, td, alpha, pmin, tdNeg } = params;

  // Positive phase impulse (analytical integral)
  const posImpulse = ps * td * (1 / alpha - Math.exp(-alpha) * (1 / alpha + 1));

  // Negative phase impulse (analytical integral)
  let negImpulse = 0;
  if (pmin && tdNeg) {
    negImpulse = -pmin * tdNeg * (1 / (tdNeg / td) - Math.exp(-(tdNeg / td)) * (1 / (tdNeg / td) + 1));
  }

  return posImpulse + negImpulse;
}

/**
 * Generate time history array
 */
export function generateTimeHistory(
  params: FriedlanderParams,
  dt: number = 0.1
): Array<{ t: number; p: number }> {
  const totalTime = params.td + (params.tdNeg || params.td * 2);
  const steps = Math.ceil(totalTime / dt) + 10;

  const history: Array<{ t: number; p: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    history.push({ t, p: friedlanderWaveform(t, params) });
  }

  return history;
}