// Calculator Step 4: Income Bracket (Incentive Eligibility)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, INCOME_BRACKETS } from '../../lib/constants';
import { useCalculator } from '../../lib/store';
import { Button, ProgressBar, SelectableCard, Card } from '../../components/ui';

export default function IncomeScreen() {
  const router = useRouter();
  const { state, setIncomeBracket, setStep, getProgress } = useCalculator();

  const handleSelect = (bracket: string) => {
    setIncomeBracket(bracket);
  };

  const handleContinue = () => {
    if (state.incomeBracket) {
      setStep(5);
      router.push('/calculator/contact');
    }
  };

  const selectedBracket = INCOME_BRACKETS.find(b => b.id === state.incomeBracket);

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
          <Text style={styles.stepIndicator}>Step 4 of 6</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Household income range</Text>
          <Text style={styles.subtitle}>
            This determines your eligibility for income-based rebate programs
          </Text>
        </View>

        {/* Privacy Note */}
        <Card variant="outlined" style={styles.privacyNote}>
          <View style={styles.privacyRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={THEME.colors.secondary} />
            <Text style={styles.privacyText}>
              This information is only used to calculate incentives. We never share your data.
            </Text>
          </View>
        </Card>

        {/* Options */}
        <View style={styles.options}>
          {INCOME_BRACKETS.map((option) => (
            <SelectableCard
              key={option.id}
              title={option.label}
              description={option.description}
              icon="wallet-outline"
              selected={state.incomeBracket === option.id}
              onPress={() => handleSelect(option.id)}
              style={styles.optionCard}
            />
          ))}
        </View>

        {/* Incentive Preview */}
        {selectedBracket && (
          <Card variant="elevated" style={styles.incentivePreview}>
            <Text style={styles.incentivePreviewTitle}>Estimated State Rebate</Text>
            <Text style={styles.incentivePreviewValue}>
              ${selectedBracket.meaRebate.toLocaleString()}
            </Text>
            <Text style={styles.incentivePreviewNote}>
              + Federal tax credits + Utility rebates
            </Text>
            
            {selectedBracket.heehraCoverage > 0 && (
              <View style={styles.heehraNote}>
                <Ionicons name="star" size={16} color={THEME.colors.warning} />
                <Text style={styles.heehraText}>
                  Virginia HEEHRA: {selectedBracket.heehraCoverage}% cost coverage available
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={16} color={THEME.colors.text.light} />
          <Text style={styles.infoNoteText}>
            Income eligibility varies by household size and location. Final eligibility determined at application.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!state.incomeBracket}
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
    marginBottom: 16,
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
  privacyNote: {
    marginBottom: 24,
    backgroundColor: '#f0fdfa',
    borderColor: THEME.colors.secondary,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  options: {
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 10,
  },
  incentivePreview: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: THEME.colors.primary,
  },
  incentivePreviewTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  incentivePreviewValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginVertical: 8,
  },
  incentivePreviewNote: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  heehraNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  heehraText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginLeft: 6,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoNoteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.light,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  bottomCta: {
    padding: 24,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
});
