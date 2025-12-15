// Low-Income Housing Playbook - Complete Funding Guide
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEME } from '../../lib/constants';
import { Card, Badge, Button, Divider } from '../../components/ui';
import { trackPlaybookAccess } from '../../lib/firebase';

interface ChecklistItemProps {
  text: string;
  checked: boolean;
  onToggle: () => void;
  subItems?: string[];
}

function ChecklistItem({ text, checked, onToggle, subItems }: ChecklistItemProps) {
  return (
    <View style={styles.checklistItemContainer}>
      <TouchableOpacity 
        style={styles.checklistItem}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle();
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <Text style={[styles.checklistText, checked && styles.checklistTextChecked]}>
          {text}
        </Text>
      </TouchableOpacity>
      {subItems && subItems.map((item, index) => (
        <View key={index} style={styles.subItem}>
          <Text style={styles.subItemBullet}>•</Text>
          <Text style={styles.subItemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function LowIncomePlaybookScreen() {
  const router = useRouter();
  
  // Checklist state
  const [checklist, setChecklist] = useState({
    // Step 1: Confirm Low-Income Status
    electricBill: false,
    proofStatus: false,
    
    // Step 2: Identify Program Lane
    identifyLane: false,
    
    // Step 3: Request Audit
    requestAudit: false,
    provideAccess: false,
    
    // Step 4: Define Project
    confirmScope: false,
    obtainQuotes: false,
    
    // Step 5: Stack Incentives
    calculateCoverage: false,
    includeIRA: false,
    submitApplications: false,
    waitApproval: false,
    
    // Step 6: Install and Finalize
    installApproved: false,
    submitDocs: false,
    confirmIncentives: false,
  });

  const toggleItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const progress = Math.round((completedCount / totalCount) * 100);

  // Track access
  React.useEffect(() => {
    trackPlaybookAccess({
      playbookType: 'low-income',
      downloadedPdf: false,
      contactSubmitted: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#1a365d', '#0f172a']}
          style={styles.hero}
        >
          <Badge text="Up to 100% Covered" variant="success" style={styles.heroBadge} />
          <Text style={styles.heroTitle}>Low-Income Housing</Text>
          <Text style={styles.heroSubtitle}>
            Owners & Operators Funding Playbook
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% Complete ({completedCount}/{totalCount})</Text>
          </View>
        </LinearGradient>

        {/* Eligibility Overview */}
        <Card variant="outlined" style={styles.eligibilityCard}>
          <Text style={styles.cardTitle}>Who Qualifies</Text>
          <View style={styles.eligibilityGrid}>
            <View style={styles.eligibilityItem}>
              <Text style={styles.eligibilityLabel}>Income Threshold</Text>
              <Text style={styles.eligibilityValue}>&lt;80% Area Median Income (AMI)</Text>
            </View>
            <View style={styles.eligibilityItem}>
              <Text style={styles.eligibilityLabel}>Property Types</Text>
              <Text style={styles.eligibilityValue}>1-4 units and 5+ unit multifamily</Text>
            </View>
            <View style={styles.eligibilityItem}>
              <Text style={styles.eligibilityLabel}>Proof Options</Text>
              <Text style={styles.eligibilityValue}>LIHTC, HUD/Section 8, Tenant Records</Text>
            </View>
          </View>
        </Card>

        {/* Program Lanes */}
        <Text style={styles.sectionTitle}>Available Program Lanes</Text>
        <Card variant="outlined" style={styles.laneCard}>
          <View style={styles.laneHeader}>
            <Badge text="1-4 Units" variant="info" />
          </View>
          <Text style={styles.lanePrograms}>
            EmPOWER Low-Income • DHCD Homeowner Grants • HPwES (Home Performance with ENERGY STAR)
          </Text>
        </Card>
        
        <Card variant="outlined" style={styles.laneCard}>
          <View style={styles.laneHeader}>
            <Badge text="5+ Units" variant="info" />
          </View>
          <Text style={styles.lanePrograms}>
            DHCD MEEHA • Multifamily Energy Programs • MEA Multifamily Buildings Incentives
          </Text>
        </Card>

        {/* Step 1 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Confirm Low-Income Status</Text>
              <Text style={styles.stepSubtitle}>Gather eligibility documentation</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="We have a recent electric bill for this property"
              checked={checklist.electricBill}
              onToggle={() => toggleItem('electricBill')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="We can provide proof of low-income status"
              checked={checklist.proofStatus}
              onToggle={() => toggleItem('proofStatus')}
              subItems={[
                'LIHTC covenants',
                'HUD contracts / Section 8',
                'Majority tenant income ≤80% AMI documentation'
              ]}
            />
          </Card>
        </View>

        {/* Step 2 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Identify Program Lane</Text>
              <Text style={styles.stepSubtitle}>Choose based on property size</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Identify correct program lane for your property"
              checked={checklist.identifyLane}
              onToggle={() => toggleItem('identifyLane')}
              subItems={[
                '1-4 units: EmPOWER low-income / DHCD homeowner grants / HPwES',
                '5+ units: DHCD MEEHA / multifamily energy programs / MEA Multifamily'
              ]}
            />
          </Card>
        </View>

        {/* Step 3 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Request Program-Approved Audit</Text>
              <Text style={styles.stepSubtitle}>Get professional energy assessment</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Contact DHCD/MEA or utility to request multifamily / low-income energy assessment"
              checked={checklist.requestAudit}
              onToggle={() => toggleItem('requestAudit')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Provide site access and 12-24 months of energy usage data"
              checked={checklist.provideAccess}
              onToggle={() => toggleItem('provideAccess')}
            />
          </Card>
        </View>

        {/* Step 4 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Define the Heat Pump + Insulation Project</Text>
              <Text style={styles.stepSubtitle}>Scope based on audit recommendations</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Confirm project scope based on audit"
              checked={checklist.confirmScope}
              onToggle={() => toggleItem('confirmScope')}
              subItems={[
                'Cold-climate heat pumps',
                'Heat pump water heaters',
                'Insulation improvements',
                'Air sealing'
              ]}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Ask contractor to provide quotes that break out costs by measure and list AHRI ratings/R-values"
              checked={checklist.obtainQuotes}
              onToggle={() => toggleItem('obtainQuotes')}
            />
          </Card>
        </View>

        {/* Step 5 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Stack Incentives and Get Pre-Approval</Text>
              <Text style={styles.stepSubtitle}>Maximize funding coverage</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.infoCard}>
            <Ionicons name="cash-outline" size={20} color={THEME.colors.success} />
            <Text style={styles.infoCardText}>
              Low-income properties often qualify for 50-100% project cost coverage when incentives are properly stacked.
            </Text>
          </Card>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Calculate estimated coverage from EmPOWER / DHCD / MEEHA incentives"
              checked={checklist.calculateCoverage}
              onToggle={() => toggleItem('calculateCoverage')}
              subItems={['Often 50-100% of project cost for low-income']}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Include expected coverage from IRA HEEHR / HOMES rebates"
              checked={checklist.includeIRA}
              onToggle={() => toggleItem('includeIRA')}
              subItems={['Up to ~$14,000 per project for qualifying measures']}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Submit applications / pre-approval forms with low-income proof, audit report, and quotes"
              checked={checklist.submitApplications}
              onToggle={() => toggleItem('submitApplications')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Wait for written pre-approval / offer letters confirming coverage"
              checked={checklist.waitApproval}
              onToggle={() => toggleItem('waitApproval')}
            />
          </Card>
        </View>

        {/* Step 6 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>6</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Install and Finalize</Text>
              <Text style={styles.stepSubtitle}>Complete with proper documentation</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.warningCard}>
            <Ionicons name="warning-outline" size={20} color={THEME.colors.warning} />
            <Text style={styles.warningText}>
              <Text style={styles.warningBold}>CRITICAL:</Text> Install ONLY the approved scope after receiving written approvals. 
              Pre-installation work may void your funding eligibility.
            </Text>
          </Card>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Install only the approved scope"
              checked={checklist.installApproved}
              onToggle={() => toggleItem('installApproved')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Ensure contractor submits required documentation"
              checked={checklist.submitDocs}
              onToggle={() => toggleItem('submitDocs')}
              subItems={[
                'Final invoices',
                'AHRI/ENERGY STAR documents',
                'Commissioning forms'
              ]}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Confirm incentives are processed and applied"
              checked={checklist.confirmIncentives}
              onToggle={() => toggleItem('confirmIncentives')}
            />
          </Card>
        </View>

        {/* Federal HEEHRA Details */}
        <Text style={styles.sectionTitle}>Federal HEEHRA Coverage</Text>
        <Card variant="elevated" style={styles.heehraCard}>
          <View style={styles.heehraRow}>
            <View style={styles.heehraItem}>
              <Text style={styles.heehraLabel}>Low-Income</Text>
              <Text style={styles.heehraValue}>100%</Text>
              <Text style={styles.heehraDesc}>of installation costs</Text>
            </View>
            <View style={styles.heeehraDivider} />
            <View style={styles.heehraItem}>
              <Text style={styles.heehraLabel}>Moderate-Income</Text>
              <Text style={styles.heehraValue}>50%</Text>
              <Text style={styles.heehraDesc}>up to $4,000 cap</Text>
            </View>
          </View>
        </Card>

        {/* Key Contacts */}
        <Text style={styles.sectionTitle}>Key Resources</Text>
        <Card variant="outlined" style={styles.resourceCard}>
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>Maryland DHCD</Text>
            <Text style={styles.resourceDesc}>Department of Housing and Community Development</Text>
          </View>
          <Divider />
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>DHCD MEEHA</Text>
            <Text style={styles.resourceDesc}>Multifamily Energy Efficiency and Housing Affordability</Text>
          </View>
          <Divider />
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>EmPOWER Maryland</Text>
            <Text style={styles.resourceDesc}>Low-income residential tracks</Text>
          </View>
          <Divider />
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>IRA HEEHR / HOMES</Text>
            <Text style={styles.resourceDesc}>Federal rebates up to ~$14,000 per project</Text>
          </View>
        </Card>

        {/* CTA */}
        <Card variant="elevated" style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Book a free consultation to assess your property's eligibility and create a customized funding strategy.
          </Text>
          <Button
            title="Book Consultation"
            onPress={() => router.push('/consultation')}
            icon="calendar-outline"
            style={styles.ctaButton}
          />
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  hero: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadge: {
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  eligibilityCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 12,
  },
  eligibilityGrid: {
    gap: 12,
  },
  eligibilityItem: {
    marginBottom: 8,
  },
  eligibilityLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.secondary,
  },
  eligibilityValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  laneCard: {
    marginBottom: 10,
  },
  laneHeader: {
    marginBottom: 8,
  },
  lanePrograms: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 18,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  stepSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
  },
  checklistCard: {
    paddingVertical: 8,
  },
  checklistItemContainer: {
    paddingVertical: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
  },
  checklistText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  checklistTextChecked: {
    textDecorationLine: 'line-through',
    color: THEME.colors.text.light,
  },
  checklistDivider: {
    marginVertical: 4,
  },
  subItem: {
    flexDirection: 'row',
    marginLeft: 34,
    marginTop: 4,
  },
  subItemBullet: {
    fontSize: 12,
    color: THEME.colors.text.secondary,
    marginRight: 6,
  },
  subItemText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderColor: THEME.colors.success,
    marginBottom: 12,
  },
  infoCardText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    borderColor: THEME.colors.warning,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  warningBold: {
    fontFamily: 'Inter-SemiBold',
  },
  heehraCard: {
    marginBottom: 24,
    backgroundColor: THEME.colors.primary,
  },
  heehraRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heehraItem: {
    flex: 1,
    alignItems: 'center',
  },
  heeehraDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heehraLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  heehraValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginVertical: 4,
  },
  heehraDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.6)',
  },
  resourceCard: {
    marginBottom: 16,
  },
  resourceItem: {
    paddingVertical: 8,
  },
  resourceName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  resourceDesc: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  ctaCard: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  ctaButton: {
    width: '100%',
  },
});
