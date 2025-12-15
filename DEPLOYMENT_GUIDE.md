# MBRACE Speed-to-Lead System — Deployment Guide

## Overview

This package contains three production-ready components for the MBRACE lead capture and nurture system:

1. **VAPI Agent Configuration** — Voice AI agent for instant lead verification
2. **n8n Workflow** — Complete automation from calculator → SMS → VAPI → email nurture
3. **PDF Report Generator** — Personalized incentive scan reports

---

## Quick Start

### Prerequisites

- **n8n** (self-hosted or cloud) — Workflow automation
- **Twilio** — SMS sending
- **VAPI.ai** — Voice AI agent
- **Python 3.10+** — PDF generation
- **Netlify** (optional) — Calculator hosting

### Environment Variables Required

```bash
# Twilio
TWILIO_PHONE=+1XXXXXXXXXX
TWILIO_SID=ACXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token

# VAPI
VAPI_API_KEY=your_vapi_key
VAPI_ASSISTANT_ID=your_assistant_id
VAPI_PHONE_ID=your_phone_number_id

# Database/Storage
DATABASE_WEBHOOK=https://your-webhook-endpoint.com/store

# PDF Generation
PDF_GENERATION_ENDPOINT=https://your-pdf-service.com/generate
```

---

## Component 1: VAPI Agent

### File: `mbrace_vapi_agent_config.json`

This contains the complete voice AI configuration including:
- System prompt with verification flow
- Objection handling scripts
- Variable injection for personalization
- Voicemail fallback

### Deployment Steps

1. **Create VAPI Account** at https://vapi.ai
2. **Create New Assistant** → Choose "Custom"
3. **Copy system prompt** from config file
4. **Configure voice** (Rachel from 11labs recommended)
5. **Set up phone number** → Get Phone Number ID
6. **Copy Assistant ID** from dashboard
7. **Add to environment variables**

### Testing

```bash
curl -X POST https://api.vapi.ai/call/phone \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "YOUR_ASSISTANT_ID",
    "phoneNumberId": "YOUR_PHONE_ID",
    "customer": {"number": "+1XXXXXXXXXX"},
    "assistantOverrides": {
      "variableValues": {
        "address": "123 Test Street",
        "building_type": "single family",
        "utility_territory": "BGE",
        "delivery_method": "email"
      }
    }
  }'
```

---

## Component 2: n8n Workflow

### File: `mbrace_n8n_workflow.json`

This contains the complete 20-node workflow including:
- Webhook trigger for calculator submissions
- Segment-based SMS routing (nonprofit/MF/homeowner)
- VAPI call initiation
- Incentive calculation logic
- 7-day nurture sequence

### Deployment Steps

1. **Import Workflow**
   - Open n8n → Workflows → Import from File
   - Select `mbrace_n8n_workflow.json`

2. **Configure Credentials**
   - Add Twilio credentials
   - Add HTTP Header Auth for VAPI
   - Configure database webhook

3. **Activate Webhook**
   - Copy webhook URL from first node
   - Use as form action in calculator

4. **Test Flow**
   ```bash
   curl -X POST https://your-n8n.com/webhook/mbrace-calculator \
     -H "Content-Type: application/json" \
     -d '{
       "address": "123 Test St, Baltimore, MD",
       "building_type": "nonprofit",
       "utility": "BGE",
       "heating_system": "oil",
       "system_age": "20+",
       "income_level": "under_80_ami",
       "phone": "+1XXXXXXXXXX",
       "email": "test@example.com",
       "org_name": "Test Nonprofit"
     }'
   ```

### Workflow Timing

| Event | Timing |
|-------|--------|
| Form submit | T+0 |
| SMS #1 (confirmation) | T+5-10 sec |
| VAPI call | T+15-30 sec |
| Email + PDF report | T+2 hours |
| SMS #2 (nudge if no click) | Day 3 |
| SMS #3 (checklist offer) | Day 5 |
| SMS #4 (final touch) | Day 7 |

---

## Component 3: PDF Report Generator

### File: `generate_incentive_report.py`

This Python script generates personalized PDF reports with:
- Incentive calculation by segment
- Program eligibility breakdown
- Financial impact analysis
- Compliance status and timeline
- Segment-specific next steps

### Installation

```bash
pip install reportlab
```

### Usage — Command Line

```bash
python generate_incentive_report.py \
  --data '{"address": "123 Main St", "building_type": "nonprofit", ...}' \
  --output report.pdf
```

### Usage — Programmatic (for n8n HTTP node)

```python
from generate_incentive_report import generate_report

data = {
    "address": "123 Main St, Baltimore, MD",
    "building_type": "nonprofit",
    "utility": "BGE",
    "heating_system": "oil",
    "system_age": "20+",
    "income_level": "under_80_ami",
    "org_name": "Test Nonprofit"
}

pdf_path = generate_report(data)
print(f"Generated: {pdf_path}")
```

### Hosting as API Endpoint

For production, wrap in Flask/FastAPI:

```python
from flask import Flask, request, send_file
from generate_incentive_report import generate_report
import tempfile

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        pdf_path = generate_report(data, tmp.name)
        return send_file(pdf_path, mimetype='application/pdf')

if __name__ == '__main__':
    app.run(port=5000)
```

---

## Data Schema

### Calculator Submission Fields

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `address` | string | Yes | Full street address |
| `building_type` | string | Yes | `nonprofit`, `5+_multifamily`, `2-4_unit`, `single_family` |
| `utility` | string | Yes | `BGE`, `Pepco`, `Potomac Edison`, `SMECO`, `Other` |
| `heating_system` | string | Yes | `gas`, `oil`, `propane`, `electric_resistance`, `existing_heat_pump` |
| `system_age` | string | Yes | `<10`, `10-15`, `15-20`, `20+` |
| `income_level` | string | Yes | `under_80_ami`, `80_150_ami`, `over_150_ami` |
| `phone` | string | Yes | E.164 format |
| `email` | string | Yes | Valid email |
| `org_name` | string | Nonprofit only | Organization name |

### Intelligence Data Captured

Every submission creates a record with:

- **Geographic**: Address, utility territory, county
- **Asset**: Building type, system age, fuel type
- **Financial**: Income classification, incentive eligibility
- **Behavioral**: Submission time, engagement (clicks, replies)
- **Compliance**: ZEHES timeline risk, urgency level

This dataset becomes the "Maryland Electrification Readiness Index" after ~500+ submissions.

---

## Customization Points

### SMS Templates

Edit in n8n workflow nodes 4a, 4b, 4c, 16, 18, 20

### VAPI Script

Edit `systemPrompt` in VAPI config file or directly in VAPI dashboard

### PDF Report

- **Colors**: Edit `COLORS` dict in Python file
- **Incentive Logic**: Edit `calculate_incentives()` function
- **Content Sections**: Edit story building in `generate_report()` function

### Incentive Amounts

Update these sections in `generate_incentive_report.py`:
- `utility_programs` dict (line ~195)
- Federal rebate logic (lines ~210-240)
- State grant logic (lines ~245-280)

---

## Scaling Notes

### For High Volume (1000+ submissions/day)

1. **n8n**: Self-host with Redis queue
2. **PDF Generation**: Move to dedicated service (DocRaptor, PDFShift)
3. **Database**: Use Supabase/Firebase instead of webhook
4. **SMS**: Consider Twilio Messaging Service for throughput

### For Multi-Region Expansion

1. Clone incentive calculation logic per state
2. Add state/region field to calculator
3. Create state-specific VAPI scripts
4. Segment nurture sequences by region

---

## Files in This Package

```
/home/claude/
├── mbrace_vapi_agent_config.json    # VAPI voice agent configuration
├── mbrace_n8n_workflow.json         # n8n workflow (importable)
├── generate_incentive_report.py     # PDF report generator
├── sample_nonprofit_report.pdf      # Example output — nonprofit
├── sample_multifamily_report.pdf    # Example output — multifamily
├── sample_homeowner_report.pdf      # Example output — homeowner
└── DEPLOYMENT_GUIDE.md              # This file
```

---

## Support

This system was designed for MBRACE Intelligence Engine.

For questions about the architecture or customization, refer to the original strategy documents or reach out directly.

---

*Generated: December 2024*
