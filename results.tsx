// Calculator Step 6: Results - Comprehensive Savings Report
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEME, KEY_DATES, HEAT_PUMP_BRANDS } from '../../lib/constants';
import { useCalculator } from '../../lib/store';
import { formatCurrency } from '../../lib/calculator';
import { Button, Card, Badge, Divider, StatCard } from '../../components/ui';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const router = useRouter();
  const { state, reset } = useCalculator();
  const results = state.results;

  if (!results) {
    return (
      <View style={styles.container}>
        <Text>No results available. Please complete the calculator.</Text>
        <Button title="Start Over" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `I just discovered I can save ${formatCurrency(results.totalIncentives)} on a heat pump installation in ${results.locationData.stateName}! Check out the MBRACE calculator to see your savings.`,
        url: 'https://mbrace.io/calculator',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleConsultation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/consultation');
  };

  const handleStartOver = () => {
    reset();
    router.replace('/');
  };

  const handleViewPlaybooks = () => {
    router.push('/playbooks');
  };

  // Risk color mapping
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'VERY HIGH': return THEME.colors.error;
      case 'HIGH': return THEME.colors.warning;
      case 'MODERATE': return THEME.colors.warning;
      case 'LOW': return THEME.colors.success;
      case 'NONE': return THEME.colors.success;
      default: return THEME.colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Summary */}
        <LinearGradient
          colors={['#1a365d', '#0f172a']}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <Ionicons name="checkmark-circle" size={32} color={THEME.colors.success} />
            <Text style={styles.heroTitle}>Your Savings Report</Text>
          </View>

          <Text style={styles.totalIncentivesLabel}>Total Available Incentives</Text>
          <Text style={styles.totalIncentivesValue}>
            {formatCurrency(results.totalIncentives)}
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{formatCurrency(results.netCost)}</Text>
              <Text style={styles.heroStatLabel}>Net Cost</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{formatCurrency(results.annualSavings)}</Text>
              <Text style={styles.heroStatLabel}>Annual Savings</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{results.paybackYears} yrs</Text>
              <Text style={styles.heroStatLabel}>Payback</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Incentive Breakdown */}
        <Text style={styles.sectionTitle}>Incentive Breakdown</Text>
        <Card variant="outlined" style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <Ionicons name="business-outline" size={20} color={THEME.colors.secondary} />
              <Text style={styles.breakdownText}>{results.locationData.stateName} State Rebate</Text>
            </View>
            <Text style={styles.breakdownValue}>
              {formatCurrency(results.incentiveBreakdown.state)}
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <Ionicons name="flash-outline" size={20} color={THEME.colors.secondary} />
              <Text style={styles.breakdownText}>{results.locationData.utilityName}</Text>
            </View>
            <Text style={styles.breakdownValue}>
              {formatCurrency(results.incentiveBreakdown.utility)}
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <Ionicons name="flag-outline" size={20} color={THEME.colors.secondary} />
              <Text style={styles.breakdownText}>Federal IRA Tax Credit</Text>
            </View>
            <Text style={styles.breakdownValue}>
              {formatCurrency(results.incentiveBreakdown.federal)}
            </Text>
          </View>
          
          <View style={styles.coverageBar}>
            <View style={styles.coverageBarBg}>
              <LinearGradient
                colors={['#0d9488', '#0f766e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.coverageBarFill, { width: `${Math.min(100, results.incentiveBreakdown.coverage)}%` }]}
              />
            </View>
            <Text style={styles.coverageText}>
              {results.incentiveBreakdown.coverage}% of installation cost covered
            </Text>
          </View>
        </Card>

        {/* 10-Year Projection */}
        <Text style={styles.sectionTitle}>10-Year Savings Projection</Text>
        <Card variant="elevated" style={styles.projectionCard}>
          <View style={styles.projectionRow}>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Current System Cost</Text>
              <Text style={styles.projectionOld}>
                {formatCurrency(results.utilityProjections.currentAnnualCost * 10)}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={THEME.colors.text.light} />
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Heat Pump Cost</Text>
              <Text style={styles.projectionNew}>
                {formatCurrency(results.utilityProjections.heatPumpAnnualCost * 10)}
              </Text>
            </View>
          </View>
          
          <View style={styles.totalSavings}>
            <Text style={styles.totalSavingsLabel}>Total 10-Year Savings</Text>
            <Text style={styles.totalSavingsValue}>{formatCurrency(results.tenYearSavings)}</Text>
          </View>

          <View style={styles.utilityWarning}>
            <Ionicons name="trending-up" size={18} color={THEME.colors.warning} />
            <Text style={styles.utilityWarningText}>
              Utility costs projected to increase ${Math.round(results.peIntelligence.projectedUtilityIncrease / 60)}/month by 2030
            </Text>
          </View>
        </Card>

        {/* Risk Assessment */}
        <Text style={styles.sectionTitle}>Risk Assessment</Text>
        <Card variant="outlined" style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <View style={styles.riskItem}>
              <Text style={styles.riskLabel}>Stranded Asset Risk</Text>
              <Badge 
                text={results.riskAssessment.strandedAssetRisk}
                variant={
                  results.riskAssessment.strandedAssetRisk === 'VERY HIGH' || 
                  results.riskAssessment.strandedAssetRisk === 'HIGH' 
                    ? 'error' 
                    : results.riskAssessment.strandedAssetRisk === 'NONE' 
                      ? 'success' 
                      : 'warning'
                }
              />
            </View>
            <View style={styles.riskItem}>
              <Text style={styles.riskLabel}>System Urgency</Text>
              <Badge 
                text={results.riskAssessment.urgencyLevel}
                variant={
                  results.riskAssessment.urgencyLevel === 'CRITICAL' || 
                  results.riskAssessment.urgencyLevel === 'VERY HIGH' 
                    ? 'error' 
                    : results.riskAssessment.urgencyLevel === 'LOW' 
                      ? 'success' 
                      : 'warning'
                }
              />
            </View>
          </View>
          
          <Divider />
          
          <View style={styles.mandateInfo}>
            <Ionicons name="calendar-outline" size={20} color={THEME.colors.primary} />
            <View style={styles.mandateText}>
              <Text style={styles.mandateTitle}>
                {results.riskAssessment.yearsUntilMandate} years until Maryland ZEHES mandate
              </Text>
              <Text style={styles.mandateDescription}>
                {results.locationData.mandateDescription}
              </Text>
            </View>
          </View>
          
          <View style={styles.recommendationBox}>
            <Ionicons name="bulb-outline" size={20} color={THEME.colors.secondary} />
            <Text style={styles.recommendationText}>
              {results.riskAssessment.recommendation}
            </Text>
          </View>
        </Card>

        {/* Equipment Guidance */}
        <Text style={styles.sectionTitle}>Recommended Equipment</Text>
        <Card variant="outlined" style={styles.equipmentCard}>
          <Text style={styles.equipmentTitle}>Premium Cold-Climate Heat Pumps</Text>
          <Text style={styles.equipmentSubtitle}>
            These brands are proven for DMV winters (heating down to -13°F)
          </Text>
          
          <View style={styles.brandList}>
            {HEAT_PUMP_BRANDS.premiumColdClimate.slice(0, 4).map((brand, index) => (
              <View key={index} style={styles.brandItem}>
                <Ionicons name="checkmark-circle" size={16} color={THEME.colors.success} />
                <Text style={styles.brandName}>{brand.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.installWarning}>
            <Ionicons name="construct-outline" size={18} color={THEME.colors.primary} />
            <Text style={styles.installWarningText}>
              Installation quality matters more than brand. Choose contractors certified in Manual J/S/D load calculations.
            </Text>
          </View>
        </Card>

        {/* Next Steps */}
        <Text style={styles.sectionTitle}>Next Steps</Text>
        <Card variant="outlined" style={styles.nextStepsCard}>
          <View style={styles.nextStep}>
            <View style={styles.nextStepNumber}>
              <Text style={styles.nextStepNumberText}>1</Text>
            </View>
            <View style={styles.nextStepContent}>
              <Text style={styles.nextStepTitle}>Book a Consultation</Text>
              <Text style={styles.nextStepText}>
                Get a professional assessment and accurate quote
              </Text>
            </View>
          </View>
          
          <View style={styles.nextStep}>
            <View style={styles.nextStepNumber}>
              <Text style={styles.nextStepNumberText}>2</Text>
            </View>
            <View style={styles.nextStepContent}>
              <Text style={styles.nextStepTitle}>Stack Your Incentives</Text>
              <Text style={styles.nextStepText}>
                We help you apply for all eligible programs
              </Text>
            </View>
          </View>
          
          <View style={styles.nextStep}>
            <View style={styles.nextStepNumber}>
              <Text style={styles.nextStepNumberText}>3</Text>
            </View>
            <View style={styles.nextStepContent}>
              <Text style={styles.nextStepTitle}>Get Installed</Text>
              <Text style={styles.nextStepText}>
                Professional installation with full commissioning
              </Text>
            </View>
          </View>
        </Card>

        {/* Playbook CTA */}
        <TouchableOpacity 
          style={styles.playbookCta}
          onPress={handleViewPlaybooks}
          activeOpacity={0.8}
        >
          <View style={styles.playbookCtaContent}>
            <Ionicons name="document-text" size={28} color={THEME.colors.primary} />
            <View style={styles.playbookCtaText}>
              <Text style={styles.playbookCtaTitle}>Nonprofit or Affordable Housing?</Text>
              <Text style={styles.playbookCtaSubtitle}>
                Access playbooks for 100% covered installations
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={THEME.colors.text.light} />
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Share Results"
            onPress={handleShare}
            variant="outline"
            icon="share-outline"
            style={styles.actionButton}
          />
          <Button
            title="Start Over"
            onPress={handleStartOver}
            variant="ghost"
            icon="refresh-outline"
            style={styles.actionButton}
          />
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Estimates based on current incentive programs and typical installation costs. 
          Actual savings may vary. Final eligibility determined at application.
          Data sourced from MEA, DCSEU, Virginia HEEHRA, and IRA guidelines.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyCta}>
        <Button
          title="Book Free Consultation"
          onPress={handleConsultation}
          icon="calendar-outline"
          size="large"
        />
      </View>
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
  heroCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 10,
  },
  totalIncentivesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  totalIncentivesValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 8,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  heroStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  breakdownCard: {
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 10,
  },
  breakdownValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.secondary,
  },
  coverageBar: {
    marginTop: 16,
  },
  coverageBarBg: {
    height: 8,
    backgroundColor: THEME.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  coverageBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  coverageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  projectionCard: {
    marginBottom: 16,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectionItem: {
    flex: 1,
    alignItems: 'center',
  },
  projectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
  },
  projectionOld: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.error,
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  projectionNew: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.success,
    marginTop: 4,
  },
  totalSavings: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    marginBottom: 12,
  },
  totalSavingsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.secondary,
  },
  totalSavingsValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.success,
  },
  utilityWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
  },
  utilityWarningText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  riskCard: {
    marginBottom: 16,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskItem: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginBottom: 6,
  },
  mandateInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  mandateText: {
    marginLeft: 10,
    flex: 1,
  },
  mandateTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  mandateDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdfa',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  recommendationText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  equipmentCard: {
    marginBottom: 16,
  },
  equipmentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  equipmentSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
    marginBottom: 12,
  },
  brandList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 6,
  },
  installWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
  },
  installWarningText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  nextStepsCard: {
    marginBottom: 16,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nextStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nextStepNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  nextStepText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  playbookCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdfa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.secondary,
    marginBottom: 24,
  },
  playbookCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playbookCtaText: {
    marginLeft: 12,
    flex: 1,
  },
  playbookCtaTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  playbookCtaSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  disclaimer: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.light,
    textAlign: 'center',
    lineHeight: 16,
  },
  stickyCta: {
    padding: 16,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
});
