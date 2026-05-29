import { describe, it, expect } from 'vitest';
import { runBSTAnalysis } from '../src/core/baker-strehlow';
import { runTNTAnalysis } from '../src/core/tnt-equivalent';

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
    // Hydrogen should have higher overpressure due to high reactivity
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
});

describe('TNT Equivalent Method', () => {
  it('should calculate TNT equivalent analysis', () => {
    const result = runTNTAnalysis(
      1000,
      50030, // Propane heat of combustion
      0.10,  // 10% efficiency
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
});

describe('Method Comparison', () => {
  it('should produce results in reasonable range for typical scenarios', () => {
    const bstResult = runBSTAnalysis('propane', 2000, '2D', 'medium', 50, 1.013, 293);
    const tntResult = runTNTAnalysis(2000, 50030, 0.10, 50, 1.013);

    // Both should produce overpressure in range 0.01 - 10 bar for this scenario
    expect(bstResult.peakOverpressure).toBeGreaterThan(0.01);
    expect(bstResult.peakOverpressure).toBeLessThan(10);
    expect(tntResult.peakOverpressure).toBeGreaterThan(0.01);
    expect(tntResult.peakOverpressure).toBeLessThan(10);
  });
});