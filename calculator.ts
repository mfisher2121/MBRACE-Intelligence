// Calculator Logic for DMV Heat Pump Intelligence
// Calculates rebates, savings, and PE intelligence metrics

import {
  INCENTIVE_PROGRAMS,
  FEDERAL_INCENTIVES,
  UTILITY_TERRITORIES,
  HOME_TYPES,
  HEATING_SYSTEMS,
  INCOME_BRACKETS,
  SYSTEM_AGES,
  PE_METRICS,
  UTILITY_PROJECTIONS,
} from './constants';

// ============================================
// TYPES
// ============================================

export interface CalculatorInput {
  zipCode: string;
  homeType: string;
  homeSqFt?: number;
  currentHeating: string;
  systemAge: string;
  incomeBracket: string;
}

export interface CalculatorResult {
  // Financial Summary
  totalIncentives: number;
  estimatedCost: number;
  netCost: number;
  annualSavings: number;
  tenYearSavings: number;
  paybackYears: number;

  // Incentive Breakdown
  incentiveBreakdown: {
    state: number;
    utility: number;
    federal: number;
    total: number;
    coverage: number; // percentage
  };

  // Location Intelligence
  locationData: {
    state: string;
    stateName: string;
    utility: string;
    utilityName: string;
    mandateDeadline: string;
    mandateDescription: string;
  };

  // Risk Assessment
  riskAssessment: {
    strandedAssetRisk: string;
    urgencyLevel: string;
    yearsUntilMandate: number;
    recommendation: string;
  };

  // PE Intelligence (Internal Metrics)
  peIntelligence: {
    incrementalNetBenefit: number;
    incentiveCoveragePercent: number;
    assetRiskScore: number; // 1-10
    mandateTimingRisk: string;
    projectedUtilityIncrease: number;
  };

  // Utility Projections
  utilityProjections: {
    currentAnnualCost: number;
    projectedIncrease: number;
    heatPumpAnnualCost: number;
    savingsVsProjected: number;
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determine state from zip code
 */
export function getStateFromZip(zipCode: string): 'MD' | 'DC' | 'VA' | null {
  const prefix = zipCode.substring(0, 3);
  const prefixNum = parseInt(prefix, 10);

  // DC: 200-205
  if (prefixNum >= 200 && prefixNum <= 205) return 'DC';
  
  // Maryland: 206-219
  if (prefixNum >= 206 && prefixNum <= 219) return 'MD';
  
  // Virginia (Northern VA): 220-246
  if (prefixNum >= 220 && prefixNum <= 246) return 'VA';

  return null;
}

/**
 * Get utility territory from zip code
 */
export function getUtilityFromZip(zipCode: string): typeof UTILITY_TERRITORIES[keyof typeof UTILITY_TERRITORIES] | null {
  const prefix = zipCode.substring(0, 3);
  
  for (const [key, utility] of Object.entries(UTILITY_TERRITORIES)) {
    if (utility.zipPrefixes.some(p => prefix.startsWith(p.substring(0, 2)) || prefix === p)) {
      return utility;
    }
  }
  
  // Default based on state
  const state = getStateFromZip(zipCode);
  if (state === 'MD') return UTILITY_TERRITORIES.bge;
  if (state === 'DC') return UTILITY_TERRITORIES.pepcoDc;
  if (state === 'VA') return UTILITY_TERRITORIES.dominionVa;
  
  return null;
}

/**
 * Calculate state-level rebates
 */
function calculateStateRebate(state: string, incomeBracket: string): number {
  const income = INCOME_BRACKETS.find(b => b.id === incomeBracket);
  
  if (state === 'MD') {
    return income?.meaRebate || 2000;
  }
  
  if (state === 'DC') {
    // DC uses DCSEU - average between min/max
    return 3000; // Conservative middle estimate
  }
  
  if (state === 'VA') {
    // Virginia HEEHRA
    const coverage = income?.heehraCoverage || 0;
    if (coverage === 100) return 8000; // Full coverage estimate
    if (coverage === 50) return 4000; // 50% coverage
    return 0;
  }
  
  return 0;
}

/**
 * Calculate utility rebates
 */
function calculateUtilityRebate(utility: typeof UTILITY_TERRITORIES[keyof typeof UTILITY_TERRITORIES] | null): number {
  if (!utility) return 0;
  
  if (utility.empowerParticipant) {
    return 3000; // EmPOWER average
  }
  
  if (utility.dcseuParticipant) {
    return 2500; // DCSEU average
  }
  
  if (utility.heehraParticipant) {
    return 1500; // Virginia utility average
  }
  
  return 1000; // Default utility rebate
}

/**
 * Calculate federal tax credit
 */
function calculateFederalCredit(homeType: string): number {
  // IRA 25C credit is $2,000 max for heat pumps
  return FEDERAL_INCENTIVES.ira25c.maxCredit;
}

/**
 * Calculate installation cost estimate
 */
function calculateInstallationCost(homeType: string, homeSqFt?: number): number {
  const home = HOME_TYPES.find(h => h.id === homeType);
  const baseCost = home?.baseInstallCost || 15000;
  
  // Adjust for square footage if provided
  if (homeSqFt && home) {
    const sqFtDiff = homeSqFt - home.avgSqFt;
    const adjustment = (sqFtDiff / 500) * 1000; // $1000 per 500 sqft
    return Math.max(8000, baseCost + adjustment);
  }
  
  return baseCost;
}

/**
 * Calculate annual energy savings
 */
function calculateAnnualSavings(currentHeating: string): number {
  const system = HEATING_SYSTEMS.find(s => s.id === currentHeating);
  const currentCost = system?.avgAnnualCost || 1800;
  
  // Heat pump average annual cost
  const heatPumpCost = 1200;
  
  // Base savings
  const baseSavings = currentCost - heatPumpCost;
  
  // Adjust based on system type
  if (currentHeating === 'oil-boiler' || currentHeating === 'propane') {
    return baseSavings * 1.3; // Higher savings from expensive fuels
  }
  
  if (currentHeating === 'electric-resistance') {
    return baseSavings * 1.5; // Highest savings from inefficient electric
  }
  
  if (currentHeating === 'heat-pump') {
    return 200; // Minimal savings from upgrade
  }
  
  return Math.max(400, baseSavings);
}

/**
 * Calculate stranded asset risk score (1-10)
 */
function calculateRiskScore(currentHeating: string, systemAge: string): number {
  const system = HEATING_SYSTEMS.find(s => s.id === currentHeating);
  const age = SYSTEM_AGES.find(a => a.id === systemAge);
  
  let score = 5; // Base score
  
  // Adjust for system type
  if (system?.strandedAssetRisk === 'VERY HIGH') score += 3;
  else if (system?.strandedAssetRisk === 'HIGH') score += 2;
  else if (system?.strandedAssetRisk === 'LOW') score -= 2;
  else if (system?.strandedAssetRisk === 'NONE') score -= 4;
  
  // Adjust for age
  if (age?.urgency === 'CRITICAL') score += 2;
  else if (age?.urgency === 'VERY HIGH') score += 1.5;
  else if (age?.urgency === 'HIGH') score += 1;
  else if (age?.urgency === 'LOW') score -= 1;
  
  return Math.min(10, Math.max(1, score));
}

/**
 * Generate recommendation based on inputs
 */
function generateRecommendation(
  currentHeating: string, 
  systemAge: string, 
  state: string
): string {
  const system = HEATING_SYSTEMS.find(s => s.id === currentHeating);
  const age = SYSTEM_AGES.find(a => a.id === systemAge);
  
  if (currentHeating === 'heat-pump') {
    return 'Your current heat pump may qualify for upgrade incentives. Consider cold-climate models for improved performance.';
  }
  
  if (age?.urgency === 'CRITICAL' || age?.urgency === 'VERY HIGH') {
    return 'URGENT: Your system is near end-of-life. Act now to maximize incentives before the Maryland 2029 mandate increases demand and costs.';
  }
  
  if (system?.strandedAssetRisk === 'VERY HIGH' || system?.strandedAssetRisk === 'HIGH') {
    return 'Your fossil fuel system faces stranded asset risk under the 2029 ZEHES mandate. Early conversion maximizes incentive capture and avoids emergency replacement costs.';
  }
  
  if (state === 'MD') {
    return 'Maryland offers the highest incentives in the DMV. With the 2029 ZEHES mandate approaching, early adopters benefit from maximum rebates and contractor availability.';
  }
  
  return 'Now is an optimal time to convert. Current incentives cover a significant portion of installation costs, and acting early ensures contractor availability.';
}

// ============================================
// MAIN CALCULATOR FUNCTION
// ============================================

export function calculateRebates(input: CalculatorInput): CalculatorResult {
  const { zipCode, homeType, homeSqFt, currentHeating, systemAge, incomeBracket } = input;
  
  // Get location data
  const state = getStateFromZip(zipCode) || 'MD';
  const utility = getUtilityFromZip(zipCode);
  const stateData = state === 'MD' 
    ? INCENTIVE_PROGRAMS.maryland 
    : state === 'DC' 
      ? INCENTIVE_PROGRAMS.dc 
      : INCENTIVE_PROGRAMS.virginia;
  
  // Calculate incentives
  const stateRebate = calculateStateRebate(state, incomeBracket);
  const utilityRebate = calculateUtilityRebate(utility);
  const federalCredit = calculateFederalCredit(homeType);
  const totalIncentives = stateRebate + utilityRebate + federalCredit;
  
  // Calculate costs
  const estimatedCost = calculateInstallationCost(homeType, homeSqFt);
  const netCost = Math.max(0, estimatedCost - totalIncentives);
  
  // Calculate savings
  const annualSavings = calculateAnnualSavings(currentHeating);
  const tenYearSavings = annualSavings * 10;
  const paybackYears = netCost > 0 ? Math.ceil(netCost / annualSavings) : 0;
  
  // Calculate risk assessment
  const system = HEATING_SYSTEMS.find(s => s.id === currentHeating);
  const age = SYSTEM_AGES.find(a => a.id === systemAge);
  const riskScore = calculateRiskScore(currentHeating, systemAge);
  
  // Calculate utility projections
  const utilityProj = state === 'MD' 
    ? UTILITY_PROJECTIONS.maryland 
    : state === 'DC' 
      ? UTILITY_PROJECTIONS.dc 
      : UTILITY_PROJECTIONS.virginia;
  const currentAnnualCost = system?.avgAnnualCost || 1800;
  const projectedIncrease = (utilityProj.monthlyIncreaseMax * 12) * 5; // 5-year projection
  
  // PE Intelligence calculations
  const incentiveCoveragePercent = Math.round((totalIncentives / estimatedCost) * 100);
  const incrementalNetBenefit = (annualSavings * 15) - netCost; // 15-year view
  
  return {
    // Financial Summary
    totalIncentives,
    estimatedCost,
    netCost,
    annualSavings,
    tenYearSavings,
    paybackYears,
    
    // Incentive Breakdown
    incentiveBreakdown: {
      state: stateRebate,
      utility: utilityRebate,
      federal: federalCredit,
      total: totalIncentives,
      coverage: incentiveCoveragePercent,
    },
    
    // Location Intelligence
    locationData: {
      state,
      stateName: stateData.name,
      utility: utility?.id || 'unknown',
      utilityName: utility?.name || 'Unknown Utility',
      mandateDeadline: stateData.mandate.targetYear.toString(),
      mandateDescription: stateData.mandate.description,
    },
    
    // Risk Assessment
    riskAssessment: {
      strandedAssetRisk: system?.strandedAssetRisk || 'UNKNOWN',
      urgencyLevel: age?.urgency || 'UNKNOWN',
      yearsUntilMandate: 2029 - new Date().getFullYear(),
      recommendation: generateRecommendation(currentHeating, systemAge, state),
    },
    
    // PE Intelligence
    peIntelligence: {
      incrementalNetBenefit: Math.max(0, incrementalNetBenefit),
      incentiveCoveragePercent,
      assetRiskScore: riskScore,
      mandateTimingRisk: age?.yearsRemaining && age.yearsRemaining <= 4 ? 'HIGH' : 'MODERATE',
      projectedUtilityIncrease: projectedIncrease,
    },
    
    // Utility Projections
    utilityProjections: {
      currentAnnualCost,
      projectedIncrease,
      heatPumpAnnualCost: 1200,
      savingsVsProjected: currentAnnualCost + projectedIncrease - (1200 * 5),
    },
  };
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export function validateZipCode(zipCode: string): { valid: boolean; error?: string } {
  if (!zipCode || zipCode.length !== 5) {
    return { valid: false, error: 'Please enter a valid 5-digit zip code' };
  }
  
  const state = getStateFromZip(zipCode);
  if (!state) {
    return { 
      valid: false, 
      error: 'This calculator currently serves Maryland, DC, and Northern Virginia only' 
    };
  }
  
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
