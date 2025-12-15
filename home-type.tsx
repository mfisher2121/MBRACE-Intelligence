// Calculator Step 2: Home Type
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, HOME_TYPES } from '../../lib/constants';
import { useCalculator } from '../../lib/store';
import { Button, ProgressBar, SelectableCard } from '../../components/ui';

export default function HomeTypeScreen() {
  const router = useRouter();
  const { state, setHomeType, setStep, getProgress } = useCalculator();

  const handleSelect = (homeType: string) => {
    setHomeType(homeType);
  };

  const handleContinue = () => {
    if (state.homeType) {
      setStep(3);
      router.push('/calculator/current-system');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Map icons
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'home': 'home-outline',
    'business': 'business-outline',
    'apartment': 'grid-outline',
    'domain': 'albums-outline',
  };

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
          <Text style={styles.stepIndicator}>Step 2 of 6</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What type of home?</Text>
          <Text style={styles.subtitle}>
            This helps us estimate installation costs and eligible incentives
          </Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {HOME_TYPES.map((option) => (
            <SelectableCard
              key={option.id}
              title={option.label}
              description={`Avg. ${option.avgSqFt.toLocaleString()} sq ft`}
              icon={iconMap[option.icon] || 'home-outline'}
              selected={state.homeType === option.id}
              onPress={() => handleSelect(option.id)}
              style={styles.optionCard}
            />
          ))}
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={16} color={THEME.colors.text.light} />
          <Text style={styles.infoNoteText}>
            Multi-family properties may qualify for additional commercial incentives
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!state.homeType}
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
    marginBottom: 32,
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
  options: {
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 12,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
  },
  infoNoteText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  bottomCta: {
    padding: 24,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
});
