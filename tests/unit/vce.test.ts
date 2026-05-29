import { describe, it, expect } from 'vitest';
import { runBSTAnalysis } from '@/core/baker-strehlow';
import { runTNTAnalysis } from '@/core/tnt-equivalent';

describe('BST Method', () => {
  it('should calculate BST analysis for methane', () => {
    const result = runBSTAnalysis(
      'methane',
      1000,
      '2D',
      'low',
      50,
      1.013,
      293
    );

    expect(result).toBeDefined();
    expect(result.peakOverpressure).toBeGreaterThan(0);
    expect(result.positivePhaseImpulse).toBeGreaterThan(0);
    expect(result.positivePhaseDuration).toBeGreaterThan(0);
    expect(result.flameSpeed).toBeGreaterThan(0);
  });

  it('should calculate BST analysis for propane', () => {
    const result = runBSTAnalysis(
      'propane',
      2000,
      '2D',
      'medium',
      30,
      1.013,
      293
    );

    expect(result).toBeDefined();
    expect(result.peakOverpressure).toBeGreaterThan(0);
    expect(result.flameSpeed).toBeGreaterThan(0);
  });

  it('should calculate BST analysis for hydrogen', () => {
    const result = runBSTAnalysis(
      'hydrogen',
      500,
      '2D',
      'high',
      20,
      1.013,
      293
    );

    expect(result).toBeDefined();
    expect(result.peakOverpressure).toBeGreaterThan(0);
    expect(result.flameSpeed).toBeGreaterThan(1.0);
  });

  it('should produce different results for different confinement levels', () => {
    const result1D = runBSTAnalysis('propane', 1000, '1D', 'medium', 50, 1.013, 293);
    const result2D = runBSTAnalysis('propane', 1000, '2D', 'medium', 50, 1.013, 293);
    const result3D = runBSTAnalysis('propane', 1000, '3D', 'medium', 50, 1.013, 293);

    expect(result1D.flameSpeed).toBeLessThan(result2D.flameSpeed);
    expect(result2D.flameSpeed).toBeLessThan(result3D.flameSpeed);
  });

  it('should produce different results for different congestion levels', () => {
    const resultLow = runBSTAnalysis('propane', 1000, '2D', 'low', 50, 1.013, 293);
    const resultHigh = runBSTAnalysis('propane', 1000, '2D', 'high', 50, 1.013, 293);

    expect(resultLow.flameSpeed).toBeLessThan(resultHigh.flameSpeed);
    expect(resultLow.peakOverpressure).toBeLessThan(resultHigh.peakOverpressure);
  });

  it('should handle larger distances producing lower overpressure', () => {
    const resultNear = runBSTAnalysis('propane', 1000, '2D', 'medium', 20, 1.013, 293);
    const resultFar = runBSTAnalysis('propane', 1000, '2D', 'medium', 100, 1.013, 293);

    expect(resultNear.peakOverpressure).toBeGreaterThan(resultFar.peakOverpressure);
  });

  it('should calculate valid scaled distance', () => {
    const result = runBSTAnalysis('propane', 2000, '2D', 'medium', 50, 1.013, 293);
    expect(result.scaledDistance).toBeGreaterThan(0);
  });

  it('should return valid arrival time', () => {
    const result = runBSTAnalysis('methane', 1000, '2D', 'low', 50, 1.013, 293);
    expect(result.arrivalTime).toBeGreaterThan(0);
    expect(result.arrivalTime).toBeLessThan(10000); // reasonable range in ms
  });

  it('should return peak dynamic pressure', () => {
    const result = runBSTAnalysis('propane', 2000, '2D', 'medium', 30, 1.013, 293);
    expect(result.peakDynamicPressure).toBeGreaterThan(0);
    expect(result.peakDynamicPressure).toBeLessThanOrEqual(result.peakOverpressure * 3);
  });

  it('should handle ethylene (high reactivity) correctly', () => {
    const result = runBSTAnalysis('ethylene', 3000, '2.5D', 'medium', 80, 1.013, 293);
    expect(result).toBeDefined();
    expect(result.peakOverpressure).toBeGreaterThan(0);
    expect(result.flameSpeed).toBeGreaterThan(0);
  });

  it('should handle butane with 1D confinement and low congestion', () => {
    const result = runBSTAnalysis('n-butane', 1000, '1D', 'low', 100, 1.013, 293);
    expect(result).toBeDefined();
    expect(result.peakOverpressure).toBeGreaterThan(0);
    expect(result.flameSpeed).toBeGreaterThan(0);
  });

  it('should produce higher overpressure for larger flammable mass at same distance', () => {
    const resultSmall = runBSTAnalysis('propane', 1000, '2D', 'medium', 50, 1.013, 293);
    const resultLarge = runBSTAnalysis('propane', 5000, '2D', 'medium', 50, 1.013, 293);
    expect(resultLarge.peakOverpressure).toBeGreaterThan(resultSmall.peakOverpressure);
  });
});

describe('TNT Equivalent Method', () => {
  it('should calculate TNT equivalent analysis', () => {
    const result = runTNTAnalysis(
      1000,
      50030,
      0.10,
      50,
      1.013
    );

    expect(result).toBeDefined();
    expect(result.tntEquivalentMass).toBeGreaterThan(0);
    expect(result.peakOverpressure).toBeGreaterThan(0);
    expect(result.positivePhaseImpulse).toBeGreaterThan(0);
    expect(result.scaledDistance).toBeGreaterThan(0);
  });

  it('should scale TNT mass correctly', () => {
    const result10Percent = runTNTAnalysis(1000, 50030, 0.10, 50, 1.013);
    const result20Percent = runTNTAnalysis(1000, 50030, 0.20, 50, 1.013);

    expect(result20Percent.tntEquivalentMass).toBeGreaterThan(result10Percent.tntEquivalentMass);
    expect(result20Percent.peakOverpressure).toBeGreaterThan(result10Percent.peakOverpressure);
  });

  it('should handle zero efficiency', () => {
    const result = runTNTAnalysis(1000, 50030, 0.0, 50, 1.013);
    expect(result.tntEquivalentMass).toBe(0);
    expect(result.peakOverpressure).toBe(0);
  });

  it('should handle different fuels with different heat of combustion', () => {
    const resultPropane = runTNTAnalysis(1000, 50030, 0.10, 50, 1.013);
    const resultHydrogen = runTNTAnalysis(1000, 120000, 0.10, 50, 1.013);

    expect(resultHydrogen.tntEquivalentMass).toBeGreaterThan(resultPropane.tntEquivalentMass);
    expect(resultHydrogen.peakOverpressure).toBeGreaterThan(resultPropane.peakOverpressure);
  });

  it('should calculate positive phase duration', () => {
    const result = runTNTAnalysis(1000, 50030, 0.10, 50, 1.013);
    expect(result.positivePhaseDuration).toBeGreaterThan(0);
  });

  it('should calculate arrival time', () => {
    const result = runTNTAnalysis(1000, 50030, 0.10, 50, 1.013);
    expect(result.arrivalTime).toBeGreaterThan(0);
  });
});

describe('Method Comparison', () => {
  it('should produce results in reasonable range for typical scenarios', () => {
    const bstResult = runBSTAnalysis('propane', 2000, '2D', 'medium', 50, 1.013, 293);
    const tntResult = runTNTAnalysis(2000, 50030, 0.10, 50, 1.013);

    expect(bstResult.peakOverpressure).toBeGreaterThan(0.01);
    expect(bstResult.peakOverpressure).toBeLessThan(10);
    expect(tntResult.peakOverpressure).toBeGreaterThan(0.01);
    expect(tntResult.peakOverpressure).toBeLessThan(10);
  });

  it('should show hydrogen producing higher overpressure than methane for same conditions', () => {
    const methane = runBSTAnalysis('methane', 1000, '2D', 'medium', 30, 1.013, 293);
    const hydrogen = runBSTAnalysis('hydrogen', 1000, '2D', 'medium', 30, 1.013, 293);
    expect(hydrogen.flameSpeed).toBeGreaterThan(methane.flameSpeed);
  });
});
