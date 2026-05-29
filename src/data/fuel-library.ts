import { FuelProperties, ReactivityClass } from '../types';

/**
 * Fuel Library with properties for VCE analysis
 * Data sources: NFPA 497, API RP 500, Baker et al. (2012)
 */

export const fuelLibrary: FuelProperties[] = [
  {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    heatOfCombustion: 55500,      // kJ/kg
    laminarBurningVelocity: 0.38, // m/s
    reactivityClass: 'low',
    lowerFlammableLimit: 5.0,
    upperFlammableLimit: 15.0,
    vaporDensity: 0.55,
    molecularWeight: 16.04
  },
  {
    id: 'ethane',
    name: 'Ethane',
    formula: 'C₂H₆',
    heatOfCombustion: 51890,
    laminarBurningVelocity: 0.45,
    reactivityClass: 'low',
    lowerFlammableLimit: 3.0,
    upperFlammableLimit: 12.4,
    vaporDensity: 1.04,
    molecularWeight: 30.07
  },
  {
    id: 'propane',
    name: 'Propane',
    formula: 'C₃H₈',
    heatOfCombustion: 50350,
    laminarBurningVelocity: 0.46,
    reactivityClass: 'medium',
    lowerFlammableLimit: 2.1,
    upperFlammableLimit: 9.5,
    vaporDensity: 1.52,
    molecularWeight: 44.10
  },
  {
    id: 'n-butane',
    name: 'n-Butane',
    formula: 'C₄H₁₀',
    heatOfCombustion: 49500,
    laminarBurningVelocity: 0.40,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.8,
    upperFlammableLimit: 8.4,
    vaporDensity: 2.01,
    molecularWeight: 58.12
  },
  {
    id: 'ethylene',
    name: 'Ethylene',
    formula: 'C₂H₄',
    heatOfCombustion: 50300,
    laminarBurningVelocity: 0.70,
    reactivityClass: 'high',
    lowerFlammableLimit: 2.75,
    upperFlammableLimit: 28.6,
    vaporDensity: 0.97,
    molecularWeight: 28.05
  },
  {
    id: 'propylene',
    name: 'Propylene',
    formula: 'C₃H₆',
    heatOfCombustion: 49000,
    laminarBurningVelocity: 0.50,
    reactivityClass: 'high',
    lowerFlammableLimit: 2.0,
    upperFlammableLimit: 11.1,
    vaporDensity: 1.49,
    molecularWeight: 42.08
  },
  {
    id: 'hydrogen',
    name: 'Hydrogen',
    formula: 'H₂',
    heatOfCombustion: 120000,      // Very high heat of combustion
    laminarBurningVelocity: 2.0,   // Very fast burning
    reactivityClass: 'high',
    lowerFlammableLimit: 4.0,
    upperFlammableLimit: 75.0,
    vaporDensity: 0.07,
    molecularWeight: 2.02
  },
  {
    id: 'acetylene',
    name: 'Acetylene',
    formula: 'C₂H₂',
    heatOfCombustion: 48000,
    laminarBurningVelocity: 1.55,
    reactivityClass: 'high',
    lowerFlammableLimit: 2.5,
    upperFlammableLimit: 82.0,
    vaporDensity: 0.91,
    molecularWeight: 26.04
  },
  {
    id: 'n-pentane',
    name: 'n-Pentane',
    formula: 'C₅H₁₂',
    heatOfCombustion: 48650,
    laminarBurningVelocity: 0.43,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.4,
    upperFlammableLimit: 7.8,
    vaporDensity: 2.48,
    molecularWeight: 72.15
  },
  {
    id: 'n-hexane',
    name: 'n-Hexane',
    formula: 'C₆H₁₄',
    heatOfCombustion: 48300,
    laminarBurningVelocity: 0.42,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.2,
    upperFlammableLimit: 7.5,
    vaporDensity: 2.97,
    molecularWeight: 86.18
  },
  {
    id: 'benzene',
    name: 'Benzene',
    formula: 'C₆H₆',
    heatOfCombustion: 40590,
    laminarBurningVelocity: 0.44,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.2,
    upperFlammableLimit: 7.1,
    vaporDensity: 2.77,
    molecularWeight: 78.11
  },
  {
    id: 'toluene',
    name: 'Toluene',
    formula: 'C₇H₈',
    heatOfCombustion: 41000,
    laminarBurningVelocity: 0.39,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.2,
    upperFlammableLimit: 7.1,
    vaporDensity: 3.14,
    molecularWeight: 92.14
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    formula: 'NH₃',
    heatOfCombustion: 18650,
    laminarBurningVelocity: 0.08,
    reactivityClass: 'low',
    lowerFlammableLimit: 15.0,
    upperFlammableLimit: 28.0,
    vaporDensity: 0.59,
    molecularWeight: 17.03
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    heatOfCombustion: 29700,
    laminarBurningVelocity: 0.40,
    reactivityClass: 'low',
    lowerFlammableLimit: 3.3,
    upperFlammableLimit: 19.0,
    vaporDensity: 1.59,
    molecularWeight: 46.07
  },
  {
    id: 'methanol',
    name: 'Methanol',
    formula: 'CH₃OH',
    heatOfCombustion: 22700,
    laminarBurningVelocity: 0.55,
    reactivityClass: 'low',
    lowerFlammableLimit: 6.0,
    upperFlammableLimit: 36.0,
    vaporDensity: 1.11,
    molecularWeight: 32.04
  },
  {
    id: 'lng',
    name: 'LNG (Natural Gas Mix)',
    formula: 'CH₄ + C₂H₆ + ...',
    heatOfCombustion: 52000,
    laminarBurningVelocity: 0.45,
    reactivityClass: 'low',
    lowerFlammableLimit: 5.0,
    upperFlammableLimit: 15.0,
    vaporDensity: 0.60,
    molecularWeight: 18.0
  },
  {
    id: 'lpg',
    name: 'LPG (Propane/Butane Mix)',
    formula: 'C₃H₈ + C₄H₁₀',
    heatOfCombustion: 50000,
    laminarBurningVelocity: 0.43,
    reactivityClass: 'medium',
    lowerFlammableLimit: 2.0,
    upperFlammableLimit: 9.0,
    vaporDensity: 1.60,
    molecularWeight: 51.0
  },
  {
    id: 'cyclohexane',
    name: 'Cyclohexane',
    formula: 'C₆H₁₂',
    heatOfCombustion: 43300,
    laminarBurningVelocity: 0.43,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.2,
    upperFlammableLimit: 7.7,
    vaporDensity: 2.90,
    molecularWeight: 84.16
  },
  {
    id: '1-butene',
    name: '1-Butene',
    formula: 'C₄H₈',
    heatOfCombustion: 47000,
    laminarBurningVelocity: 0.48,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.6,
    upperFlammableLimit: 10.0,
    vaporDensity: 1.95,
    molecularWeight: 56.11
  },
  {
    id: '2-methylpropane',
    name: '2-Methylpropane (Isobutane)',
    formula: 'C₄H₁₀',
    heatOfCombustion: 49200,
    laminarBurningVelocity: 0.41,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.8,
    upperFlammableLimit: 8.4,
    vaporDensity: 2.01,
    molecularWeight: 58.12
  },
  {
    id: 'carbon-monoxide',
    name: 'Carbon Monoxide',
    formula: 'CO',
    heatOfCombustion: 10100,
    laminarBurningVelocity: 0.43,
    reactivityClass: 'low',
    lowerFlammableLimit: 12.5,
    upperFlammableLimit: 74.0,
    vaporDensity: 0.97,
    molecularWeight: 28.01
  },
  {
    id: 'vinyl-chloride',
    name: 'Vinyl Chloride',
    formula: 'C₂H₃Cl',
    heatOfCombustion: 19000,
    laminarBurningVelocity: 0.47,
    reactivityClass: 'medium',
    lowerFlammableLimit: 3.6,
    upperFlammableLimit: 31.0,
    vaporDensity: 2.15,
    molecularWeight: 62.50
  },
  {
    id: 'styrene',
    name: 'Styrene',
    formula: 'C₈H₈',
    heatOfCombustion: 41600,
    laminarBurningVelocity: 0.41,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.1,
    upperFlammableLimit: 6.1,
    vaporDensity: 3.61,
    molecularWeight: 104.15
  },
  {
    id: 'isobutylene',
    name: 'Isobutylene',
    formula: 'C₄H₈',
    heatOfCombustion: 47000,
    laminarBurningVelocity: 0.47,
    reactivityClass: 'medium',
    lowerFlammableLimit: 1.8,
    upperFlammableLimit: 9.6,
    vaporDensity: 1.95,
    molecularWeight: 56.11
  },
  {
    id: 'propadiene',
    name: 'Propadiene (Allene)',
    formula: 'C₃H₄',
    heatOfCombustion: 49000,
    laminarBurningVelocity: 0.60,
    reactivityClass: 'high',
    lowerFlammableLimit: 1.5,
    upperFlammableLimit: 11.5,
    vaporDensity: 1.38,
    molecularWeight: 40.06
  },
  {
    id: '1,3-butadiene',
    name: '1,3-Butadiene',
    formula: 'C₄H₆',
    heatOfCombustion: 47000,
    laminarBurningVelocity: 0.55,
    reactivityClass: 'high',
    lowerFlammableLimit: 2.0,
    upperFlammableLimit: 12.0,
    vaporDensity: 1.87,
    molecularWeight: 54.09
  },
  {
    id: 'propylene-oxide',
    name: 'Propylene Oxide',
    formula: 'C₃H₆O',
    heatOfCombustion: 31000,
    laminarBurningVelocity: 0.70,
    reactivityClass: 'high',
    lowerFlammableLimit: 2.3,
    upperFlammableLimit: 36.0,
    vaporDensity: 1.94,
    molecularWeight: 58.08
  },
  {
    id: 'epichlorohydrin',
    name: 'Epichlorohydrin',
    formula: 'C₃H₅ClO',
    heatOfCombustion: 22000,
    laminarBurningVelocity: 0.50,
    reactivityClass: 'medium',
    lowerFlammableLimit: 3.8,
    upperFlammableLimit: 21.0,
    vaporDensity: 3.29,
    molecularWeight: 92.52
  },
  {
    id: 'acetone',
    name: 'Acetone',
    formula: 'C₃H₆O',
    heatOfCombustion: 28700,
    laminarBurningVelocity: 0.38,
    reactivityClass: 'low',
    lowerFlammableLimit: 2.6,
    upperFlammableLimit: 12.8,
    vaporDensity: 2.00,
    molecularWeight: 58.08
  },
  {
    id: 'methyl-ethyl-ketone',
    name: 'Methyl Ethyl Ketone (MEK)',
    formula: 'C₄H₈O',
    heatOfCombustion: 29500,
    laminarBurningVelocity: 0.39,
    reactivityClass: 'low',
    lowerFlammableLimit: 1.8,
    upperFlammableLimit: 10.0,
    vaporDensity: 2.41,
    molecularWeight: 72.11
  },
  {
    id: 'butadiene',
    name: 'Butadiene',
    formula: 'C₄H₆',
    heatOfCombustion: 47000,
    laminarBurningVelocity: 0.55,
    reactivityClass: 'high',
    lowerFlammableLimit: 2.0,
    upperFlammableLimit: 12.0,
    vaporDensity: 1.87,
    molecularWeight: 54.09
  },
  {
    id: 'isopropyl-alcohol',
    name: 'Isopropyl Alcohol',
    formula: 'C₃H₈O',
    heatOfCombustion: 30500,
    laminarBurningVelocity: 0.40,
    reactivityClass: 'low',
    lowerFlammableLimit: 2.0,
    upperFlammableLimit: 12.0,
    vaporDensity: 2.00,
    molecularWeight: 60.10
  }
];