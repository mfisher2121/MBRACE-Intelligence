// Calculator Step 1: Location (Zip Code)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../lib/constants';
import { validateZipCode, getStateFromZip, getUtilityFromZip } from '../../lib/calculator';
import { useCalculator } from '../../lib/store';
import { Button, Input, ProgressBar, Card } from '../../components/ui';

export default function LocationScreen() {
  const router = useRouter();
  const { state, setZipCode, setStep, getProgress } = useCalculator();
  const [localZip, setLocalZip] = useState(state.zipCode);
  const [error, setError] = useState<string | undefined>();
  const [detectedLocation, setDetectedLocation] = useState<{
    state: string;
    utility: string;
  } | null>(null);

  const handleZipChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/\D/g, '');
    setLocalZip(cleaned);
    setError(undefined);

    // Auto-detect location when 5 digits entered
    if (cleaned.length === 5) {
      const validation = validateZipCode(cleaned);
      if (validation.valid) {
        const detectedState = getStateFromZip(cleaned);
        const utility = getUtilityFromZip(cleaned);
        if (detectedState && utility) {
          setDetectedLocation({
            state: detectedState === 'MD' ? 'Maryland' : detectedState === 'DC' ? 'Washington DC' : 'Virginia',
            utility: utility.name,
          });
        }
      } else {
        setError(validation.error);
        setDetectedLocation(null);
      }
    } else {
      setDetectedLocation(null);
    }
  };

  const handleContinue = () => {
    const validation = validateZipCode(localZip);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setZipCode(localZip);
    setStep(2);
    router.push('/calculator/home-type');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={getProgress()} />
          <Text style={styles.stepIndicator}>Step 1 of 6</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Where is your home?</Text>
          <Text style={styles.subtitle}>
            We'll use this to calculate your state and utility rebates
          </Text>
        </View>

        {/* Zip Input */}
        <View style={styles.inputSection}>
          <Input
            label="ZIP Code"
            placeholder="Enter your 5-digit ZIP code"
            value={localZip}
            onChangeText={handleZipChange}
            keyboardType="numeric"
            maxLength={5}
            error={error}
            icon="location-outline"
          />

          {/* Location Detection */}
          {detectedLocation && (
            <Card variant="outlined" style={styles.detectionCard}>
              <View style={styles.detectionRow}>
                <Ionicons name="checkmark-circle" size={20} color={THEME.colors.success} />
                <View style={styles.detectionInfo}>
                  <Text style={styles.detectionLabel}>Detected Location</Text>
                  <Text style={styles.detectionValue}>
                    {detectedLocation.state} • {detectedLocation.utility}
                  </Text>
                </View>
              </View>
            </Card>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why we ask</Text>
          
          <Card variant="outlined" style={styles.infoCard}>
            <View style={styles.infoCardRow}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="business-outline" size={20} color={THEME.colors.secondary} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>State Programs</Text>
                <Text style={styles.infoCardText}>
                  Maryland, DC, and Virginia each have different rebate programs and mandates
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="outlined" style={styles.infoCard}>
            <View style={styles.infoCardRow}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="flash-outline" size={20} color={THEME.colors.secondary} />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Utility Rebates</Text>
                <Text style={styles.infoCardText}>
                  Your utility company (BGE, Pepco, Dominion, etc.) offers additional incentives
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Coverage Notice */}
        <View style={styles.coverageNotice}>
          <Ionicons name="information-circle-outline" size={16} color={THEME.colors.text.light} />
          <Text style={styles.coverageText}>
            Currently serving Maryland, Washington DC, and Northern Virginia
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={localZip.length !== 5 || !!error}
          icon="arrow-forward"
          size="large"
        />
      </View>
    </KeyboardAvoidingView>
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
  inputSection: {
    marginBottom: 32,
  },
  detectionCard: {
    marginTop: 16,
    backgroundColor: '#f0fdf4',
    borderColor: THEME.colors.success,
  },
  detectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detectionInfo: {
    marginLeft: 12,
  },
  detectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.secondary,
  },
  detectionValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginTop: 2,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.secondary,
    marginBottom: 12,
  },
  infoCard: {
    marginBottom: 12,
  },
  infoCardRow: {
    flexDirection: 'row',
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  infoCardText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
  coverageNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  coverageText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.light,
    marginLeft: 6,
  },
  bottomCta: {
    padding: 24,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
});
