# MBRACE Database Schema
## Submission Storage for Airtable & Firebase

---

## Overview

This document provides ready-to-implement database schemas for storing calculator submissions. Choose based on your needs:

- **Airtable:** Best for visual data management, easy integrations, quick setup
- **Firebase Firestore:** Best for scale, real-time updates, custom app integration

---

## OPTION 1: Airtable Schema

### Base Structure

```
MBRACE Intelligence (Base)
├── Submissions (Table)
├── Properties (Table)
├── Organizations (Table)
├── Engagement (Table)
├── Incentive Calculations (Table)
└── Contractor Referrals (Table)
```

---

### Table 1: Submissions

**Primary table for all calculator submissions**

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `submission_id` | Auto Number | Primary key |
| `created_at` | Created Time | Auto-generated |
| `segment` | Single Select | `homeowner`, `nonprofit`, `lihtc`, `multifamily` |
| `status` | Single Select | `new`, `contacted`, `qualified`, `converted`, `archived` |
| `source` | Single Select | `organic`, `paid_search`, `email`, `referral`, `housing_authority` |
| `utm_source` | Single Line Text | UTM tracking |
| `utm_medium` | Single Line Text | UTM tracking |
| `utm_campaign` | Single Line Text | UTM tracking |
| `property` | Link to Properties | Links to Properties table |
| `organization` | Link to Organizations | For nonprofits/companies |
| `contact_email` | Email | Primary contact |
| `contact_phone` | Phone Number | Primary contact |
| `contact_name` | Single Line Text | Optional |
| `incentive_low` | Currency | Calculated low estimate |
| `incentive_high` | Currency | Calculated high estimate |
| `sms_sent` | Checkbox | Automation tracking |
| `vapi_called` | Checkbox | Automation tracking |
| `vapi_connected` | Checkbox | Did they answer? |
| `report_sent` | Checkbox | PDF delivered |
| `report_opened` | Checkbox | Email opened |
| `notes` | Long Text | Internal notes |

**Views:**
- All Submissions (Grid)
- New Leads (Filtered: status = new)
- By Segment (Grouped by segment)
- Today's Submissions (Filtered by created_at)
- Hot Leads (Filtered: report_opened = true, status ≠ converted)

---

### Table 2: Properties

**Property-level data for intelligence database**

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `property_id` | Auto Number | Primary key |
| `address` | Single Line Text | Street address |
| `city` | Single Line Text | City |
| `state` | Single Select | `MD`, `DC`, `VA` |
| `zip` | Single Line Text | 5-digit ZIP |
| `full_address` | Formula | Concatenated address |
| `building_type` | Single Select | `single_family`, `2-4_unit`, `5+_multifamily`, `nonprofit` |
| `unit_count` | Number | For multifamily |
| `utility` | Single Select | `BGE`, `Pepco`, `Potomac Edison`, `SMECO`, `Dominion`, `Other` |
| `heating_system` | Single Select | `gas`, `oil`, `propane`, `electric_resistance`, `existing_heat_pump` |
| `system_age` | Single Select | `<10`, `10-15`, `15-20`, `20+`, `not_sure` |
| `income_level` | Single Select | `under_80_ami`, `80_150_ami`, `over_150_ami`, `prefer_not_to_say` |
| `submissions` | Link to Submissions | Linked submissions |
| `risk_score` | Number | 0-100 calculated risk |
| `compliance_status` | Single Select | `high_risk`, `moderate`, `low_risk`, `compliant` |
| `latitude` | Number | For mapping |
| `longitude` | Number | For mapping |

**Views:**
- All Properties (Grid)
- By Utility Territory (Grouped)
- High Risk (Filtered: system_age = 15-20 OR 20+)
- Map View (Map block using lat/long)

---

### Table 3: Organizations

**For nonprofit and company submissions**

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `org_id` | Auto Number | Primary key |
| `org_name` | Single Line Text | Organization name |
| `org_type` | Single Select | `nonprofit`, `property_management`, `pe_fund`, `housing_authority`, `other` |
| `ein` | Single Line Text | Tax ID (nonprofits) |
| `primary_contact` | Single Line Text | Contact name |
| `contact_email` | Email | |
| `contact_phone` | Phone Number | |
| `properties` | Link to Properties | Linked properties |
| `submissions` | Link to Submissions | Linked submissions |
| `property_count` | Rollup | Count of linked properties |
| `total_units` | Rollup | Sum of unit_count from properties |
| `account_tier` | Single Select | `free`, `standard`, `portfolio`, `enterprise` |
| `notes` | Long Text | |

---

### Table 4: Engagement

**Track all touchpoints**

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `engagement_id` | Auto Number | Primary key |
| `submission` | Link to Submissions | Parent submission |
| `timestamp` | Date/Time | When it happened |
| `channel` | Single Select | `sms`, `email`, `vapi`, `manual` |
| `type` | Single Select | `sent`, `delivered`, `opened`, `clicked`, `replied`, `called`, `connected` |
| `content` | Single Line Text | Message type or subject |
| `notes` | Long Text | Details |

---

### Table 5: Incentive Calculations

**Detailed incentive breakdown per submission**

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `calc_id` | Auto Number | Primary key |
| `submission` | Link to Submissions | Parent submission |
| `calculated_at` | Created Time | |
| `utility_rebate_low` | Currency | |
| `utility_rebate_high` | Currency | |
| `federal_rebate_low` | Currency | |
| `federal_rebate_high` | Currency | |
| `state_grant_low` | Currency | |
| `state_grant_high` | Currency | |
| `total_low` | Formula | Sum of lows |
| `total_high` | Formula | Sum of highs |
| `annual_savings_estimate` | Currency | |
| `payback_years` | Number | |
| `programs_eligible` | Multiple Select | List of program names |

---

### Table 6: Contractor Referrals

**Track referrals to contractor partners**

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `referral_id` | Auto Number | Primary key |
| `submission` | Link to Submissions | |
| `contractor_name` | Single Line Text | |
| `contractor_email` | Email | |
| `referred_at` | Date/Time | |
| `status` | Single Select | `sent`, `contacted`, `quoted`, `closed`, `lost` |
| `quote_amount` | Currency | |
| `closed_amount` | Currency | |
| `notes` | Long Text | |

---

### Airtable Automations

**Automation 1: New Submission Notification**
- Trigger: When record created in Submissions
- Action: Send Slack/email notification

**Automation 2: Status Update**
- Trigger: When engagement record created with type = "connected"
- Action: Update submission status to "contacted"

**Automation 3: Weekly Report**
- Trigger: Every Monday at 9am
- Action: Send email with submission count, conversion rate

---

### Airtable API Integration

**Webhook endpoint for n8n:**
```
POST https://api.airtable.com/v0/{baseId}/Submissions
Authorization: Bearer {apiKey}
Content-Type: application/json

{
  "fields": {
    "segment": "homeowner",
    "contact_email": "user@example.com",
    "contact_phone": "+14105551234",
    "source": "paid_search",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "md-heat-pump-rebates",
    "incentive_low": 8000,
    "incentive_high": 14000
  }
}
```

**Create linked property:**
```
POST https://api.airtable.com/v0/{baseId}/Properties
{
  "fields": {
    "address": "123 Main St",
    "city": "Baltimore",
    "state": "MD",
    "zip": "21201",
    "building_type": "single_family",
    "utility": "BGE",
    "heating_system": "gas",
    "system_age": "15-20"
  }
}
```

---

## OPTION 2: Firebase Firestore Schema

### Collection Structure

```
firestore/
├── submissions/
│   └── {submissionId}/
│       ├── (submission fields)
│       └── engagements/ (subcollection)
│           └── {engagementId}/
├── properties/
│   └── {propertyId}/
├── organizations/
│   └── {orgId}/
├── calculations/
│   └── {calcId}/
└── referrals/
    └── {referralId}/
```

---

### Collection: submissions

```javascript
// Document: submissions/{submissionId}
{
  // Metadata
  submissionId: "sub_abc123",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Segmentation
  segment: "homeowner" | "nonprofit" | "lihtc" | "multifamily",
  status: "new" | "contacted" | "qualified" | "converted" | "archived",
  
  // Source tracking
  source: "organic" | "paid_search" | "email" | "referral" | "housing_authority",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "md-heat-pump-rebates",
  referralCode: "ha_baltimore_001",
  
  // Contact info
  contact: {
    email: "user@example.com",
    phone: "+14105551234",
    name: "John Smith"
  },
  
  // Property reference
  propertyId: "prop_xyz789",
  
  // Organization reference (if applicable)
  organizationId: "org_def456",
  
  // Calculated incentives
  incentives: {
    low: 8000,
    high: 14000,
    calculatedAt: Timestamp
  },
  
  // Automation tracking
  automation: {
    smsSent: true,
    smsSentAt: Timestamp,
    vapiCalled: true,
    vapiCalledAt: Timestamp,
    vapiConnected: false,
    reportSent: true,
    reportSentAt: Timestamp,
    reportOpened: true,
    reportOpenedAt: Timestamp
  },
  
  // Internal
  notes: "Interested in Q1 installation",
  assignedTo: "max@mbrace.io"
}
```

---

### Collection: properties

```javascript
// Document: properties/{propertyId}
{
  propertyId: "prop_xyz789",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Address
  address: {
    street: "123 Main Street",
    city: "Baltimore",
    state: "MD",
    zip: "21201",
    full: "123 Main Street, Baltimore, MD 21201"
  },
  
  // Geolocation (for mapping)
  location: GeoPoint(39.2904, -76.6122),
  
  // Building characteristics
  buildingType: "single_family" | "2-4_unit" | "5+_multifamily" | "nonprofit",
  unitCount: 1,
  squareFootage: 2400,
  yearBuilt: 1985,
  
  // Utility and system
  utility: "BGE" | "Pepco" | "Potomac Edison" | "SMECO" | "Dominion" | "Other",
  heatingSystem: "gas" | "oil" | "propane" | "electric_resistance" | "existing_heat_pump",
  systemAge: "<10" | "10-15" | "15-20" | "20+" | "not_sure",
  coolingSystem: "central_ac" | "window_units" | "none" | "heat_pump",
  
  // Income classification
  incomeLevel: "under_80_ami" | "80_150_ami" | "over_150_ami" | "prefer_not_to_say",
  
  // Risk assessment
  riskScore: 75, // 0-100
  complianceStatus: "high_risk" | "moderate" | "low_risk" | "compliant",
  estimatedEolYear: 2027,
  
  // Linked submissions
  submissionIds: ["sub_abc123", "sub_def456"]
}
```

---

### Collection: organizations

```javascript
// Document: organizations/{orgId}
{
  orgId: "org_def456",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Organization info
  name: "Parkview Housing Partners LLC",
  type: "property_management" | "nonprofit" | "pe_fund" | "housing_authority" | "other",
  ein: "52-1234567", // For nonprofits
  
  // Contact
  primaryContact: {
    name: "Jane Doe",
    email: "jane@parkviewhousing.com",
    phone: "+14105559876",
    role: "Asset Manager"
  },
  
  // Portfolio summary
  portfolio: {
    propertyCount: 12,
    totalUnits: 847,
    states: ["MD", "DC"],
    utilities: ["BGE", "Pepco"]
  },
  
  // Account status
  accountTier: "free" | "standard" | "portfolio" | "enterprise",
  contractValue: 35000,
  contractStart: Timestamp,
  contractEnd: Timestamp,
  
  // Linked records
  propertyIds: ["prop_xyz789", "prop_abc123"],
  submissionIds: ["sub_abc123"]
}
```

---

### Subcollection: engagements

```javascript
// Document: submissions/{submissionId}/engagements/{engagementId}
{
  engagementId: "eng_123abc",
  timestamp: Timestamp,
  
  channel: "sms" | "email" | "vapi" | "manual",
  type: "sent" | "delivered" | "opened" | "clicked" | "replied" | "called" | "connected",
  
  // Channel-specific data
  metadata: {
    // For SMS
    messageSid: "SM123...",
    messageBody: "Your incentive scan is ready...",
    
    // For Email
    messageId: "msg_abc123",
    subject: "Your Maryland Heat Pump Incentive Report",
    
    // For VAPI
    callId: "call_xyz789",
    duration: 45,
    transcript: "...",
    outcome: "verified" | "voicemail" | "no_answer" | "declined"
  },
  
  notes: "Left voicemail, will retry tomorrow"
}
```

---

### Collection: calculations

```javascript
// Document: calculations/{calcId}
{
  calcId: "calc_abc123",
  submissionId: "sub_abc123",
  propertyId: "prop_xyz789",
  calculatedAt: Timestamp,
  
  // Input snapshot
  inputs: {
    utility: "BGE",
    buildingType: "single_family",
    heatingSystem: "gas",
    systemAge: "15-20",
    incomeLevel: "under_80_ami"
  },
  
  // Calculated incentives
  utilityRebate: { low: 4000, high: 8000, programs: ["BGE EmPOWER HVAC"] },
  federalRebate: { low: 8000, high: 14000, programs: ["IRA HEEHR"] },
  stateGrant: { low: 1000, high: 3000, programs: ["MEA Residential Clean Energy"] },
  
  total: { low: 13000, high: 25000 },
  
  // Financial projections
  projections: {
    estimatedProjectCost: { low: 12000, high: 18000 },
    netOwnerCost: { low: 0, high: 5000 },
    annualSavings: { low: 800, high: 1400 },
    paybackYears: { low: 0, high: 6 },
    fifteenYearBenefit: { low: 12000, high: 21000 }
  },
  
  // Compliance context
  compliance: {
    riskLevel: "high",
    estimatedSystemEol: 2027,
    mandateTriggerYear: 2029,
    urgencyScore: 85
  }
}
```

---

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Submissions - write from webhook, read by authenticated admins
    match /submissions/{submissionId} {
      allow create: if request.auth == null; // Allow webhook writes
      allow read, update, delete: if request.auth != null && 
        request.auth.token.admin == true;
      
      // Engagements subcollection
      match /engagements/{engagementId} {
        allow read, write: if request.auth != null && 
          request.auth.token.admin == true;
      }
    }
    
    // Properties - admin only
    match /properties/{propertyId} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Organizations - admin only
    match /organizations/{orgId} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Calculations - admin only
    match /calculations/{calcId} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

---

### Firebase Indexes

Create these composite indexes for common queries:

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "segment", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "properties",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "utility", "order": "ASCENDING" },
        { "fieldPath": "riskScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "properties",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "address.state", "order": "ASCENDING" },
        { "fieldPath": "complianceStatus", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

### n8n Webhook → Firebase Integration

```javascript
// Firebase Cloud Function for webhook endpoint
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.calculatorWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const data = req.body;
    const db = admin.firestore();
    
    // Create property document
    const propertyRef = db.collection('properties').doc();
    await propertyRef.set({
      propertyId: propertyRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      address: {
        street: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        full: `${data.address}, ${data.city}, ${data.state} ${data.zip}`
      },
      buildingType: data.building_type,
      utility: data.utility,
      heatingSystem: data.heating_system,
      systemAge: data.system_age,
      incomeLevel: data.income_level
    });
    
    // Create submission document
    const submissionRef = db.collection('submissions').doc();
    await submissionRef.set({
      submissionId: submissionRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      segment: data.segment || 'homeowner',
      status: 'new',
      source: data.utm_source ? 'paid_search' : 'organic',
      utmSource: data.utm_source || null,
      utmMedium: data.utm_medium || null,
      utmCampaign: data.utm_campaign || null,
      contact: {
        email: data.email,
        phone: data.phone,
        name: data.name || null
      },
      propertyId: propertyRef.id,
      incentives: {
        low: data.calculated_incentives?.total?.low || 0,
        high: data.calculated_incentives?.total?.high || 0,
        calculatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      automation: {
        smsSent: false,
        vapiCalled: false,
        vapiConnected: false,
        reportSent: false,
        reportOpened: false
      }
    });
    
    res.status(200).json({ 
      success: true, 
      submissionId: submissionRef.id,
      propertyId: propertyRef.id 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});
```

---

## Quick Setup Guide

### Airtable Setup (5 minutes)
1. Create new base in Airtable
2. Import this schema or create tables manually
3. Get API key from Account settings
4. Use base ID and API key in n8n HTTP node

### Firebase Setup (15 minutes)
1. Create Firebase project
2. Enable Firestore (start in test mode)
3. Deploy Cloud Function for webhook
4. Update security rules
5. Create composite indexes
6. Use webhook URL in n8n

---

## Recommended: Start with Airtable

For early stage, Airtable is faster to set up and easier to manage:
- Visual interface for data review
- Built-in views and filters
- Easy integrations (Zapier, Make, n8n)
- No coding required for basic operations

Migrate to Firebase when you need:
- More than 50,000 records
- Real-time updates
- Custom dashboard/app
- Complex queries at scale
