# MBRACE Go-to-Market Outreach Materials
## Complete Sales & Partnership Collateral

---

## Contents

### 1. Cold Email Sequences
**File:** `cold_email_sequences.md`

Ready-to-send email campaigns for:
- **LIHTC / Affordable Housing Owners** — 4-email sequence targeting property owners, asset managers
- **Nonprofit Facility Managers** — 4-email sequence targeting executive directors, operations staff
- **LinkedIn Messages** — Connection requests and follow-up templates

**Usage:**
- Import into Instantly, Smartlead, or Apollo
- Use separate domain for cold outreach (warmup required)
- Target open rates: 40-60%, reply rates: 5-15%

---

### 2. Housing Authority Pitch Deck
**File:** `housing_authority_pitch_deck.md`

Complete slide-by-slide content for a 10-slide presentation:
- Problem awareness (confused property owners)
- Timeline urgency (2025-2026 phase-in)
- Calculator demo and value prop
- What HAs get (fewer calls, better outcomes, zero cost)
- Next steps (share link, co-brand, webinar)

**Usage:**
- Build in PowerPoint, Google Slides, or Canva
- Print leave-behind one-pager for meetings
- Includes talking points and objection handling

---

### 3. Contractor Partnership One-Pager
**File:** `contractor_partnership_onepager.html`

Printable one-page document (HTML format) covering:
- What contractors get (pre-qualified leads, no ad spend)
- What we ask (EmPOWER certification, quality commitment)
- The opportunity ($80B market, 65% heat pump target)
- How the referral process works
- Partner requirements

**Usage:**
- Print directly from browser (letter-size optimized)
- Send as PDF attachment in outreach
- Use at trade shows or contractor meetings

---

### 4. PE Fund Manager Outreach
**File:** `pe_outreach_sequence.md`

Complete outreach system for institutional investors:
- 4-email sequence with subject line variants
- LinkedIn connection and follow-up scripts
- Response templates for positive/negative/questioning replies
- Pricing reference for conversations
- Objection handling scripts

**Usage:**
- Target Partners, Principals, Asset Managers at RE PE funds
- Source leads from CoStar, SEC filings, LinkedIn Sales Navigator
- Track in CRM by fund type and Maryland unit count

---

## Deployment Checklist

### Before You Start Outreach

- [ ] Calculator is live and working
- [ ] n8n workflow is connected and tested
- [ ] SMS/VAPI automation is firing correctly
- [ ] PDF reports are generating and delivering
- [ ] Tracking pixels are installed (optional but recommended)

### Cold Email Setup

- [ ] Separate domain purchased (e.g., mbrace-intel.com)
- [ ] SPF, DKIM, DMARC configured
- [ ] Domain warming for 2-3 weeks
- [ ] Email sequences imported to sending tool
- [ ] List building complete (LIHTC database, 990 filings)
- [ ] Merge fields tested ({{first_name}}, {{company_name}}, etc.)

### Housing Authority Outreach

- [ ] Pitch deck built and reviewed
- [ ] Custom calculator URL created for tracking
- [ ] One-pager printed or ready to send
- [ ] Target list of MD housing authorities compiled
- [ ] Meeting request emails drafted

### Contractor Partnerships

- [ ] One-pager finalized with contact info
- [ ] List of EmPOWER-certified contractors compiled
- [ ] Partnership terms defined (referral structure, exclusivity, etc.)
- [ ] Outreach sequence drafted

### PE Outreach

- [ ] Target fund list compiled (MD multifamily exposure)
- [ ] LinkedIn Sales Navigator access (recommended)
- [ ] Sample portfolio analysis ready to share
- [ ] Pricing confirmed for each product tier

---

## Tracking & Metrics

### Email Campaigns

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Open rate | 40-60% | Improve subject lines, check deliverability |
| Reply rate | 5-15% | Revise copy, try different angles |
| Positive reply | 2-8% | Narrow targeting, better qualification |
| Calculator submissions | 3-10 per 100 | Add direct links, simplify CTA |

### Housing Authority Meetings

| Metric | Target | Notes |
|--------|--------|-------|
| Meetings booked | 5-10/month | Persistence matters — follow up |
| Calculator shares | 2-3 per HA | Track via custom URLs |
| Properties reached | 100-500 per HA | Depends on HA network size |

### Contractor Partnerships

| Metric | Target | Notes |
|--------|--------|-------|
| Partners active | 5-10 per territory | Quality over quantity |
| Leads per partner/month | 3-5 | Start slow, scale with trust |
| Close rate | 30-50% | Pre-qualification should be high |

### PE Engagement

| Metric | Target | Notes |
|--------|--------|-------|
| Response rate | 10-20% | PE is highly targeted |
| Sample request rate | 3-5% | Lower barrier than call |
| Meeting rate | 5-10% | Multi-touch usually required |

---

## Timing Recommendations

### Month 1: Foundation
- Deploy calculator and automation
- Begin housing authority outreach (warm channel)
- Start contractor partnership conversations
- Warm cold email domain

### Month 2: Scale
- Launch cold email campaigns (LIHTC, nonprofit)
- First housing authority partnerships active
- 2-3 contractor partners onboarded
- Begin PE outreach (LinkedIn first, then email)

### Month 3+: Optimize
- Analyze email performance, iterate copy
- Expand housing authority network
- Scale contractor partnerships geographically
- Close first PE engagements

---

## Legal / Compliance Notes

### Cold Email (CAN-SPAM)
- Include physical mailing address in footer
- Honor opt-out requests within 10 business days
- Don't use deceptive subject lines
- Identify message as advertisement (if required)

### TCPA (SMS/Calls)
- Calculator form includes consent language
- Honor opt-out requests immediately
- Don't send before 8am or after 9pm local time

### Data Privacy
- Don't share individual property owner data with third parties
- Aggregate data only for Index products
- Clear privacy policy on calculator

---

## File Inventory

```
/outreach/
├── README.md                          # This file
├── cold_email_sequences.md            # LIHTC + Nonprofit email campaigns
├── housing_authority_pitch_deck.md    # 10-slide presentation content
├── contractor_partnership_onepager.html  # Printable one-pager
└── pe_outreach_sequence.md            # PE fund manager outreach
```
