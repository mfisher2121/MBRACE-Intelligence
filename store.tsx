// State Management for Calculator Flow
// Uses React Context for simplicity - can migrate to Zustand if needed

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculatorInput, CalculatorResult } from './calculator';

// ============================================
// TYPES
// ============================================

interface ContactInfo {
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  smsOptIn: boolean;
}

interface CalculatorState {
  // Progress
  currentStep: number;
  totalSteps: number;
  sessionId: string;
  
  // Calculator Inputs
  zipCode: string;
  homeType: string;
  homeSqFt?: number;
  currentHeating: string;
  systemAge: string;
  incomeBracket: string;
  
  // Contact Info
  contact: ContactInfo;
  
  // Results
  results: CalculatorResult | null;
  
  // User Type (for playbooks)
  userType: 'homeowner' | 'nonprofit' | 'low-income-housing' | 'contractor' | 'pe-manager';
  
  // Lead ID (after submission)
  leadId: string | null;
  
  // Attribution
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  contractorId?: string;
}

type CalculatorAction =
  | { type: 'SET_ZIP_CODE'; payload: string }
  | { type: 'SET_HOME_TYPE'; payload: string }
  | { type: 'SET_HOME_SQFT'; payload: number }
  | { type: 'SET_CURRENT_HEATING'; payload: string }
  | { type: 'SET_SYSTEM_AGE'; payload: string }
  | { type: 'SET_INCOME_BRACKET'; payload: string }
  | { type: 'SET_CONTACT'; payload: Partial<ContactInfo> }
  | { type: 'SET_RESULTS'; payload: CalculatorResult }
  | { type: 'SET_LEAD_ID'; payload: string }
  | { type: 'SET_USER_TYPE'; payload: CalculatorState['userType'] }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_ATTRIBUTION'; payload: { source?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; contractorId?: string } }
  | { type: 'RESET' };

// ============================================
// INITIAL STATE
// ============================================

const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const initialState: CalculatorState = {
  currentStep: 1,
  totalSteps: 6,
  sessionId: generateSessionId(),
  
  zipCode: '',
  homeType: '',
  homeSqFt: undefined,
  currentHeating: '',
  systemAge: '',
  incomeBracket: '',
  
  contact: {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    smsOptIn: false,
  },
  
  results: null,
  userType: 'homeowner',
  leadId: null,
  source: 'ios-app',
};

// ============================================
// REDUCER
// ============================================

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_ZIP_CODE':
      return { ...state, zipCode: action.payload };
    
    case 'SET_HOME_TYPE':
      return { ...state, homeType: action.payload };
    
    case 'SET_HOME_SQFT':
      return { ...state, homeSqFt: action.payload };
    
    case 'SET_CURRENT_HEATING':
      return { ...state, currentHeating: action.payload };
    
    case 'SET_SYSTEM_AGE':
      return { ...state, systemAge: action.payload };
    
    case 'SET_INCOME_BRACKET':
      return { ...state, incomeBracket: action.payload };
    
    case 'SET_CONTACT':
      return { 
        ...state, 
        contact: { ...state.contact, ...action.payload } 
      };
    
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    
    case 'SET_LEAD_ID':
      return { ...state, leadId: action.payload };
    
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
    
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_ATTRIBUTION':
      return { 
        ...state, 
        source: action.payload.source || state.source,
        utmSource: action.payload.utmSource,
        utmMedium: action.payload.utmMedium,
        utmCampaign: action.payload.utmCampaign,
        contractorId: action.payload.contractorId,
      };
    
    case 'RESET':
      return { 
        ...initialState, 
        sessionId: generateSessionId(),
        source: state.source,
        utmSource: state.utmSource,
        utmMedium: state.utmMedium,
        utmCampaign: state.utmCampaign,
        contractorId: state.contractorId,
      };
    
    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
  
  // Convenience methods
  setZipCode: (zipCode: string) => void;
  setHomeType: (homeType: string) => void;
  setHomeSqFt: (sqFt: number) => void;
  setCurrentHeating: (heating: string) => void;
  setSystemAge: (age: string) => void;
  setIncomeBracket: (bracket: string) => void;
  setContact: (contact: Partial<ContactInfo>) => void;
  setResults: (results: CalculatorResult) => void;
  setLeadId: (id: string) => void;
  setUserType: (type: CalculatorState['userType']) => void;
  setStep: (step: number) => void;
  reset: () => void;
  
  // Getters
  getCalculatorInput: () => CalculatorInput;
  isStepComplete: (step: number) => boolean;
  getProgress: () => number;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  
  const setZipCode = (zipCode: string) => dispatch({ type: 'SET_ZIP_CODE', payload: zipCode });
  const setHomeType = (homeType: string) => dispatch({ type: 'SET_HOME_TYPE', payload: homeType });
  const setHomeSqFt = (sqFt: number) => dispatch({ type: 'SET_HOME_SQFT', payload: sqFt });
  const setCurrentHeating = (heating: string) => dispatch({ type: 'SET_CURRENT_HEATING', payload: heating });
  const setSystemAge = (age: string) => dispatch({ type: 'SET_SYSTEM_AGE', payload: age });
  const setIncomeBracket = (bracket: string) => dispatch({ type: 'SET_INCOME_BRACKET', payload: bracket });
  const setContact = (contact: Partial<ContactInfo>) => dispatch({ type: 'SET_CONTACT', payload: contact });
  const setResults = (results: CalculatorResult) => dispatch({ type: 'SET_RESULTS', payload: results });
  const setLeadId = (id: string) => dispatch({ type: 'SET_LEAD_ID', payload: id });
  const setUserType = (type: CalculatorState['userType']) => dispatch({ type: 'SET_USER_TYPE', payload: type });
  const setStep = (step: number) => dispatch({ type: 'SET_STEP', payload: step });
  const reset = () => dispatch({ type: 'RESET' });
  
  const getCalculatorInput = (): CalculatorInput => ({
    zipCode: state.zipCode,
    homeType: state.homeType,
    homeSqFt: state.homeSqFt,
    currentHeating: state.currentHeating,
    systemAge: state.systemAge,
    incomeBracket: state.incomeBracket,
  });
  
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return state.zipCode.length === 5;
      case 2: return !!state.homeType;
      case 3: return !!state.currentHeating && !!state.systemAge;
      case 4: return !!state.incomeBracket;
      case 5: return !!state.contact.email || !!state.contact.phone;
      case 6: return !!state.results;
      default: return false;
    }
  };
  
  const getProgress = (): number => {
    let completed = 0;
    for (let i = 1; i <= state.totalSteps; i++) {
      if (isStepComplete(i)) completed++;
    }
    return (completed / state.totalSteps) * 100;
  };
  
  const value: CalculatorContextType = {
    state,
    dispatch,
    setZipCode,
    setHomeType,
    setHomeSqFt,
    setCurrentHeating,
    setSystemAge,
    setIncomeBracket,
    setContact,
    setResults,
    setLeadId,
    setUserType,
    setStep,
    reset,
    getCalculatorInput,
    isStepComplete,
    getProgress,
  };
  
  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCalculator(): CalculatorContextType {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
