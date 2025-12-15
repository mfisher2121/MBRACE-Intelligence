// Nonprofit Playbook - Complete Funding Guide
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

export default function NonprofitPlaybookScreen() {
  const router = useRouter();
  
  // Checklist state
  const [checklist, setChecklist] = useState({
    // Step 1: Confirm Eligibility
    nonprofit501c3: false,
    communityServing: false,
    electricBill: false,
    
    // Step 2: Apply for Assessment
    hireAuditor: false,
    receiveReport: false,
    obtainQuotes: false,
    
    // Step 3: Build Funding Stack
    targetECB: false,
    targetEEE: false,
    targetEmpower: false,
    
    // Step 4: Submit Applications
    downloadFOA: false,
    submitApplication: false,
    submitUtility: false,
    
    // Step 5: Install and Close Out
    installApproved: false,
    provideDocs: false,
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
      playbookType: 'nonprofit',
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
          <Text style={styles.heroTitle}>Nonprofit Organizations</Text>
          <Text style={styles.heroSubtitle}>
            Heat Pump + Insulation Funding Playbook
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% Complete ({completedCount}/{totalCount})</Text>
          </View>
        </LinearGradient>

        {/* Eligible Facilities */}
        <Card variant="outlined" style={styles.eligibilityCard}>
          <Text style={styles.cardTitle}>Eligible Facilities</Text>
          <View style={styles.facilityGrid}>
            {[
              'Churches & Religious Buildings',
              'Schools & Educational Centers',
              'Health Clinics',
              'Community Centers',
              'Shelters',
              'Arts Centers',
              'Food Banks',
              'Senior Centers'
            ].map((facility, index) => (
              <View key={index} style={styles.facilityItem}>
                <Ionicons name="checkmark-circle" size={16} color={THEME.colors.success} />
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Step 1 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Confirm Eligibility</Text>
              <Text style={styles.stepSubtitle}>Gather required documentation</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="We are a nonprofit (501(c)(3)) and can provide the IRS determination letter"
              checked={checklist.nonprofit501c3}
              onToggle={() => toggleItem('nonprofit501c3')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Our building is a community-serving facility"
              checked={checklist.communityServing}
              onToggle={() => toggleItem('communityServing')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="We have a recent electric bill for this site"
              checked={checklist.electricBill}
              onToggle={() => toggleItem('electricBill')}
              subItems={[
                'Shows utility provider (BGE, Pepco, DPL, Potomac Edison, SMECO)',
                'Shows account number for rebate applications'
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
              <Text style={styles.stepTitle}>Apply for Assessment & Select Contractor</Text>
              <Text style={styles.stepSubtitle}>Get a program-approved energy audit</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Hire an auditor (utility-approved or MEA-recommended) for a written energy assessment"
              checked={checklist.hireAuditor}
              onToggle={() => toggleItem('hireAuditor')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Receive audit report detailing recommended heat pumps, insulation, and air sealing"
              checked={checklist.receiveReport}
              onToggle={() => toggleItem('receiveReport')}
              subItems={[
                'Heat pump options (central/VRF/splits)',
                'Insulation scope (especially attic/roof)',
                'Air sealing opportunities'
              ]}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Obtain contractor quotes, broken out by measure (labor + material)"
              checked={checklist.obtainQuotes}
              onToggle={() => toggleItem('obtainQuotes')}
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
              <Text style={styles.stepTitle}>Build the Funding Stack</Text>
              <Text style={styles.stepSubtitle}>Combine multiple funding sources</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.infoCard}>
            <Ionicons name="bulb-outline" size={20} color={THEME.colors.secondary} />
            <Text style={styles.infoCardText}>
              The key to "free" installation is stacking grants and rebates. Target all three sources below.
            </Text>
          </Card>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Target MEA Electrifying Community Buildings (ECB) Grant"
              checked={checklist.targetECB}
              onToggle={() => toggleItem('targetECB')}
              subItems={[
                'Covers capital costs for heat pumps',
                'Includes heat-pump water heaters',
                'Covers panel upgrades if needed'
              ]}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Target MEA Energy Efficiency Equity (EEE) Grant"
              checked={checklist.targetEEE}
              onToggle={() => toggleItem('targetEEE')}
              subItems={[
                'Covers deep efficiency upgrades',
                'Insulation and air sealing',
                'For facilities benefiting LMI residents'
              ]}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Target Utility EmPOWER incentives"
              checked={checklist.targetEmpower}
              onToggle={() => toggleItem('targetEmpower')}
              subItems={[
                'Commercial/C&I/SMB HVAC rebates',
                'Custom incentives for deeper efficiency'
              ]}
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
              <Text style={styles.stepTitle}>Submit Applications</Text>
              <Text style={styles.stepSubtitle}>Apply for grants and pre-approval</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Download and submit current FOA and application forms from MEA site"
              checked={checklist.downloadFOA}
              onToggle={() => toggleItem('downloadFOA')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Submit application with energy assessment report and budget/quotes"
              checked={checklist.submitApplication}
              onToggle={() => toggleItem('submitApplication')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Submit utility pre-approval for equipment and insulation rebates"
              checked={checklist.submitUtility}
              onToggle={() => toggleItem('submitUtility')}
              subItems={['Use commercial/C&I portal for your utility']}
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
              <Text style={styles.stepTitle}>Install and Close Out</Text>
              <Text style={styles.stepSubtitle}>Complete installation with documentation</Text>
            </View>
          </View>

          <Card variant="outlined" style={styles.warningCard}>
            <Ionicons name="warning-outline" size={20} color={THEME.colors.warning} />
            <Text style={styles.warningText}>
              <Text style={styles.warningBold}>IMPORTANT:</Text> Install ONLY after receiving written approvals/award letters. 
              Installing before approval may void your funding.
            </Text>
          </Card>

          <Card variant="outlined" style={styles.checklistCard}>
            <ChecklistItem
              text="Install the approved scope only after receiving written approvals"
              checked={checklist.installApproved}
              onToggle={() => toggleItem('installApproved')}
            />
            <Divider style={styles.checklistDivider} />
            <ChecklistItem
              text="Provide MEA and utility with required documentation"
              checked={checklist.provideDocs}
              onToggle={() => toggleItem('provideDocs')}
              subItems={[
                'Final invoices',
                'Spec sheets',
                'Photos of installation',
                'Commissioning reports'
              ]}
            />
          </Card>
        </View>

        {/* Key Contacts */}
        <Text style={styles.sectionTitle}>Key Resources</Text>
        <Card variant="outlined" style={styles.resourceCard}>
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>Maryland Energy Administration (MEA)</Text>
            <Text style={styles.resourceUrl}>energy.maryland.gov</Text>
          </View>
          <Divider />
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>EmPOWER Maryland Programs</Text>
            <Text style={styles.resourceUrl}>empowermaryland.energy.gov</Text>
          </View>
          <Divider />
          <View style={styles.resourceItem}>
            <Text style={styles.resourceName}>Clean Energy Workforce Account</Text>
            <Text style={styles.resourceDesc}>Grants for training in clean energy trades</Text>
          </View>
        </Card>

        {/* CTA */}
        <Card variant="elevated" style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Need Help Getting Started?</Text>
          <Text style={styles.ctaText}>
            Book a free consultation to discuss your facility's eligibility and create a funding plan.
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
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 12,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 6,
    flex: 1,
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
    backgroundColor: '#f0fdfa',
    borderColor: THEME.colors.secondary,
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 12,
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
  resourceUrl: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.secondary,
    marginTop: 2,
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
