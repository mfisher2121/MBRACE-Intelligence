// Calculator Step 3: Current Heating System
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, HEATING_SYSTEMS, SYSTEM_AGES } from '../../lib/constants';
import { useCalculator } from '../../lib/store';
import { Button, ProgressBar, SelectableCard, Card, Badge } from '../../components/ui';

export default function CurrentSystemScreen() {
  const router = useRouter();
  const { state, setCurrentHeating, setSystemAge, setStep, getProgress } = useCalculator();
  const [showAgeSelect, setShowAgeSelect] = useState(false);

  const handleHeatingSelect = (heating: string) => {
    setCurrentHeating(heating);
    setShowAgeSelect(true);
  };

  const handleAgeSelect = (age: string) => {
    setSystemAge(age);
  };

  const handleContinue = () => {
    if (state.currentHeating && state.systemAge) {
      setStep(4);
      router.push('/calculator/income');
    }
  };

  // Map icons
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'fire': 'flame-outline',
    'water': 'water-outline',
    'flash': 'flash-outline',
    'flame': 'bonfire-outline',
    'eco': 'leaf-outline',
    'help-circle': 'help-circle-outline',
  };

  // Get risk badge variant
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'VERY HIGH': return { variant: 'error' as const, text: 'Very High Risk' };
      case 'HIGH': return { variant: 'warning' as const, text: 'High Risk' };
      case 'LOW': return { variant: 'success' as const, text: 'Low Risk' };
      case 'NONE': return { variant: 'success' as const, text: 'Compliant' };
      default: return { variant: 'info' as const, text: 'Assess Needed' };
    }
  };

  const selectedSystem = HEATING_SYSTEMS.find(s => s.id === state.currentHeating);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={getProgress()} />
          <Text style={styles.stepIndicator}>Step 3 of 6</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Current heating system?</Text>
          <Text style={styles.subtitle}>
            This determines your savings potential and mandate timeline
          </Text>
        </View>

        {/* Heating Options */}
        <Text style={styles.sectionLabel}>Heating Type</Text>
        <View style={styles.options}>
          {HEATING_SYSTEMS.map((option) => {
            const badge = getRiskBadge(option.strandedAssetRisk);
            return (
              <SelectableCard
                key={option.id}
                title={option.label}
                description={option.mandateImpact}
                icon={iconMap[option.icon] || 'help-circle-outline'}
                selected={state.currentHeating === option.id}
                onPress={() => handleHeatingSelect(option.id)}
                style={styles.optionCard}
              />
            );
          })}
        </View>

        {/* Risk Assessment */}
        {selectedSystem && selectedSystem.strandedAssetRisk !== 'NONE' && (
          <Card variant="outlined" style={styles.riskCard}>
            <View style={styles.riskHeader}>
              <Ionicons 
                name="warning-outline" 
                size={20} 
                color={selectedSystem.strandedAssetRisk === 'VERY HIGH' ? THEME.colors.error : THEME.colors.warning} 
              />
              <Text style={styles.riskTitle}>Stranded Asset Risk</Text>
              <Badge 
                text={getRiskBadge(selectedSystem.strandedAssetRisk).text}
                variant={getRiskBadge(selectedSystem.strandedAssetRisk).variant}
              />
            </View>
            <Text style={styles.riskText}>
              Under Maryland's 2029 ZEHES mandate, this system must be replaced with a heat pump at end-of-life. Early conversion maximizes incentive capture.
            </Text>
          </Card>
        )}

        {/* System Age */}
        {showAgeSelect && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>System Age</Text>
            <View style={styles.ageOptions}>
              {SYSTEM_AGES.map((option) => (
                <SelectableCard
                  key={option.id}
                  title={option.label}
                  icon="time-outline"
                  selected={state.systemAge === option.id}
                  onPress={() => handleAgeSelect(option.id)}
                  style={styles.optionCard}
                />
              ))}
            </View>
          </>
        )}

        {/* Current Cost Estimate */}
        {selectedSystem && (
          <View style={styles.costEstimate}>
            <Text style={styles.costLabel}>Estimated current annual heating cost</Text>
            <Text style={styles.costValue}>
              ${selectedSystem.avgAnnualCost.toLocaleString()}/year
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!state.currentHeating || !state.systemAge}
          icon="arrow-forward"
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
    padding: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepIndicator: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.secondary,
    marginBottom: 12,
  },
  options: {
    marginBottom: 16,
  },
  ageOptions: {
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 10,
  },
  riskCard: {
    backgroundColor: '#fef3c7',
    borderColor: THEME.colors.warning,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  riskText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 18,
  },
  costEstimate: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  costLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
  },
  costValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.text.primary,
    marginTop: 4,
  },
  bottomCta: {
    padding: 24,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
});
