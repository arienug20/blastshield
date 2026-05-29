# BlastShield — Blast Wall Designer

A production-ready web-based tool for blast wall and blast-resistant panel design against Vapor Cloud Explosions (VCE). Built for process safety engineers, structural engineers, and facilities engineers.

![BlastShield](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### VCE Analysis Module
- **Baker-Strehlow-Tang (BST) Method** - Industry-standard for VCE blast prediction
- **TNT Equivalent Method** - Quick cross-check with TNT equivalency
- **TNO Multi-Energy Method** - Source strength-based blast assessment
- **Fuel Library** - 30+ fuels with accurate properties (methane, propane, hydrogen, etc.)
- **Congestion Assessment Tool** - Guided questionnaire for objective congestion rating

### Blast Loading Module
- **Friedlander Waveform** - Pressure-time history modeling
- **SDOF Analysis** - Single Degree of Freedom structural response (Newmark-β integration)
- **Dynamic Load Factor (DLF)** - Quick DLF calculator for different load shapes
- **P-I Diagrams** - Interactive pressure-impulse damage assessment

### Blast Wall Design Module
- **Steel Plate Wall Sizing** - Yield line theory for steel plates
- **Reinforced Concrete Wall Sizing** - Ultimate strength design with DIF
- **Connection/Anchor Design** - ACI 318 Appendix D compliant
- **Material Library** - Steel grades (A36, A572, A514, SS304/316), concrete grades (C25-C50, UHPC)
- **Pass/Fail Checks** - Deflection and ductility criteria

### Visualization Module
- **Overpressure Contour Maps** - 2D plan view with d3-contour
- **Damage Zone Rings** - Safe/unsafe zone visualization
- **Pressure-Time Charts** - Animated Friedlander waveforms
- **P-I Diagrams** - Interactive log-log charts

### Safe Distance Calculator
- Personnel safe distances (eardrum protection, lung damage)
- Building damage thresholds (no damage to collapse)
- Equipment vulnerability criteria

### Project Management
- Save/load projects (IndexedDB persistence)
- Auto-save functionality
- Export reports (PDF and JSON)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite + TypeScript |
| State | Zustand (with persist middleware) |
| UI | TailwindCSS |
| Charts | D3.js (d3-contour, d3-geo) |
| PDF | pdfmake |
| Testing | Vitest + Playwright |
| CI/CD | GitHub Actions |

## Installation

```bash
git clone https://github.com/arienug20/blastshield.git
cd blastshield
npm install
```

## Development

```bash
# Start development server
npm run dev

# Run unit tests
npm run test:unit

# Run tests with coverage
npm run test:unit:coverage

# Run E2E tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Quick Start

### 1. Run VCE Analysis

```typescript
import { runBSTAnalysis } from './core/baker-strehlow';

const result = runBSTAnalysis(
  'methane',           // fuel ID
  1000,                // flammable mass (kg)
  '2D',                // confinement level
  'medium',            // congestion level
  50,                  // standoff distance (m)
  1.013,               // ambient pressure (bar)
  293                  // ambient temperature (K)
);

console.log(`Peak overpressure: ${result.peakOverpressure} bar`);
console.log(`Flame speed: ${result.flameSpeed} Mach`);
```

### 2. Design Steel Plate Wall

```typescript
import { designSteelPlateWall } from './core/blast-wall-steel';

const design = designSteelPlateWall(
  0.5,                 // peak overpressure (bar)
  5.0,                 // positive phase impulse (bar·ms)
  3.0,                 // wall height (m)
  4.0,                 // wall width (m)
  'fixed_fixed',       // boundary condition
  'A36',               // steel grade
  60,                  // deflection limit (span/XX)
  3.0                  // ductility limit
);

console.log(`Required thickness: ${design.requiredThickness} mm`);
console.log(`Max deflection: ${design.maxDeflection} mm`);
console.log(`Pass deflection: ${design.passDeflection}`);
console.log(`Pass ductility: ${design.passDuctility}`);
```

### 3. Calculate Safe Distances

```typescript
import { calculateBSTSafeDistances, SAFE_DISTANCE_THRESHOLDS } from './core/safe-distance';

const safeDistances = calculateBSTSafeDistances(
  (r) => runBSTAnalysis('propane', 2000, '2D', 'medium', r, 1.013, 293),
  SAFE_DISTANCE_THRESHOLDS
);

safeDistances.distances.forEach(d => {
  console.log(`${d.label}: ${d.distance.toFixed(2)} m`);
});
```

## Compliance References

- API RP 752 - Management of Hazards Associated with Location of Process Plant Permanent Buildings
- API RP 753 - Management of Hazards Associated with Location of Process Plant Portable Buildings
- ASCE "Design of Blast-Resistant Buildings in Petrochemical Facilities"
- UFC 3-340-02 - Structures to Resist the Effects of Accidental Explosions
- Baker et al. "Explosion Hazards and Evaluation"
- ACI 318 Appendix D - Anchoring to Concrete

## Documentation

- [Getting Started Guide](./docs/getting-started.md) (coming soon)
- [VCE Analysis Tutorial](./docs/vce-tutorial.md) (coming soon)
- [Blast Wall Design Walkthrough](./docs/blast-wall-walkthrough.md) (coming soon)
- [P-I Diagram Guide](./docs/pi-diagram-guide.md) (coming soon)
- [Glossary of Blast Terminology](./docs/glossary.md) (coming soon)

## Testing

### Unit Tests

```bash
npm run test:unit
```

Tests include:
- BST method validation (12+ test cases)
- TNT equivalent method validation (6+ test cases)
- SDOF analysis validation
- Wall sizing validation
- Material property validation

### E2E Tests

```bash
npm run test:e2e
```

Tests include:
- VCE workflow end-to-end
- Wall design workflow
- Project save/load
- Report export

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Baker-Strehlow-Tang method based on Baker, Strehlow, & Tang (1994) and Baker et al. (2012)
- TNT equivalent curves from Kingery & Bulmash
- TNO multi-energy method from TNO Green Book
- Structural design following UFC 3-340-02 and ACI 318
- SDOF analysis methodology from Biggs (1964)

---

**BlastShield** — Engineering tools for safer process facilities.

Made with ⚡ by Arie Nugraha