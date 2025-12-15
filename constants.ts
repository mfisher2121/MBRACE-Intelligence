// DMV Electrification Intelligence Data
// Source: Maryland Energy Administration, DCSEU, Virginia HEEHRA, IRA

// ============================================
// REGIONAL INCENTIVE PROGRAMS
// ============================================

export const INCENTIVE_PROGRAMS = {
  maryland: {
    name: 'Maryland',
    abbreviation: 'MD',
    programs: [
      {
        id: 'mea-residential',
        name: 'Maryland Energy Administration (MEA)',
        description: 'State rebates for heat pump installation',
        amounts: {
          low: 8000,
          moderate: 4000,
          middle: 2000,
          standard: 2000,
        },
        website: 'https://energy.maryland.gov',
      },
      {
        id: 'empower-md',
        name: 'EmPOWER Maryland',
        description: 'Utility-sponsored efficiency incentives',
        amounts: {
          heatPump: 3000,
          hpwh: 1500,
          insulation: 2000,
        },
        website: 'https://empowermaryland.energy.gov',
      },
    ],
    mandate: {
      name: 'ZEHES (Zero-Emission Heating Equipment Standard)',
      targetYear: 2029,
      description: 'End-of-life fossil heating replacements must be zero-emission',
      salesTarget: '95% heat pump sales by 2030',
    },
  },
  dc: {
    name: 'Washington DC',
    abbreviation: 'DC',
    programs: [
      {
        id: 'dcseu',
        name: 'DC Sustainable Energy Utility (DCSEU)',
        description: 'District rebates for electrification',
        amounts: {
          heatPumpMin: 250,
          heatPumpMax: 5000,
          panelUpgrade: 7200,
        },
        website: 'https://www.dcseu.com',
      },
    ],
    mandate: {
      name: 'Zero-Emission Buildings MOU',
      targetYear: 2030,
      description: '65% heat pump market share by 2030',
      salesTarget: '65% heat pump market share',
    },
  },
  virginia: {
    name: 'Virginia',
    abbreviation: 'VA',
    programs: [
      {
        id: 'heehra-va',
        name: 'HEEHRA Program',
        description: 'Home Electrification and Appliance Rebates',
        amounts: {
          lowIncomeCoverage: 100, // percentage
          moderateCap: 4000,
          moderateCoverage: 50, // percentage
        },
        website: 'https://www.energy.virginia.gov',
      },
    ],
    mandate: {
      name: 'Zero-Emission Buildings MOU',
      targetYear: 2030,
      description: 'Regional commitment to 65% heat pump adoption',
      salesTarget: '65% heat pump market share',
    },
  },
};

// ============================================
// FEDERAL INCENTIVES
// ============================================

export const FEDERAL_INCENTIVES = {
  ira25c: {
    name: 'IRA 25C Tax Credit',
    description: 'Inflation Reduction Act heat pump tax credit',
    maxCredit: 2000,
    requirements: 'Must meet ENERGY STAR Most Efficient criteria',
    expirationYear: 2032,
  },
  iraHomes: {
    name: 'HOMES Rebate Program',
    description: 'Whole-home efficiency rebates',
    maxAmount: 8000,
    requirements: 'Must achieve measured energy savings',
  },
  iraHeehr: {
    name: 'HEEHR Rebates',
    description: 'High-Efficiency Electric Home Rebate',
    maxPerProject: 14000,
    eligibility: 'Low and moderate income households',
  },
};

// ============================================
// UTILITY TERRITORIES
// ============================================

export const UTILITY_TERRITORIES = {
  // Maryland
  bge: {
    id: 'bge',
    name: 'Baltimore Gas & Electric',
    abbreviation: 'BGE',
    state: 'MD',
    zipPrefixes: ['210', '211', '212'],
    empowerParticipant: true,
  },
  pepcoMd: {
    id: 'pepco-md',
    name: 'Pepco (Maryland)',
    abbreviation: 'Pepco',
    state: 'MD',
    zipPrefixes: ['207', '208', '209'],
    empowerParticipant: true,
  },
  smeco: {
    id: 'smeco',
    name: 'SMECO',
    abbreviation: 'SMECO',
    state: 'MD',
    zipPrefixes: ['206', '254', '256'],
    empowerParticipant: true,
  },
  potomacEdison: {
    id: 'potomac-edison',
    name: 'Potomac Edison',
    abbreviation: 'PE',
    state: 'MD',
    zipPrefixes: ['217', '218', '219'],
    empowerParticipant: true,
  },
  // DC
  pepcoDc: {
    id: 'pepco-dc',
    name: 'Pepco (DC)',
    abbreviation: 'Pepco',
    state: 'DC',
    zipPrefixes: ['200', '202', '203', '204', '205'],
    dcseuParticipant: true,
  },
  // Virginia
  dominionVa: {
    id: 'dominion-va',
    name: 'Dominion Energy Virginia',
    abbreviation: 'Dominion',
    state: 'VA',
    zipPrefixes: ['220', '221', '222', '223', '224'],
    heehraParticipant: true,
  },
  novaElectric: {
    id: 'nova-electric',
    name: 'NOVEC',
    abbreviation: 'NOVEC',
    state: 'VA',
    zipPrefixes: ['201', '220'],
    heehraParticipant: true,
  },
};

// ============================================
// HOME TYPES
// ============================================

export const HOME_TYPES = [
  {
    id: 'single-family',
    label: 'Single Family Home',
    icon: 'home',
    baseInstallCost: 15000,
    avgSqFt: 2000,
  },
  {
    id: 'townhouse',
    label: 'Townhouse',
    icon: 'business',
    baseInstallCost: 12000,
    avgSqFt: 1600,
  },
  {
    id: 'condo',
    label: 'Condo/Apartment',
    icon: 'apartment',
    baseInstallCost: 10000,
    avgSqFt: 1200,
  },
  {
    id: 'multi-family',
    label: 'Multi-Family (2-4 units)',
    icon: 'domain',
    baseInstallCost: 18000,
    avgSqFt: 3000,
  },
];

// ============================================
// CURRENT HEATING SYSTEMS
// ============================================

export const HEATING_SYSTEMS = [
  {
    id: 'gas-furnace',
    label: 'Gas Furnace',
    icon: 'fire',
    strandedAssetRisk: 'HIGH',
    avgAnnualCost: 1800,
    mandateImpact: 'Must replace with heat pump by 2029',
  },
  {
    id: 'oil-boiler',
    label: 'Oil Boiler',
    icon: 'water',
    strandedAssetRisk: 'VERY HIGH',
    avgAnnualCost: 2400,
    mandateImpact: 'Priority replacement recommended',
  },
  {
    id: 'electric-resistance',
    label: 'Electric Baseboard/Resistance',
    icon: 'flash',
    strandedAssetRisk: 'LOW',
    avgAnnualCost: 2200,
    mandateImpact: 'High savings opportunity',
  },
  {
    id: 'propane',
    label: 'Propane Furnace',
    icon: 'flame',
    strandedAssetRisk: 'HIGH',
    avgAnnualCost: 2100,
    mandateImpact: 'Must replace with heat pump by 2029',
  },
  {
    id: 'heat-pump',
    label: 'Existing Heat Pump',
    icon: 'eco',
    strandedAssetRisk: 'NONE',
    avgAnnualCost: 1200,
    mandateImpact: 'Already compliant - upgrade opportunity',
  },
  {
    id: 'other',
    label: 'Other / Not Sure',
    icon: 'help-circle',
    strandedAssetRisk: 'UNKNOWN',
    avgAnnualCost: 1800,
    mandateImpact: 'Assessment recommended',
  },
];

// ============================================
// INCOME BRACKETS
// ============================================

export const INCOME_BRACKETS = [
  {
    id: 'low',
    label: 'Under $50,000',
    percentAMI: '<80%',
    meaRebate: 8000,
    heehraCoverage: 100,
    description: 'Maximum incentives available',
  },
  {
    id: 'moderate',
    label: '$50,000 - $100,000',
    percentAMI: '80-120%',
    meaRebate: 4000,
    heehraCoverage: 50,
    description: 'Significant incentives available',
  },
  {
    id: 'middle',
    label: '$100,000 - $150,000',
    percentAMI: '120-150%',
    meaRebate: 2000,
    heehraCoverage: 0,
    description: 'Standard rebates available',
  },
  {
    id: 'high',
    label: 'Over $150,000',
    percentAMI: '>150%',
    meaRebate: 2000,
    heehraCoverage: 0,
    description: 'Federal tax credits available',
  },
  {
    id: 'prefer-not-say',
    label: 'Prefer not to say',
    percentAMI: 'Unknown',
    meaRebate: 2000,
    heehraCoverage: 0,
    description: 'Conservative estimate shown',
  },
];

// ============================================
// SYSTEM AGES
// ============================================

export const SYSTEM_AGES = [
  { id: '0-5', label: '0-5 years', urgency: 'LOW', yearsRemaining: 15 },
  { id: '6-10', label: '6-10 years', urgency: 'MODERATE', yearsRemaining: 10 },
  { id: '11-15', label: '11-15 years', urgency: 'HIGH', yearsRemaining: 5 },
  { id: '16-20', label: '16-20 years', urgency: 'VERY HIGH', yearsRemaining: 2 },
  { id: '20+', label: 'Over 20 years', urgency: 'CRITICAL', yearsRemaining: 0 },
  { id: 'unknown', label: 'Not sure', urgency: 'UNKNOWN', yearsRemaining: 10 },
];

// ============================================
// USER TYPES (For Playbooks)
// ============================================

export const USER_TYPES = [
  {
    id: 'homeowner',
    label: 'Homeowner',
    description: 'Individual looking to upgrade their home',
    playbook: null,
  },
  {
    id: 'nonprofit',
    label: 'Nonprofit Organization',
    description: 'Community-serving 501(c)(3) organization',
    playbook: 'nonprofit',
  },
  {
    id: 'low-income-housing',
    label: 'Affordable Housing Owner/Operator',
    description: 'Owner of low-income residential properties',
    playbook: 'low-income',
  },
  {
    id: 'contractor',
    label: 'HVAC Contractor',
    description: 'Professional installer seeking resources',
    playbook: 'contractor',
  },
  {
    id: 'pe-manager',
    label: 'Portfolio/Asset Manager',
    description: 'PE fund or real estate portfolio manager',
    playbook: 'pe-intelligence',
  },
];

// ============================================
// HEAT PUMP BRANDS (Reliability Tiers)
// ============================================

export const HEAT_PUMP_BRANDS = {
  premiumColdClimate: [
    { name: 'Mitsubishi Hyper-Heat', rating: 'Excellent', minTemp: -13 },
    { name: 'Daikin Aurora', rating: 'Excellent', minTemp: -13 },
    { name: 'Carrier Infinity', rating: 'Very Good', minTemp: -15 },
    { name: 'Trane XV Series', rating: 'Very Good', minTemp: -10 },
    { name: 'Bosch IDS', rating: 'Very Good', minTemp: -13 },
    { name: 'Fujitsu', rating: 'Excellent', minTemp: -15 },
  ],
  midTierValue: [
    { name: 'Goodman', rating: 'Good', minTemp: 0 },
    { name: 'Rheem/Ruud', rating: 'Good', minTemp: 0 },
    { name: 'Bryant', rating: 'Good', minTemp: 5 },
    { name: 'Lennox', rating: 'Very Good', minTemp: -5 },
  ],
};

// ============================================
// PROJECTED UTILITY COST INCREASES
// ============================================

export const UTILITY_PROJECTIONS = {
  maryland: {
    monthlyIncreaseMin: 11,
    monthlyIncreaseMax: 18,
    startYear: 2025,
    source: 'Maryland PSC projections',
  },
  dc: {
    monthlyIncreaseMin: 12,
    monthlyIncreaseMax: 25,
    startYear: 2025,
    source: 'DCSEU analysis',
  },
  virginia: {
    monthlyIncreaseMin: 12,
    monthlyIncreaseMax: 25,
    startYear: 2025,
    source: 'VA SCC projections',
  },
};

// ============================================
// KEY DATES AND DEADLINES
// ============================================

export const KEY_DATES = {
  zehesPhaseIn: {
    date: '2025-2026',
    description: 'Maryland ZEHES rules begin phasing in',
  },
  zehesFull: {
    date: '2029',
    description: 'Full ZEHES mandate - all replacements must be zero-emission',
  },
  salesTarget: {
    date: '2030',
    description: '95% heat pump sales target in Maryland',
  },
  newConstruction: {
    date: '2035',
    description: 'All new construction must be all-electric',
  },
  fullElectrification: {
    date: '2040s',
    description: 'Nearly all buildings electrified',
  },
};

// ============================================
// PE INTELLIGENCE METRICS
// ============================================

export const PE_METRICS = {
  incrementalNetBenefit: {
    min: 3500,
    max: 7500,
    period: '15 years',
    description: 'Projected savings vs. emergency replacement',
  },
  strandedAssetRisk: {
    region: 'DMV',
    exposure: 'Tens of billions',
    description: 'Regional stranded asset risk for gas infrastructure',
  },
  paybackPeriod: {
    oilPropane: 4,
    gas: 6,
    electric: 8,
    description: 'Years to payback with full incentives',
  },
};

// ============================================
// APP THEME
// ============================================

export const THEME = {
  colors: {
    primary: '#1a365d',      // Deep Navy
    secondary: '#0d9488',    // Electric Teal
    accent: '#f97316',       // Alert Orange
    success: '#22c55e',      // Success Green
    warning: '#eab308',      // Warning Yellow
    error: '#ef4444',        // Error Red
    background: '#f8fafc',   // Warm White
    surface: '#ffffff',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      light: '#94a3b8',
      inverse: '#ffffff',
    },
    border: '#e2e8f0',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      lineHeight: 36,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      lineHeight: 16,
    },
  },
};
