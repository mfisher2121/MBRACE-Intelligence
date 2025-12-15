# MBRACE INTELLIGENCE ENGINE
## Complete System Architecture & Deployment Guide

---

## Executive Overview

MBRACE is a **regulatory intelligence platform** built around Maryland's building electrification mandate. It captures proprietary building data through a public-facing calculator, converts submissions via speed-to-lead automation, and monetizes the resulting dataset through PE-facing intelligence products.

**The flywheel:**
1. **Traffic** → Calculator (organic, paid, partner referrals)
2. **Conversion** → Speed-to-lead (SMS + VAPI in 30 seconds)
3. **Intelligence** → Every submission builds proprietary dataset
4. **Multipliers** → Housing authorities and contractors become distribution
5. **Monetization** → Maryland Electrification Index as PE product

---

## System Components

### 1. Frontend — Calculator
**Location:** `/calculator/`

| File | Purpose |
|------|---------|
| `index.html` | Multi-step wizard with client-side validation |
| `index-netlify-forms.html` | Single-page Netlify Forms version (zero backend) |
| `success.html` | Post-submission thank you page |
| `netlify.toml` | Deployment configuration |
| `README.md` | Calculator-specific documentation |

**Data captured:**
- Address, city, state, ZIP
- Building type (SFH, 2-4 unit, 5+ MF, nonprofit)
- Utility territory (BGE, Pepco, Potomac Edison, SMECO)
- Heating system type and age
- Income classification
- Contact (email, phone)

---

### 2. Backend — n8n Workflow
**Location:** `mbrace_n8n_workflow.json`

**20-node automation flow:**
```
Calculator Submit → Webhook → Set Variables → Segment by Type
                                    ↓
            ┌───────────────────────┼───────────────────────┐
            ↓                       ↓                       ↓
     SMS (Nonprofit)        SMS (Multifamily)        SMS (Homeowner)
            └───────────────────────┼───────────────────────┘
                                    ↓
                            Wait 15 seconds
                                    ↓
                        VAPI Call (Verification)
                                    ↓
                          Store in Database
                                    ↓
                        Calculate Incentives
                                    ↓
                         Generate PDF Report
                                    ↓
                           Wait 2 hours
                                    ↓
                      Email Report Delivery
                                    ↓
                    [7-Day Nurture Sequence]
```

**Timing:**
- T+0: Form submit → Webhook fires
- T+5-10s: SMS #1 sent
- T+15-30s: VAPI verification call
- T+2hr: Email with PDF report
- Day 3: Compliance nudge (if no click)
- Day 5: Checklist offer (if clicked but no action)
- Day 7: Final touch

---

### 3. Voice AI — VAPI Agent
**Location:** `mbrace_vapi_agent_config.json`

**Purpose:** Instant verification call after form submission

**Script flow:**
1. Opening (confirm this isn't a sales call)
2. Verify building type
3. Verify utility territory
4. Confirm heating system
5. Close and set delivery expectation

**Key features:**
- Objection handling built into system prompt
- Voicemail fallback script
- Variable injection for personalization
- Call recording and transcription

---

### 4. PDF Generator
**Location:** `generate_incentive_report.py`

**Python script that creates personalized reports with:**
- Incentive calculation based on inputs
- Program eligibility breakdown
- Financial impact analysis (savings, payback)
- Compliance status and timeline
- Segment-specific next steps

**Usage:**
```bash
python generate_incentive_report.py \
  --data '{"address": "123 Main St", "building_type": "nonprofit", ...}' \
  --output report.pdf
```

**Sample outputs included:**
- `sample_nonprofit_report.pdf`
- `sample_multifamily_report.pdf`
- `sample_homeowner_report.pdf`

---

### 5. Visual Assets
**Location:** Root directory

| File | Purpose |
|------|---------|
| `mbrace_system_diagram.html` | Standalone HTML diagram for screenshots |
| `mbrace_system_diagram.jsx` | React component for embedding |

**Shows:**
- 4-layer architecture (Lists → Capture → Dataset → Multipliers)
- Data flow from source to monetization
- The asymmetry thesis

---

### 6. Intelligence Product
**Location:** `maryland_electrification_index_product_spec.md`

**The product PE buys after you have 500+ submissions.**

**Tiers:**
- Standard Index ($15K): Portfolio score, heat maps, quarterly briefings
- Portfolio Deep Dive ($35K): Asset-level risk stratification, phased roadmap
- Enterprise ($75K+): API access, deal memos, dedicated analyst

**Deliverables:**
- MERI score (Maryland Electrification Readiness Index)
- Asset-level risk stratification
- Utility territory heat maps
- Mandate timeline dashboard
- Execution playbooks (the checklists)

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA SOURCES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  HUD LIHTC    │  IRS 990s    │  State Housing  │  CoStar    │  Paid/Organic │
│  Database     │  (Nonprofits) │  Finance Agencies│  (PE assets)│  Traffic     │
└───────┬───────┴───────┬───────┴────────┬────────┴──────┬─────┴───────┬───────┘
        │               │                │               │             │
        └───────────────┴────────────────┴───────────────┴─────────────┘
                                         │
                                         ▼
                    ┌────────────────────────────────────────┐
                    │           CALCULATOR FORM               │
                    │  Address | Building | Utility | System  │
                    │  Income | Contact                       │
                    └────────────────────┬───────────────────┘
                                         │
                                         ▼
                    ┌────────────────────────────────────────┐
                    │           n8n WORKFLOW                  │
                    │  SMS → VAPI → Database → PDF → Email   │
                    └────────────────────┬───────────────────┘
                                         │
                    ┌────────────────────┴───────────────────┐
                    │                                         │
                    ▼                                         ▼
        ┌───────────────────────┐             ┌───────────────────────────┐
        │  LEAD NURTURE          │             │  INTELLIGENCE DATABASE     │
        │  • Report delivery     │             │  • Property-level data     │
        │  • Compliance nudges   │             │  • Incentive eligibility   │
        │  • Checklist offers    │             │  • System age/risk curves  │
        └───────────┬───────────┘             └─────────────┬─────────────┘
                    │                                       │
                    ▼                                       ▼
        ┌───────────────────────┐             ┌───────────────────────────┐
        │  CONVERSION            │             │  MARYLAND ELECTRIFICATION │
        │  • Consultation        │             │  INDEX™                    │
        │  • Contractor referral │             │  • Portfolio assessments  │
        │  • Project execution   │             │  • Deal memos             │
        └───────────────────────┘             │  • Regulatory monitoring  │
                                              └───────────────────────────┘
```

---

## Environment Variables Required

```bash
# Twilio (SMS)
TWILIO_PHONE=+1XXXXXXXXXX
TWILIO_SID=ACXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token

# VAPI (Voice AI)
VAPI_API_KEY=your_vapi_key
VAPI_ASSISTANT_ID=your_assistant_id
VAPI_PHONE_ID=your_phone_number_id

# Database
DATABASE_WEBHOOK=https://your-webhook.com/store

# PDF Generation
PDF_GENERATION_ENDPOINT=https://your-pdf-service.com/generate
```

---

## Deployment Sequence

### Phase 1: Calculator Live
1. Deploy calculator to Netlify
2. Configure webhook to point to n8n
3. Test end-to-end flow with your own phone/email

### Phase 2: Automation Active
1. Import n8n workflow
2. Configure Twilio credentials
3. Set up VAPI agent
4. Test speed-to-lead sequence

### Phase 3: PDF Reports
1. Deploy PDF generator as API endpoint
2. Connect to n8n workflow
3. Test report generation and delivery

### Phase 4: Scale
1. Begin housing authority outreach
2. Launch contractor partnership program
3. Accumulate submissions toward 500 threshold

### Phase 5: Monetize
1. Build aggregate dataset dashboards
2. Create first Index report
3. Begin PE outreach with sample portfolio analysis

---

## File Inventory

```
/mnt/user-data/outputs/
├── DEPLOYMENT_GUIDE.md                    # Component deployment instructions
├── calculator/                            # Frontend calculator
│   ├── index.html                        # Multi-step wizard
│   ├── index-netlify-forms.html          # Netlify Forms version
│   ├── success.html                      # Thank you page
│   ├── netlify.toml                      # Netlify config
│   └── README.md                         # Calculator docs
├── generate_incentive_report.py          # PDF report generator
├── maryland_electrification_index_product_spec.md  # PE product spec
├── mbrace_n8n_workflow.json              # n8n automation workflow
├── mbrace_system_diagram.html            # Visual architecture diagram
├── mbrace_system_diagram.jsx             # React component version
├── mbrace_vapi_agent_config.json         # Voice AI configuration
├── sample_homeowner_report.pdf           # Example PDF output
├── sample_multifamily_report.pdf         # Example PDF output
└── sample_nonprofit_report.pdf           # Example PDF output
```

---

## Key Metrics to Track

### Lead Generation
- Calculator submissions per week
- Submission → SMS reply rate
- SMS reply → VAPI connection rate
- Report open rate

### Data Quality
- % with verified utility territory
- % with system age data
- % with income classification
- Geographic distribution

### Multiplier Effectiveness
- Housing authorities engaged
- Properties per HA relationship
- Contractor partners active
- Referral volume per contractor

### Intelligence Value
- Total properties in database
- Utility territory coverage
- Income-qualified asset count
- System age risk distribution

---

## The 500 Submission Milestone

At ~500 submissions, you have:
- Statistically meaningful utility territory distribution
- Enough data points for aggregate risk curves
- Credible "Index" to present to PE
- Case studies to reference

**What changes:**
- Outreach flips from you chasing to them qualifying
- Can publish "Maryland Electrification Readiness Index"
- Housing authorities see you as established, not experimental
- Contractors see real deal flow, not promises

---

## Support & Next Steps

This system is designed to be deployed incrementally. Start with the calculator, add automation, then scale.

**Priority order:**
1. Calculator live and capturing leads
2. SMS + VAPI for speed-to-lead
3. PDF reports for credibility
4. Housing authority partnerships for scale
5. Index product for monetization

---

*Built for MBRACE Intelligence Engine*
*Maryland Building Electrification Data & Compliance*
