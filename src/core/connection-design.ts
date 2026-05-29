import type { ConnectionOutput } from '../types';

/**
 * Connection and Anchor Design
 * Based on ACI 318 Appendix D and steel connection design
 */

/**
 * Run Anchor Design
 */
export function designAnchor(
  tensionForce: number,      // kN
  shearForce: number,        // kN
  concreteStrength: number,  // MPa (f'c)
  embedmentDepth?: number,   // mm (optional, will calculate)
  edgeDistance: number = 100 // mm
): ConnectionOutput {
  // Use standard anchor bolt grades
  const anchorGrade = 8.8; // Grade 8.8 bolt
  const anchorFy = 640;    // MPa
  const anchorFu = 800;    // MPa

  // Load combinations (ASD)
  const tensionDemand = tensionForce; // kN
  const shearDemand = shearForce;     // kN

  // Combined load check: sqrt((T/Tn)² + (V/Vn)²) <= 1.0
  // We'll calculate capacity first, then check diameter

  // Start with M16 (16mm diameter)
  let anchorDiameter = 16; // mm
  let anchorCount = 1;
  let anchorEmbedment = embedmentDepth || 100; // mm

  // Iterate to find suitable anchor
  while (true) {
    // Anchor steel strength in tension
    const anchorArea = Math.PI * Math.pow(anchorDiameter / 2, 2);
    const steelTensionCapacity = (anchorArea * anchorFu) / 1000; // kN

    // Anchor steel strength in shear
    const steelShearCapacity = 0.6 * (anchorArea * anchorFu) / 1000; // kN

    // Concrete breakout capacity (ACI 318 Appendix D)
    // Tension: Ncb = (Ac/Aco) × ψed,N × ψc,N × ψcp,N × Nbo
    // Simplified: Ncb = 15 × sqrt(f'c) × hef^2
    const concreteBreakoutCapacity = 15 * Math.sqrt(concreteStrength) * Math.pow(anchorEmbedment, 2) / 1000; // kN

    // Design capacity (use minimum of steel and concrete)
    const tensionCapacity = Math.min(steelTensionCapacity, concreteBreakoutCapacity * anchorCount);
    const shearCapacity = Math.min(steelShearCapacity, 2 * concreteBreakoutCapacity * anchorCount);

    // Combined load check
    const ratio = Math.sqrt(
      Math.pow(tensionDemand / tensionCapacity, 2) +
      Math.pow(shearDemand / shearCapacity, 2)
    );

    if (ratio <= 1.0) {
      // Design is adequate
      break;
    }

    // Increase anchor size or count
    if (anchorDiameter < 32) {
      anchorDiameter += 4;
    } else {
      anchorCount++;
      anchorDiameter = 16;
    }

    // Increase embedment if needed
    if (anchorEmbedment < 200) {
      anchorEmbedment += 25;
    }

    // Safety limit
    if (anchorDiameter > 36 || anchorCount > 8) {
      break;
    }
  }

  // Base plate thickness
  // t = sqrt(6 × M / (fy × b))
  const basePlateWidth = anchorDiameter * 2 + 50; // mm
  const plateFy = 250; // MPa (A36)
  const moment = (tensionForce * 1000 * basePlateWidth) / 8; // N·mm (approximate)
  const basePlateThickness = Math.sqrt(6 * moment / (plateFy * anchorCount * basePlateWidth));
  const basePlateThicknessRounded = Math.ceil(basePlateThickness);

  // Weld size (fillet weld)
  // Weld leg size ≈ 0.7 × plate thickness (min 4mm, max plate thickness)
  const weldSize = Math.max(4, Math.min(Math.ceil(basePlateThicknessRounded * 0.7), basePlateThicknessRounded));

  // Recalculate capacities with final design
  const anchorArea = Math.PI * Math.pow(anchorDiameter / 2, 2);
  const steelTensionCapacity = (anchorArea * 800) / 1000 * anchorCount;
  const concreteBreakoutCapacity = 15 * Math.sqrt(concreteStrength) * Math.pow(anchorEmbedment, 2) / 1000 * anchorCount;
  const tensionCapacity = Math.min(steelTensionCapacity, concreteBreakoutCapacity);
  const shearCapacity = Math.min(0.6 * steelTensionCapacity, 2 * concreteBreakoutCapacity);

  // Demand/Capacity ratio
  const demandCapacityRatio = Math.sqrt(
    Math.pow(tensionDemand / tensionCapacity, 2) +
    Math.pow(shearDemand / shearCapacity, 2)
  );

  return {
    anchorDiameter,
    anchorEmbedment,
    anchorCount,
    basePlateThickness: basePlateThicknessRounded,
    weldSize,
    concreteBreakoutCapacity,
    demandCapacityRatio
  };
}