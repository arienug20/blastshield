/**
 * Damage Thresholds for Buildings, Personnel, and Equipment
 * Based on API RP 752, ASCE, UFC 3-340-02, and Bowen et al.
 */

// Building damage thresholds
export const buildingDamageThresholds = [
  {
    overpressure: 0.01,
    level: 'Negligible',
    description: 'Loud noise, no damage',
    color: '#22c55e'
  },
  {
    overpressure: 0.02,
    level: 'Minor',
    description: 'Windows crack, paint damage',
    color: '#84cc16'
  },
  {
    overpressure: 0.03,
    level: 'Light',
    description: 'Windows shattered, doors blown in',
    color: '#eab308'
  },
  {
    overpressure: 0.07,
    level: 'Moderate',
    description: 'Walls cracked, roof panels displaced',
    color: '#f97316'
  },
  {
    overpressure: 0.15,
    level: 'Heavy',
    description: 'Major structural damage, partial collapse',
    color: '#ef4444'
  },
  {
    overpressure: 0.30,
    level: 'Very Heavy',
    description: 'Reinforced concrete severely damaged',
    color: '#dc2626'
  },
  {
    overpressure: 0.50,
    level: 'Extreme',
    description: 'Near total destruction',
    color: '#b91c1c'
  },
  {
    overpressure: 1.0,
    level: 'Catastrophic',
    description: 'Complete demolition, cratering',
    color: '#7f1d1d'
  }
];

// Personnel injury thresholds
export const personnelInjuryThresholds = [
  {
    overpressure: 0.01,
    effect: 'Safe',
    probability: '0%',
    description: 'No effect',
    color: '#22c55e'
  },
  {
    overpressure: 0.03,
    effect: 'Startle',
    probability: '0%',
    description: 'Loud noise, temporary hearing effect',
    color: '#84cc16'
  },
  {
    overpressure: 0.07,
    effect: 'Eardrum rupture (1%)',
    probability: '1%',
    description: 'Threshold for eardrum rupture',
    color: '#eab308'
  },
  {
    overpressure: 0.21,
    effect: 'Eardrum rupture (50%)',
    probability: '50%',
    description: '50% probability of eardrum rupture',
    color: '#f97316'
  },
  {
    overpressure: 0.35,
    effect: 'Lung damage',
    probability: '10%',
    description: 'Threshold for lung damage',
    color: '#ef4444'
  },
  {
    overpressure: 0.55,
    effect: 'Serious injury',
    probability: '25%',
    description: '25% probability of serious injury',
    color: '#dc2626'
  },
  {
    overpressure: 1.0,
    effect: 'High lethality',
    probability: '50%',
    description: '50% lethality from body translation/impact',
    color: '#b91c1c'
  },
  {
    overpressure: 2.0,
    effect: 'Near 100% lethality',
    probability: '90%+',
    description: 'Near 100% lethality',
    color: '#7f1d1d'
  }
];

// Equipment vulnerability
export const equipmentVulnerability = [
  {
    type: 'Electrical panels',
    threshold: 0.07,
    damageMode: 'Door blow-in, internal damage',
    category: 'electronics'
  },
  {
    type: 'Piping (small bore)',
    threshold: 0.35,
    damageMode: 'Rupture, joint failure',
    category: 'piping'
  },
  {
    type: 'Storage tanks (atmospheric)',
    threshold: 0.07,
    damageMode: 'Roof buckling, shell deformation',
    category: 'tanks'
  },
  {
    type: 'Pressure vessels',
    threshold: 0.30,
    damageMode: 'Shift, connection failure',
    category: 'vessels'
  },
  {
    type: 'Control room equipment',
    threshold: 0.07,
    damageMode: 'Instrument damage, shutdown',
    category: 'electronics'
  },
  {
    type: 'Pumps and compressors',
    threshold: 0.15,
    damageMode: 'Mechanical damage, misalignment',
    category: 'mechanical'
  },
  {
    type: 'Vessels (pressure-relieved)',
    threshold: 0.50,
    damageMode: 'Structure damage, possible rupture',
    category: 'vessels'
  },
  {
    type: 'Structural steel',
    threshold: 0.30,
    damageMode: 'Yielding, permanent deformation',
    category: 'structural'
  }
];