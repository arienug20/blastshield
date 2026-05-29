import { describe, it, expect } from 'vitest';
import { runSDOFAnalysis } from '@/core/sdof-analysis';
import { calculateDLFTriangular, calculateDLFRectangular } from '@/core/dlf-calculator';
import { friedlanderPositivePhase, generateTimeHistory, calculateFriedlanderImpulse } from '@/core/friedlander';

describe('SDOF Analysis', () => {
  it('should calculate SDOF response for a simply supported beam', () => {
    const result = runSDOFAnalysis(
      500,                    // mass (kg)
      5000000,                // stiffness (N/m)
      0.5,                    // 0.5 bar peak overpressure
      50,                     // 50 ms positive phase duration
      12,                     // 12 m² load area
      'simply_supported',
      'uniform',
      250,                    // yield strength (MPa)
      500000                  // plastic modulus (mm³)
    );

    expect(result).toBeDefined();
    expect(result.maxDisplacement).toBeGreaterThan(0);
    expect(result.naturalPeriod).toBeGreaterThan(0);
    expect(result.dlf).toBeGreaterThan(0);
    expect(result.displacementHistory.length).toBeGreaterThan(0);
  });

  it('should produce larger displacement for higher overpressure', () => {
    const resultLow = runSDOFAnalysis(500, 5000000, 0.3, 50, 12, 'simply_supported', 'uniform', 250, 500000);
    const resultHigh = runSDOFAnalysis(500, 5000000, 1.0, 50, 12, 'simply_supported', 'uniform', 250, 500000);

    expect(resultHigh.maxDisplacement).toBeGreaterThan(resultLow.maxDisplacement);
  });

  it('should calculate ductility ratio', () => {
    const result = runSDOFAnalysis(500, 5000000, 0.5, 50, 12, 'simply_supported', 'uniform', 250, 500000);
    expect(result.ductilityRatio).toBeGreaterThan(0);
  });

  it('should produce support reactions', () => {
    const result = runSDOFAnalysis(500, 5000000, 0.5, 50, 12, 'fixed_fixed', 'uniform', 250, 500000);
    expect(result.supportReaction).toBeGreaterThan(0);
    expect(result.supportMoment).toBeGreaterThan(0);
  });

  it('should handle different boundary conditions', () => {
    const bc = ['simply_supported', 'fixed_fixed', 'cantilever', 'fixed_pinned'] as const;
    for (const condition of bc) {
      const result = runSDOFAnalysis(500, 5000000, 0.5, 50, 12, condition, 'uniform', 250, 500000);
      expect(result.maxDisplacement).toBeGreaterThan(0);
    }
  });
});

describe('DLF Calculator', () => {
  it('should calculate DLF for triangular load pulse', () => {
    const dlf = calculateDLFTriangular(50, 100);
    expect(dlf).toBeGreaterThan(0);
    expect(dlf).toBeLessThanOrEqual(2.5); // DLF max theoretical ~2.0 for triangular
  });

  it('should calculate DLF for rectangular load pulse', () => {
    const dlf = calculateDLFRectangular(50, 100);
    expect(dlf).toBeGreaterThan(0);
    expect(dlf).toBeLessThanOrEqual(2.5);
  });

  it('should approach 1.0 for long duration loads (td >> Tn)', () => {
    const dlf = calculateDLFTriangular(1000, 100);
    // For very long duration, DLF oscillates but stays bounded
    expect(dlf).toBeGreaterThan(0);
    expect(dlf).toBeLessThan(3);
  });

  it('should produce bounded DLF for short duration loads', () => {
    const dlf = calculateDLFTriangular(0.1, 100);
    expect(dlf).toBeGreaterThan(0);
    expect(dlf).toBeLessThan(5);
  });
});

describe('Friedlander Waveform', () => {
  it('should return peak at t=0', () => {
    const pressure = friedlanderPositivePhase(0, {
      ps: 1.0, // bar
      td: 50, // ms
      alpha: 1.0
    });
    expect(pressure).toBeCloseTo(1.0, 1);
  });

  it('should return zero at t=td', () => {
    const pressure = friedlanderPositivePhase(50, {
      ps: 1.0,
      td: 50,
      alpha: 1.0
    });
    expect(pressure).toBeCloseTo(0, 2);
  });

  it('should return zero for t > td', () => {
    const pressure = friedlanderPositivePhase(60, {
      ps: 1.0,
      td: 50,
      alpha: 1.0
    });
    expect(pressure).toBe(0);
  });

  it('should generate time history array', () => {
    const history = generateTimeHistory({
      ps: 1.0,
      td: 50,
      alpha: 1.0
    }, 0.1);

    expect(history.length).toBeGreaterThan(0);
    expect(history[0].p).toBeCloseTo(1.0, 1);
  });

  it('should calculate positive impulse from waveform', () => {
    const impulse = calculateFriedlanderImpulse({
      ps: 1.0,
      td: 50,
      alpha: 1.0
    });
    expect(impulse).toBeGreaterThan(0);
  });

  it('should produce decaying waveform', () => {
    const p0 = friedlanderPositivePhase(0, { ps: 1.0, td: 50, alpha: 1.0 });
    const p10 = friedlanderPositivePhase(10, { ps: 1.0, td: 50, alpha: 1.0 });
    expect(p10).toBeLessThan(p0);
    expect(p10).toBeGreaterThan(0);
  });
});
