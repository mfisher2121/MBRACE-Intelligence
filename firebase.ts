// Firebase Configuration and Data Services
// Handles lead capture, analytics, and PE intelligence data

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { CalculatorResult } from './calculator';

// ============================================
// FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXX',
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Analytics (only in browser environment)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// ============================================
// TYPES
// ============================================

export interface LeadData {
  // Contact Info
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  smsOptIn: boolean;
  
  // Calculator Inputs
  zipCode: string;
  homeType: string;
  homeSqFt?: number;
  currentHeating: string;
  systemAge: string;
  incomeBracket: string;
  
  // Calculated Results
  calculatedResults: CalculatorResult;
  
  // Attribution
  source: 'ios-app' | 'android-app' | 'pwa' | 'web' | 'qr-code' | 'contractor-embed';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  contractorId?: string;
  
  // User Type
  userType?: 'homeowner' | 'nonprofit' | 'low-income-housing' | 'contractor' | 'pe-manager';
}

export interface CalculatorSession {
  sessionId: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  currentStep: string;
  inputs: Partial<LeadData>;
  abandoned: boolean;
}

export interface PlaybookAccess {
  userId?: string;
  playbookType: 'nonprofit' | 'low-income' | 'contractor' | 'pe-intelligence';
  accessedAt: Timestamp;
  downloadedPdf: boolean;
  contactSubmitted: boolean;
}

// ============================================
// LEAD CAPTURE
// ============================================

/**
 * Save a new lead to Firestore
 */
export async function saveLead(leadData: LeadData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'new',
      
      // PE Intelligence fields (extracted for easy querying)
      _state: leadData.calculatedResults.locationData.state,
      _utility: leadData.calculatedResults.locationData.utility,
      _riskScore: leadData.calculatedResults.peIntelligence.assetRiskScore,
      _incentiveCoverage: leadData.calculatedResults.peIntelligence.incentiveCoveragePercent,
      _incrementalBenefit: leadData.calculatedResults.peIntelligence.incrementalNetBenefit,
      _totalIncentives: leadData.calculatedResults.totalIncentives,
      _netCost: leadData.calculatedResults.netCost,
    });
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'lead_captured', {
        state: leadData.calculatedResults.locationData.state,
        home_type: leadData.homeType,
        current_heating: leadData.currentHeating,
        income_bracket: leadData.incomeBracket,
        total_incentives: leadData.calculatedResults.totalIncentives,
        source: leadData.source,
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
}

/**
 * Update an existing lead
 */
export async function updateLead(leadId: string, updates: Partial<LeadData>): Promise<void> {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

// ============================================
// SESSION TRACKING
// ============================================

/**
 * Start a calculator session (for funnel analytics)
 */
export async function startCalculatorSession(sessionId: string): Promise<void> {
  try {
    await addDoc(collection(db, 'calculator_sessions'), {
      sessionId,
      startedAt: serverTimestamp(),
      currentStep: 'location',
      inputs: {},
      abandoned: false,
    });
    
    if (analytics) {
      logEvent(analytics, 'calculator_started', { session_id: sessionId });
    }
  } catch (error) {
    console.error('Error starting session:', error);
  }
}

/**
 * Update calculator session progress
 */
export async function updateSessionProgress(
  sessionId: string, 
  step: string, 
  inputs: Partial<LeadData>
): Promise<void> {
  try {
    // In production, you'd query for the session doc first
    // For MVP, we'll just add a new progress event
    await addDoc(collection(db, 'session_progress'), {
      sessionId,
      step,
      inputs,
      timestamp: serverTimestamp(),
    });
    
    if (analytics) {
      logEvent(analytics, 'calculator_step_completed', { 
        session_id: sessionId,
        step,
      });
    }
  } catch (error) {
    console.error('Error updating session:', error);
  }
}

// ============================================
// PLAYBOOK TRACKING
// ============================================

/**
 * Track playbook access
 */
export async function trackPlaybookAccess(access: Omit<PlaybookAccess, 'accessedAt'>): Promise<void> {
  try {
    await addDoc(collection(db, 'playbook_access'), {
      ...access,
      accessedAt: serverTimestamp(),
    });
    
    if (analytics) {
      logEvent(analytics, 'playbook_accessed', {
        playbook_type: access.playbookType,
      });
    }
  } catch (error) {
    console.error('Error tracking playbook access:', error);
  }
}

// ============================================
// CONSULTATION BOOKING
// ============================================

export interface ConsultationRequest {
  leadId?: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  source: string;
}

/**
 * Submit consultation request
 */
export async function submitConsultationRequest(request: ConsultationRequest): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'consultation_requests'), {
      ...request,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    
    if (analytics) {
      logEvent(analytics, 'consultation_requested', {
        source: request.source,
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting consultation:', error);
    throw error;
  }
}

// ============================================
// ANALYTICS EVENTS
// ============================================

export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

export function trackScreenView(screenName: string): void {
  if (analytics) {
    logEvent(analytics, 'screen_view', {
      screen_name: screenName,
    });
  }
}

// ============================================
// PE INTELLIGENCE AGGREGATION
// ============================================

// Note: These would typically be Cloud Functions or BigQuery queries
// For the app, we expose the data structure for when you build the dashboard

export interface PEIntelligenceSnapshot {
  timestamp: Date;
  region: 'MD' | 'DC' | 'VA' | 'DMV';
  
  // Market Demand Signals
  totalLeads: number;
  leadsByZipCode: Record<string, number>;
  leadsByHeatingType: Record<string, number>;
  leadsByIncomeLevel: Record<string, number>;
  
  // Risk Aggregation
  avgRiskScore: number;
  highRiskAssets: number; // score >= 7
  criticalAssets: number; // score >= 9
  
  // Incentive Analysis
  avgIncentiveCoverage: number;
  totalIncentiveValue: number;
  avgNetCost: number;
  
  // Conversion Metrics
  leadsToConsultation: number;
  conversionRate: number;
}

// This function would be called by a Cloud Function or backend job
export function buildPESnapshot(leads: LeadData[]): PEIntelligenceSnapshot {
  const now = new Date();
  
  const zipCounts: Record<string, number> = {};
  const heatingCounts: Record<string, number> = {};
  const incomeCounts: Record<string, number> = {};
  
  let totalRiskScore = 0;
  let highRiskCount = 0;
  let criticalCount = 0;
  let totalIncentiveCoverage = 0;
  let totalIncentiveValue = 0;
  let totalNetCost = 0;
  
  leads.forEach(lead => {
    // Count by zip
    const zip = lead.zipCode.substring(0, 3);
    zipCounts[zip] = (zipCounts[zip] || 0) + 1;
    
    // Count by heating
    heatingCounts[lead.currentHeating] = (heatingCounts[lead.currentHeating] || 0) + 1;
    
    // Count by income
    incomeCounts[lead.incomeBracket] = (incomeCounts[lead.incomeBracket] || 0) + 1;
    
    // Risk metrics
    const riskScore = lead.calculatedResults.peIntelligence.assetRiskScore;
    totalRiskScore += riskScore;
    if (riskScore >= 7) highRiskCount++;
    if (riskScore >= 9) criticalCount++;
    
    // Incentive metrics
    totalIncentiveCoverage += lead.calculatedResults.peIntelligence.incentiveCoveragePercent;
    totalIncentiveValue += lead.calculatedResults.totalIncentives;
    totalNetCost += lead.calculatedResults.netCost;
  });
  
  const count = leads.length || 1;
  
  return {
    timestamp: now,
    region: 'DMV',
    totalLeads: leads.length,
    leadsByZipCode: zipCounts,
    leadsByHeatingType: heatingCounts,
    leadsByIncomeLevel: incomeCounts,
    avgRiskScore: totalRiskScore / count,
    highRiskAssets: highRiskCount,
    criticalAssets: criticalCount,
    avgIncentiveCoverage: totalIncentiveCoverage / count,
    totalIncentiveValue,
    avgNetCost: totalNetCost / count,
    leadsToConsultation: 0, // Would come from consultation_requests collection
    conversionRate: 0, // Would be calculated from actual conversions
  };
}

export { db, analytics };
