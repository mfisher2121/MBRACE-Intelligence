import React from 'react';

const MBRACESystemDiagram = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          margin: 0,
          letterSpacing: '-0.5px',
          color: '#f8fafc'
        }}>
          MBRACE INTELLIGENCE ENGINE
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#94a3b8', 
          margin: '8px 0 0 0',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Maryland Electrification Data & Compliance Platform
        </p>
      </div>

      {/* Main Diagram Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Layer 1: List Sources */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #334155'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>LAYER 1</div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Authoritative List Acquisition
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {/* LIHTC/HUD */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #475569'
            }}>
              <div style={{ 
                color: '#60a5fa', 
                fontSize: '13px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                LOW-INCOME HOUSING
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '16px', 
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: '1.8'
              }}>
                <li>HUD LIHTC Database</li>
                <li>State Housing Finance Agencies</li>
                <li>Section 8 / PHA Records</li>
              </ul>
            </div>
            
            {/* Nonprofits */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #475569'
            }}>
              <div style={{ 
                color: '#34d399', 
                fontSize: '13px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                NONPROFIT ORGANIZATIONS
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '16px', 
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: '1.8'
              }}>
                <li>IRS Form 990 Filings</li>
                <li>State Charity Registries</li>
                <li>Utility Community Partners</li>
              </ul>
            </div>
            
            {/* PE/Institutional */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #475569'
            }}>
              <div style={{ 
                color: '#fbbf24', 
                fontSize: '13px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                PE / INSTITUTIONAL
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '16px', 
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: '1.8'
              }}>
                <li>CoStar / Reonomy</li>
                <li>SEC Filings & Press</li>
                <li>Housing Authority Counterparties</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M20 5 L20 30 M10 22 L20 32 L30 22" 
                  stroke="#3b82f6" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* Layer 2: Calculator / Conversion */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #3b82f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>LAYER 2</div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Intelligence Capture Engine
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Traffic Sources */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                TRAFFIC SOURCES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  backgroundColor: '#1e40af', 
                  padding: '8px', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>Paid Search</div>
                <div style={{ 
                  backgroundColor: '#1e40af', 
                  padding: '8px', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>Direct Email</div>
                <div style={{ 
                  backgroundColor: '#1e40af', 
                  padding: '8px', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>Partner Referrals</div>
              </div>
            </div>

            {/* Calculator Core */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              padding: '20px',
              border: '2px solid #22c55e',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '700',
                color: '#22c55e',
                marginBottom: '16px'
              }}>
                DMV ELECTRIFICATION CALCULATOR
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontSize: '11px'
              }}>
                <div style={{ backgroundColor: '#1e293b', padding: '8px', borderRadius: '4px' }}>
                  📍 Address + Building Type
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px', borderRadius: '4px' }}>
                  ⚡ Utility Territory
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px', borderRadius: '4px' }}>
                  🔥 Heating System + Age
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px', borderRadius: '4px' }}>
                  💰 Income Classification
                </div>
              </div>
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#14532d',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#86efac'
              }}>
                <strong>OUTPUT:</strong> Personalized Incentive Scan ($8K-$30K+)
              </div>
            </div>

            {/* Speed to Lead */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                SPEED-TO-LEAD
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  backgroundColor: '#7c3aed', 
                  padding: '8px', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>T+10s: SMS</div>
                <div style={{ 
                  backgroundColor: '#7c3aed', 
                  padding: '8px', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>T+30s: VAPI Call</div>
                <div style={{ 
                  backgroundColor: '#7c3aed', 
                  padding: '8px', 
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>T+2hr: PDF Report</div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M20 5 L20 30 M10 22 L20 32 L30 22" 
                  stroke="#22c55e" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* Layer 3: Intelligence Dataset */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #334155'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#f59e0b',
              color: 'black',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>LAYER 3</div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Proprietary Intelligence Dataset
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                500+
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Submissions = Index Ready
              </div>
            </div>
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#60a5fa', fontWeight: '600' }}>
                Utility Exposure Maps
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                BGE / Pepco / SMECO risk curves
              </div>
            </div>
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>
                ZEHES Timeline Risk
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                System age → forced replacement
              </div>
            </div>
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600' }}>
                Incentive Saturation
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                Program capacity by region
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M20 5 L20 30 M10 22 L20 32 L30 22" 
                  stroke="#f59e0b" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* Layer 4: Multipliers / Monetization */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #f59e0b'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#f59e0b',
              color: 'black',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>LAYER 4</div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Multipliers & Monetization
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {/* Housing Authority Loop */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #3b82f6'
            }}>
              <div style={{ 
                color: '#60a5fa', 
                fontSize: '13px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🏛️ HOUSING AUTHORITY LOOP
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6' }}>
                Neutral tool + SOP → HAs push to hundreds of owners
              </div>
              <div style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#1e3a5f',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#93c5fd'
              }}>
                <strong>1 relationship → 100s of assets</strong>
              </div>
            </div>

            {/* Contractor Network */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #22c55e'
            }}>
              <div style={{ 
                color: '#4ade80', 
                fontSize: '13px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🔧 CONTRACTOR NETWORK
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6' }}>
                Pre-qualified projects + SOPs → contractors become distribution
              </div>
              <div style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#14532d',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#86efac'
              }}>
                <strong>Volume without ad spend</strong>
              </div>
            </div>

            {/* PE Inbound */}
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ 
                color: '#fbbf24', 
                fontSize: '13px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                💼 PE INBOUND
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6' }}>
                Maryland Electrification Index → PE asks "run this on our portfolio"
              </div>
              <div style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#78350f',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#fde68a'
              }}>
                <strong>Outreach flips → they qualify to you</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Value Proposition */}
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #8b5cf6',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            color: '#a78bfa',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            The Asymmetry
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '16px'
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc' }}>
                Regulation
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                creates urgency
              </div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                Incentives
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                create upside
              </div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                Data
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                creates power
              </div>
            </div>
          </div>
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#1e1b4b',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#c4b5fd'
          }}>
            PE cannot scrape it. PE cannot buy it. <strong>PE must come to you.</strong>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          fontSize: '11px',
          color: '#64748b'
        }}>
          MBRACE Intelligence Engine • Maryland Building Electrification Platform • mbrace.io
        </div>
      </div>
    </div>
  );
};

export default MBRACESystemDiagram;
