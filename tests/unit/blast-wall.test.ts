import { describe, it, expect } from 'vitest';
import { designSteelPlateWall } from '@/core/blast-wall-steel';
import { designConcreteWall } from '@/core/blast-wall-concrete';

describe('Steel Plate Wall Design', () => {
  it('should design a steel plate wall for basic blast loading', () => {
    const result = designSteelPlateWall(
      0.5,    // 0.5 bar peak overpressure
      50,     // 50 bar·ms impulse
      3.0,    // 3m height
      4.0,    // 4m width
      'simply_supported',
      'A36',
      60,     // span/60 deflection limit
      3.0     // ductility limit
    );

    expect(result).toBeDefined();
    expect(result.requiredThickness).toBeGreaterThan(0);
    expect(result.weightPerUnitArea).toBeGreaterThan(0);
    expect(result.maxDeflection).toBeGreaterThan(0);
    expect(result.supportReaction).toBeGreaterThan(0);
  });

  it('should produce thicker plate for higher overpressure', () => {
    const resultLow = designSteelPlateWall(0.3, 30, 3, 4, 'simply_supported', 'A36');
    const resultHigh = designSteelPlateWall(1.0, 100, 3, 4, 'simply_supported', 'A36');

    expect(resultHigh.requiredThickness).toBeGreaterThan(resultLow.requiredThickness);
  });

  it('should produce thinner plate for higher grade steel', () => {
    const resultA36 = designSteelPlateWall(0.5, 50, 3, 4, 'simply_supported', 'A36');
    const resultA514 = designSteelPlateWall(0.5, 50, 3, 4, 'simply_supported', 'A514');

    expect(resultA514.requiredThickness).toBeLessThanOrEqual(resultA36.requiredThickness);
  });

  it('should handle different boundary conditions', () => {
    const resultSS = designSteelPlateWall(0.5, 50, 3, 4, 'simply_supported', 'A36');
    const resultFF = designSteelPlateWall(0.5, 50, 3, 4, 'fixed_fixed', 'A36');
    const resultCant = designSteelPlateWall(0.5, 50, 3, 4, 'cantilever', 'A36');

    expect(resultSS.requiredThickness).toBeGreaterThan(0);
    expect(resultFF.requiredThickness).toBeGreaterThan(0);
    expect(resultCant.requiredThickness).toBeGreaterThan(0);
    // Fixed-fixed should generally need less thickness than simply supported
    expect(resultFF.requiredThickness).toBeLessThanOrEqual(resultSS.requiredThickness);
  });

  it('should calculate valid support reactions', () => {
    const result = designSteelPlateWall(0.5, 50, 3, 4, 'simply_supported', 'A36');
    expect(result.supportReaction).toBeGreaterThan(0);
    expect(result.shearAtSupport).toBeGreaterThan(0);
  });

  it('should report pass/fail for deflection check', () => {
    const result = designSteelPlateWall(0.5, 50, 3, 4, 'simply_supported', 'A36');
    expect(typeof result.passDeflection).toBe('boolean');
    expect(typeof result.passDuctility).toBe('boolean');
  });

  it('should provide material recommendation', () => {
    const result = designSteelPlateWall(0.5, 50, 3, 4, 'simply_supported', 'A36');
    expect(result.materialRecommendation).toBeTruthy();
    expect(typeof result.materialRecommendation).toBe('string');
  });

  it('should handle large blast loading', () => {
    const result = designSteelPlateWall(2.0, 200, 3, 4, 'fixed_fixed', 'A514');
    expect(result.requiredThickness).toBeGreaterThan(0);
    expect(result.requiredThickness).toBeLessThan(200); // reasonable range
  });
});

describe('Reinforced Concrete Wall Design', () => {
  it('should design an RC wall for basic blast loading', () => {
    const result = designConcreteWall(
      0.5,    // 0.5 bar
      50,     // 50 bar·ms impulse
      3.0,    // 3m height
      4.0,    // 4m width
      'simply_supported'
    );

    expect(result).toBeDefined();
    expect(result.requiredThickness).toBeGreaterThan(0);
    expect(result.weightPerUnitArea).toBeGreaterThan(0);
  });

  it('should produce thicker wall for higher overpressure', () => {
    const resultLow = designConcreteWall(0.3, 30, 3, 4, 'simply_supported');
    const resultHigh = designConcreteWall(1.0, 100, 3, 4, 'simply_supported');
    expect(resultHigh.requiredThickness).toBeGreaterThanOrEqual(resultLow.requiredThickness);
  });
});
