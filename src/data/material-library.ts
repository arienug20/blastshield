/**
 * Material Library
 * Steel, concrete, and rebar grades with properties
 */

// Steel grades
export const steelGrades = {
  A36: {
    id: 'A36',
    name: 'A36',
    fy: 250,      // MPa - Yield strength
    fu: 400,      // MPa - Ultimate strength
    E: 200000,    // MPa - Modulus of elasticity
    elongation: 23,
    usage: 'General structural',
    density: 7850 // kg/m³
  },
  A572_Gr50: {
    id: 'A572_Gr50',
    name: 'A572 Gr.50',
    fy: 345,
    fu: 450,
    E: 200000,
    elongation: 21,
    usage: 'High-strength',
    density: 7850
  },
  A516_Gr70: {
    id: 'A516_Gr70',
    name: 'A516 Gr.70',
    fy: 260,
    fu: 485,
    E: 200000,
    elongation: 21,
    usage: 'Pressure vessel',
    density: 7850
  },
  A992: {
    id: 'A992',
    name: 'A992',
    fy: 345,
    fu: 450,
    E: 200000,
    elongation: 21,
    usage: 'Structural shapes',
    density: 7850
  },
  A514: {
    id: 'A514',
    name: 'A514',
    fy: 690,
    fu: 760,
    E: 200000,
    elongation: 13,
    usage: 'High-strength plate',
    density: 7850
  },
  SS304: {
    id: 'SS304',
    name: 'SS 304',
    fy: 205,
    fu: 515,
    E: 193000,
    elongation: 40,
    usage: 'Corrosive environment',
    density: 8000
  },
  SS316: {
    id: 'SS316',
    name: 'SS 316',
    fy: 205,
    fu: 515,
    E: 193000,
    elongation: 40,
    usage: 'Marine environment',
    density: 8000
  }
};

// Concrete grades
export const concreteGrades = {
  C25_30: {
    id: 'C25_30',
    name: 'C25/30',
    fc: 25,        // MPa - Compressive strength
    Ec: 31000,     // MPa - Modulus of elasticity
    density: 2400, // kg/m³
    usage: 'General purpose'
  },
  C30_37: {
    id: 'C30_37',
    name: 'C30/37',
    fc: 30,
    Ec: 33000,
    density: 2400,
    usage: 'Standard blast'
  },
  C40_50: {
    id: 'C40_50',
    name: 'C40/50',
    fc: 40,
    Ec: 35000,
    density: 2400,
    usage: 'High-strength blast'
  },
  C50_60: {
    id: 'C50_60',
    name: 'C50/60',
    fc: 50,
    Ec: 37000,
    density: 2400,
    usage: 'Very high load'
  },
  UHPC: {
    id: 'UHPC',
    name: 'UHPC',
    fc: 150,
    Ec: 50000,
    density: 2500,
    usage: 'Extreme blast'
  }
};

// Rebar grades
export const rebarGrades = {
  Grade300: {
    id: 'Grade300',
    name: 'Grade 300',
    fy: 300,  // MPa
    fu: 420,  // MPa
    elongation: 20,
    usage: 'Standard reinforcement'
  },
  Grade420: {
    id: 'Grade420',
    name: 'Grade 420',
    fy: 420,
    fu: 620,
    elongation: 15,
    usage: 'High-strength reinforcement'
  },
  Grade520: {
    id: 'Grade520',
    name: 'Grade 520',
    fy: 520,
    fu: 750,
    elongation: 12,
    usage: 'Very high-strength reinforcement'
  }
};

// Dynamic Increase Factors (DIF) tables
export const difTables = {
  steel: {
    1: { strainRate: 1, dif: 1.0 },
    10: { strainRate: 10, dif: 1.10 },
    50: { strainRate: 50, dif: 1.15 },
    100: { strainRate: 100, dif: 1.20 },
    500: { strainRate: 500, dif: 1.25 },
    1000: { strainRate: 1000, dif: 1.29 }
  },
  concrete: {
    1: { strainRate: 1, dif: 1.0 },
    10: { strainRate: 10, dif: 1.05 },
    50: { strainRate: 50, dif: 1.10 },
    100: { strainRate: 100, dif: 1.19 },
    500: { strainRate: 500, dif: 1.25 }
  },
  rebar: {
    1: { strainRate: 1, dif: 1.0 },
    10: { strainRate: 10, dif: 1.10 },
    50: { strainRate: 50, dif: 1.15 },
    100: { strainRate: 100, dif: 1.17 },
    500: { strainRate: 500, dif: 1.29 }
  }
};