"""
MBRACE Intelligence - Maryland Incentive Scan Report Generator
==============================================================

This script generates personalized PDF reports for calculator submissions.
Run with: python generate_incentive_report.py --data '{"address": "123 Main St", ...}'

Or import and use programmatically:
    from generate_incentive_report import generate_report
    pdf_path = generate_report(submission_data)
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, Image, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import json
import argparse
import os


# ============================================================================
# COLOR SCHEME (MBRACE Brand)
# ============================================================================
COLORS = {
    'primary': colors.HexColor('#1a365d'),      # Dark blue
    'secondary': colors.HexColor('#2c5282'),    # Medium blue
    'accent': colors.HexColor('#ed8936'),       # Orange
    'success': colors.HexColor('#38a169'),      # Green
    'warning': colors.HexColor('#d69e2e'),      # Yellow
    'text': colors.HexColor('#2d3748'),         # Dark gray
    'light_gray': colors.HexColor('#e2e8f0'),   # Light gray
    'white': colors.white
}


# ============================================================================
# CUSTOM STYLES
# ============================================================================
def get_custom_styles():
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        name='ReportTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=COLORS['primary'],
        spaceAfter=20,
        alignment=TA_CENTER
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=COLORS['primary'],
        spaceBefore=20,
        spaceAfter=10,
        borderPadding=5,
        backColor=COLORS['light_gray']
    ))
    
    styles.add(ParagraphStyle(
        name='SubHeader',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=COLORS['secondary'],
        spaceBefore=15,
        spaceAfter=8
    ))
    
    styles.add(ParagraphStyle(
        name='MBRACEBody',
        parent=styles['Normal'],
        fontSize=10,
        textColor=COLORS['text'],
        spaceBefore=6,
        spaceAfter=6,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='Highlight',
        parent=styles['Normal'],
        fontSize=11,
        textColor=COLORS['primary'],
        backColor=COLORS['light_gray'],
        borderPadding=10,
        spaceBefore=10,
        spaceAfter=10
    ))
    
    styles.add(ParagraphStyle(
        name='BigNumber',
        parent=styles['Normal'],
        fontSize=28,
        textColor=COLORS['success'],
        alignment=TA_CENTER,
        spaceBefore=10,
        spaceAfter=10
    ))
    
    styles.add(ParagraphStyle(
        name='Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.gray,
        alignment=TA_CENTER
    ))
    
    return styles


# ============================================================================
# INCENTIVE CALCULATION LOGIC
# ============================================================================
def calculate_incentives(data):
    """
    Calculate incentive eligibility based on submission data.
    Returns dict with program details and estimated amounts.
    """
    building_type = data.get('building_type', 'single_family')
    income_level = data.get('income_level', 'over_150_ami')
    utility = data.get('utility', 'BGE')
    heating_system = data.get('heating_system', 'gas')
    system_age = data.get('system_age', '10-15')
    
    incentives = {
        'programs': [],
        'utility_rebate': {'name': '', 'low': 0, 'high': 0},
        'federal_rebate': {'name': '', 'low': 0, 'high': 0},
        'state_grant': {'name': '', 'low': 0, 'high': 0},
        'total_low': 0,
        'total_high': 0,
        'coverage_percent': '',
        'annual_savings': {'low': 0, 'high': 0},
        'payback_years': 0,
        'compliance_status': '',
        'urgency_level': ''
    }
    
    # -------------------------------------------------------------------------
    # UTILITY REBATES (EmPOWER Maryland)
    # -------------------------------------------------------------------------
    utility_programs = {
        'BGE': {'name': 'BGE EmPOWER', 'low': 3000, 'high': 8000},
        'Pepco': {'name': 'Pepco EmPOWER', 'low': 2500, 'high': 7000},
        'Potomac Edison': {'name': 'Potomac Edison EmPOWER', 'low': 2000, 'high': 6000},
        'SMECO': {'name': 'SMECO EmPOWER', 'low': 2500, 'high': 5000},
        'Other': {'name': 'Utility Rebates', 'low': 1500, 'high': 4000}
    }
    
    if utility in utility_programs:
        incentives['utility_rebate'] = utility_programs[utility]
        incentives['programs'].append({
            'name': f"{utility_programs[utility]['name']} Rebates",
            'type': 'Utility',
            'amount': f"${utility_programs[utility]['low']:,} - ${utility_programs[utility]['high']:,}",
            'eligibility': 'All Maryland ratepayers',
            'notes': 'Heat pump and envelope improvement rebates'
        })
    
    # -------------------------------------------------------------------------
    # FEDERAL REBATES (IRA)
    # -------------------------------------------------------------------------
    if income_level == 'under_80_ami':
        incentives['federal_rebate'] = {
            'name': 'IRA HEEHR',
            'low': 8000,
            'high': 14000
        }
        incentives['programs'].append({
            'name': 'IRA HEEHR (Home Efficiency Rebates)',
            'type': 'Federal',
            'amount': '$8,000 - $14,000',
            'eligibility': 'Households under 80% AMI',
            'notes': '100% of project costs covered for qualifying measures'
        })
    elif income_level == '80_150_ami':
        incentives['federal_rebate'] = {
            'name': 'IRA HOMES',
            'low': 2000,
            'high': 4000
        }
        incentives['programs'].append({
            'name': 'IRA HOMES Rebates',
            'type': 'Federal',
            'amount': '$2,000 - $4,000',
            'eligibility': 'Households 80-150% AMI',
            'notes': '50% of project costs covered, capped amounts'
        })
    else:
        incentives['federal_rebate'] = {
            'name': '25C Tax Credit',
            'low': 2000,
            'high': 2000
        }
        incentives['programs'].append({
            'name': 'Federal 25C Tax Credit',
            'type': 'Federal',
            'amount': 'Up to $2,000',
            'eligibility': 'All taxpayers',
            'notes': 'Annual tax credit for qualifying heat pumps'
        })
    
    # -------------------------------------------------------------------------
    # STATE GRANTS (MEA)
    # -------------------------------------------------------------------------
    if building_type == 'nonprofit':
        incentives['state_grant'] = {
            'name': 'MEA ECB/EEE Grants',
            'low': 5000,
            'high': 25000
        }
        incentives['programs'].append({
            'name': 'MEA Electrifying Community Buildings (ECB)',
            'type': 'State Grant',
            'amount': '$5,000 - $25,000+',
            'eligibility': '501(c)(3) community-serving facilities',
            'notes': 'Heat pumps, HPWH, panel upgrades, envelope'
        })
        incentives['programs'].append({
            'name': 'MEA Energy Efficiency Equity (EEE)',
            'type': 'State Grant',
            'amount': 'Additional coverage',
            'eligibility': 'Facilities serving LMI populations',
            'notes': 'Insulation, air sealing, efficiency measures'
        })
    elif building_type == '5+_multifamily':
        if income_level in ['under_80_ami', '80_150_ami']:
            incentives['state_grant'] = {
                'name': 'DHCD/MEEHA',
                'low': 3000,
                'high': 12000
            }
            incentives['programs'].append({
                'name': 'DHCD MEEHA / Multifamily Programs',
                'type': 'State',
                'amount': '$3,000 - $12,000 per unit',
                'eligibility': 'Affordable multifamily properties',
                'notes': 'Often covers 50-100% of project costs'
            })
    elif income_level == 'under_80_ami':
        incentives['state_grant'] = {
            'name': 'MEA Residential',
            'low': 2000,
            'high': 8000
        }
        incentives['programs'].append({
            'name': 'MEA Residential Heat Pump Rebates',
            'type': 'State',
            'amount': '$2,000 - $8,000',
            'eligibility': 'LMI Maryland households',
            'notes': 'Income-qualified rebates for heat pumps'
        })
    
    # -------------------------------------------------------------------------
    # CALCULATE TOTALS
    # -------------------------------------------------------------------------
    incentives['total_low'] = (
        incentives['utility_rebate'].get('low', 0) +
        incentives['federal_rebate'].get('low', 0) +
        incentives['state_grant'].get('low', 0)
    )
    
    incentives['total_high'] = (
        incentives['utility_rebate'].get('high', 0) +
        incentives['federal_rebate'].get('high', 0) +
        incentives['state_grant'].get('high', 0)
    )
    
    # -------------------------------------------------------------------------
    # ESTIMATE PROJECT COST & COVERAGE
    # -------------------------------------------------------------------------
    project_costs = {
        'single_family': 15000,
        '2-4_unit': 35000,
        '5+_multifamily': 20000,  # per unit
        'nonprofit': 50000
    }
    
    est_cost = project_costs.get(building_type, 15000)
    avg_incentive = (incentives['total_low'] + incentives['total_high']) / 2
    coverage = min(100, int((avg_incentive / est_cost) * 100))
    
    if coverage >= 80:
        incentives['coverage_percent'] = '80-100%'
    elif coverage >= 50:
        incentives['coverage_percent'] = '50-80%'
    elif coverage >= 30:
        incentives['coverage_percent'] = '30-50%'
    else:
        incentives['coverage_percent'] = '15-30%'
    
    # -------------------------------------------------------------------------
    # ANNUAL SAVINGS (based on current fuel)
    # -------------------------------------------------------------------------
    savings_by_fuel = {
        'gas': {'low': 400, 'high': 600},
        'oil': {'low': 800, 'high': 1400},
        'propane': {'low': 900, 'high': 1400},
        'electric_resistance': {'low': 700, 'high': 1200},
        'existing_heat_pump': {'low': 100, 'high': 300}
    }
    
    incentives['annual_savings'] = savings_by_fuel.get(
        heating_system, 
        {'low': 400, 'high': 800}
    )
    
    # -------------------------------------------------------------------------
    # COMPLIANCE STATUS
    # -------------------------------------------------------------------------
    system_age_risk = {
        '20+': 'HIGH',
        '15-20': 'MODERATE',
        '10-15': 'LOW',
        '<10': 'MINIMAL'
    }
    
    risk = system_age_risk.get(system_age, 'MODERATE')
    
    if risk == 'HIGH':
        incentives['compliance_status'] = 'Your system is likely to require replacement before or during the ZEHES mandate phase-in (2029+). Acting now maximizes incentive capture.'
        incentives['urgency_level'] = 'HIGH'
    elif risk == 'MODERATE':
        incentives['compliance_status'] = 'Your system may reach end-of-life during the mandate transition period. Planning now provides flexibility and incentive optimization.'
        incentives['urgency_level'] = 'MODERATE'
    else:
        incentives['compliance_status'] = 'Your system has remaining useful life. Current incentives represent an opportunity for proactive upgrade at reduced cost.'
        incentives['urgency_level'] = 'OPPORTUNITY'
    
    # -------------------------------------------------------------------------
    # PAYBACK CALCULATION
    # -------------------------------------------------------------------------
    net_cost = est_cost - avg_incentive
    avg_savings = (incentives['annual_savings']['low'] + incentives['annual_savings']['high']) / 2
    
    if avg_savings > 0 and net_cost > 0:
        incentives['payback_years'] = round(net_cost / avg_savings, 1)
    else:
        incentives['payback_years'] = 0
    
    return incentives


# ============================================================================
# PDF GENERATION
# ============================================================================
def generate_report(data, output_path=None):
    """
    Generate a personalized incentive scan PDF report.
    
    Args:
        data: dict with submission data (address, building_type, utility, etc.)
        output_path: optional output path (defaults to ./reports/scan_{timestamp}.pdf)
    
    Returns:
        str: path to generated PDF
    """
    styles = get_custom_styles()
    incentives = calculate_incentives(data)
    
    # Default output path
    if output_path is None:
        os.makedirs('reports', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f"reports/incentive_scan_{timestamp}.pdf"
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    story = []
    
    # =========================================================================
    # HEADER
    # =========================================================================
    story.append(Paragraph("MBRACE INTELLIGENCE", styles['ReportTitle']))
    story.append(Paragraph("Maryland Electrification Incentive Scan", styles['SubHeader']))
    story.append(Spacer(1, 10))
    
    # Property info bar
    property_info = f"""
    <b>Property:</b> {data.get('address', 'N/A')}<br/>
    <b>Building Type:</b> {data.get('building_type', 'N/A').replace('_', ' ').title()}<br/>
    <b>Utility Territory:</b> {data.get('utility', 'N/A')}<br/>
    <b>Report Generated:</b> {datetime.now().strftime('%B %d, %Y')}
    """
    story.append(Paragraph(property_info, styles['MBRACEBody']))
    story.append(HRFlowable(width="100%", thickness=2, color=COLORS['primary']))
    story.append(Spacer(1, 15))
    
    # =========================================================================
    # INCENTIVE SUMMARY (The Big Number)
    # =========================================================================
    story.append(Paragraph("ESTIMATED TOTAL INCENTIVES", styles['SectionHeader']))
    
    total_range = f"${incentives['total_low']:,} — ${incentives['total_high']:,}"
    story.append(Paragraph(total_range, styles['BigNumber']))
    
    coverage_text = f"Estimated Coverage: <b>{incentives['coverage_percent']}</b> of project costs"
    story.append(Paragraph(coverage_text, styles['Highlight']))
    story.append(Spacer(1, 10))
    
    # =========================================================================
    # PROGRAM BREAKDOWN TABLE
    # =========================================================================
    story.append(Paragraph("PROGRAM ELIGIBILITY BREAKDOWN", styles['SectionHeader']))
    
    # Build table data
    table_data = [['Program', 'Type', 'Est. Amount', 'Notes']]
    
    for prog in incentives['programs']:
        table_data.append([
            prog['name'],
            prog['type'],
            prog['amount'],
            prog['notes']
        ])
    
    # Create table
    program_table = Table(table_data, colWidths=[2.2*inch, 0.8*inch, 1.3*inch, 2.2*inch])
    program_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['primary']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), COLORS['light_gray']),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLORS['white'], COLORS['light_gray']]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    story.append(program_table)
    story.append(Spacer(1, 20))
    
    # =========================================================================
    # FINANCIAL IMPACT
    # =========================================================================
    story.append(Paragraph("FINANCIAL IMPACT ANALYSIS", styles['SectionHeader']))
    
    financial_data = [
        ['Metric', 'Value'],
        ['Est. Annual Energy Savings', f"${incentives['annual_savings']['low']:,} — ${incentives['annual_savings']['high']:,}"],
        ['Est. Payback Period (with incentives)', f"~{incentives['payback_years']} years"],
        ['15-Year Net Benefit vs. Waiting', f"${int(incentives['annual_savings']['low'] * 15 - (15000 - incentives['total_low'])):,}+"],
    ]
    
    financial_table = Table(financial_data, colWidths=[3.5*inch, 3*inch])
    financial_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['secondary']),
        ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLORS['white'], COLORS['light_gray']]),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(financial_table)
    story.append(Spacer(1, 20))
    
    # =========================================================================
    # COMPLIANCE STATUS
    # =========================================================================
    story.append(Paragraph("MANDATE COMPLIANCE STATUS", styles['SectionHeader']))
    
    urgency_colors = {
        'HIGH': COLORS['accent'],
        'MODERATE': COLORS['warning'],
        'OPPORTUNITY': COLORS['success']
    }
    
    urgency_style = ParagraphStyle(
        name='UrgencyBox',
        parent=styles['Highlight'],
        backColor=urgency_colors.get(incentives['urgency_level'], COLORS['light_gray']),
        textColor=COLORS['white'] if incentives['urgency_level'] == 'HIGH' else COLORS['text']
    )
    
    story.append(Paragraph(
        f"<b>Status: {incentives['urgency_level']}</b>",
        urgency_style
    ))
    
    story.append(Paragraph(incentives['compliance_status'], styles['MBRACEBody']))
    
    # Mandate context
    mandate_context = """
    <b>Key Dates:</b><br/>
    • <b>2025-2026:</b> Maryland Clean Heat Rules begin phasing in<br/>
    • <b>~2029:</b> ZEHES mandate requires end-of-life fossil systems be replaced with heat pumps<br/>
    • <b>2030:</b> State target: 95% of HVAC/water heater sales must be heat pumps<br/>
    • <b>2040s:</b> Near-total replacement of fossil fuel heating systems
    """
    story.append(Paragraph(mandate_context, styles['MBRACEBody']))
    story.append(Spacer(1, 15))
    
    # =========================================================================
    # NEXT STEPS
    # =========================================================================
    story.append(Paragraph("RECOMMENDED NEXT STEPS", styles['SectionHeader']))
    
    if data.get('building_type') == 'nonprofit':
        next_steps = """
        <b>For Nonprofit Organizations:</b><br/><br/>
        1. <b>Confirm 501(c)(3) documentation</b> — IRS determination letter required for MEA grants<br/><br/>
        2. <b>Request program-approved energy assessment</b> — Contact MEA or your utility<br/><br/>
        3. <b>Apply for ECB/EEE grants</b> — Download current FOA from MEA website<br/><br/>
        4. <b>Stack utility rebates</b> — Submit EmPOWER pre-approval in parallel<br/><br/>
        5. <b>Wait for written approval before installation</b> — Critical for incentive capture
        """
    elif data.get('building_type') in ['5+_multifamily', '2-4_unit']:
        next_steps = """
        <b>For Multifamily Property Owners:</b><br/><br/>
        1. <b>Confirm low-income status documentation</b> — LIHTC, HUD contracts, or tenant income records<br/><br/>
        2. <b>Identify program lane</b> — EmPOWER low-income track or DHCD/MEEHA for 5+ units<br/><br/>
        3. <b>Request program-approved energy audit</b> — Contact DHCD or your utility<br/><br/>
        4. <b>Stack incentives</b> — EmPOWER + IRA HEEHR/HOMES + MEA grants<br/><br/>
        5. <b>Submit applications with audit report and quotes</b> — Pre-approval before install
        """
    else:
        next_steps = """
        <b>For Homeowners:</b><br/><br/>
        1. <b>Verify income eligibility</b> — Under 80% AMI qualifies for maximum rebates<br/><br/>
        2. <b>Get quotes from electrification-ready contractors</b> — Ask about Manual J calculations<br/><br/>
        3. <b>Apply for utility rebates</b> — EmPOWER HPwES track for comprehensive upgrades<br/><br/>
        4. <b>Claim federal tax credit</b> — 25C credit up to $2,000 for qualifying heat pumps<br/><br/>
        5. <b>Document everything</b> — AHRI certificates, invoices, ENERGY STAR ratings
        """
    
    story.append(Paragraph(next_steps, styles['MBRACEBody']))
    story.append(Spacer(1, 20))
    
    # =========================================================================
    # FOOTER / DISCLAIMER
    # =========================================================================
    story.append(HRFlowable(width="100%", thickness=1, color=colors.gray))
    story.append(Spacer(1, 10))
    
    disclaimer = """
    <b>Disclaimer:</b> This report provides estimates based on current program information and the data 
    you submitted. Actual incentive amounts depend on final eligibility verification, program availability, 
    and project specifications. Programs and funding levels may change. MBRACE Intelligence does not 
    install equipment or provide contracting services. Consult program administrators for final eligibility 
    determinations.<br/><br/>
    <b>MBRACE Intelligence</b> | Maryland Electrification Data & Compliance<br/>
    Questions? Reply to the email or text that delivered this report.
    """
    story.append(Paragraph(disclaimer, styles['Footer']))
    
    # Build PDF
    doc.build(story)
    
    return output_path


# ============================================================================
# CLI INTERFACE
# ============================================================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate MBRACE Incentive Scan Report')
    parser.add_argument('--data', type=str, required=True, help='JSON string with submission data')
    parser.add_argument('--output', type=str, default=None, help='Output PDF path')
    
    args = parser.parse_args()
    
    try:
        data = json.loads(args.data)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        exit(1)
    
    output_path = generate_report(data, args.output)
    print(f"Report generated: {output_path}")


# ============================================================================
# EXAMPLE USAGE
# ============================================================================
"""
Example submission data structure:

{
    "address": "1234 Main Street, Baltimore, MD 21201",
    "building_type": "nonprofit",  # nonprofit, 5+_multifamily, 2-4_unit, single_family
    "utility": "BGE",  # BGE, Pepco, Potomac Edison, SMECO, Other
    "heating_system": "gas",  # gas, oil, propane, electric_resistance, existing_heat_pump
    "system_age": "20+",  # <10, 10-15, 15-20, 20+
    "income_level": "under_80_ami",  # under_80_ami, 80_150_ami, over_150_ami
    "org_name": "Community Health Center of Baltimore",  # for nonprofits
    "phone": "+14105551234",
    "email": "director@communityhealthbaltimore.org"
}

Command line:
python generate_incentive_report.py --data '{"address": "1234 Main St", "building_type": "nonprofit", "utility": "BGE", "heating_system": "oil", "system_age": "20+", "income_level": "under_80_ami", "org_name": "Test Nonprofit"}'

Programmatic:
from generate_incentive_report import generate_report
pdf_path = generate_report(submission_data)
"""
