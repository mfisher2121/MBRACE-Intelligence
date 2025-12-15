// Calculator Step 5: Contact Information (Lead Capture Gate)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../lib/constants';
import { useCalculator } from '../../lib/store';
import { calculateRebates, validateEmail, validatePhone, formatCurrency } from '../../lib/calculator';
import { saveLead } from '../../lib/firebase';
import { Button, ProgressBar, Input, Card } from '../../components/ui';

export default function ContactScreen() {
  const router = useRouter();
  const { 
    state, 
    setContact, 
    setResults, 
    setLeadId, 
    setStep, 
    getProgress,
    getCalculatorInput 
  } = useCalculator();
  
  const [email, setEmail] = useState(state.contact.email);
  const [phone, setPhone] = useState(state.contact.phone);
  const [smsOptIn, setSmsOptIn] = useState(state.contact.smsOptIn);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Pre-calculate results for preview
  const previewResults = calculateRebates(getCalculatorInput());

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setErrors(prev => ({ ...prev, email: undefined }));
  };

  const handlePhoneChange = (text: string) => {
    // Format phone number
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      if (cleaned.length <= 3) {
        formatted = `(${cleaned}`;
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
    }
    setPhone(formatted);
    setErrors(prev => ({ ...prev, phone: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; phone?: string } = {};
    
    // Require at least email OR phone
    const hasEmail = email.trim().length > 0;
    const hasPhone = phone.replace(/\D/g, '').length > 0;
    
    if (!hasEmail && !hasPhone) {
      newErrors.email = 'Please enter your email or phone number';
      setErrors(newErrors);
      return false;
    }
    
    if (hasEmail && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (hasPhone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Calculate final results
      const results = calculateRebates(getCalculatorInput());
      
      // Update state
      setContact({ email, phone, smsOptIn });
      setResults(results);
      
      // Save lead to Firebase
      const leadId = await saveLead({
        email,
        phone: phone.replace(/\D/g, ''),
        smsOptIn,
        zipCode: state.zipCode,
        homeType: state.homeType,
        homeSqFt: state.homeSqFt,
        currentHeating: state.currentHeating,
        systemAge: state.systemAge,
        incomeBracket: state.incomeBracket,
        calculatedResults: results,
        source: 'ios-app',
        utmSource: state.utmSource,
        utmMedium: state.utmMedium,
        utmCampaign: state.utmCampaign,
        contractorId: state.contractorId,
        userType: state.userType,
      });
      
      setLeadId(leadId);
      setStep(6);
      
      // Navigate to results
      router.push('/calculator/results');
    } catch (error) {
      console.error('Error saving lead:', error);
      // Still show results even if save fails
      const results = calculateRebates(getCalculatorInput());
      setResults(results);
      setStep(6);
      router.push('/calculator/results');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.stepIndicator}>Step 5 of 6</Text>
        </View>

        {/* Incentive Preview - The Hook */}
        <Card variant="elevated" style={styles.previewCard}>
          <Text style={styles.previewLabel}>Your Estimated Total Incentives</Text>
          <Text style={styles.previewValue}>
            {formatCurrency(previewResults.totalIncentives)}
          </Text>
          <View style={styles.previewBreakdown}>
            <View style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>State</Text>
              <Text style={styles.previewItemValue}>
                {formatCurrency(previewResults.incentiveBreakdown.state)}
              </Text>
            </View>
            <View style={styles.previewDivider} />
            <View style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>Utility</Text>
              <Text style={styles.previewItemValue}>
                {formatCurrency(previewResults.incentiveBreakdown.utility)}
              </Text>
            </View>
            <View style={styles.previewDivider} />
            <View style={styles.previewItem}>
              <Text style={styles.previewItemLabel}>Federal</Text>
              <Text style={styles.previewItemValue}>
                {formatCurrency(previewResults.incentiveBreakdown.federal)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Almost there!</Text>
          <Text style={styles.subtitle}>
            Enter your contact info to see your complete savings report
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon="mail-outline"
          />

          <Input
            label="Phone Number (optional)"
            placeholder="(555) 123-4567"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            error={errors.phone}
            icon="call-outline"
            helper="For rebate updates and contractor matching"
          />

          {/* SMS Opt-in */}
          <View style={styles.smsOptIn}>
            <View style={styles.smsOptInContent}>
              <Ionicons name="chatbubble-outline" size={20} color={THEME.colors.text.secondary} />
              <Text style={styles.smsOptInText}>
                Send me SMS updates about rebate changes and limited-time incentives
              </Text>
            </View>
            <Switch
              value={smsOptIn}
              onValueChange={setSmsOptIn}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.secondary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* What You'll Get */}
        <View style={styles.benefitsList}>
          <Text style={styles.benefitsTitle}>Your report includes:</Text>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={THEME.colors.success} />
            <Text style={styles.benefitText}>Complete incentive breakdown by program</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={THEME.colors.success} />
            <Text style={styles.benefitText}>10-year savings projection</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={THEME.colors.success} />
            <Text style={styles.benefitText}>Mandate timeline for your location</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={THEME.colors.success} />
            <Text style={styles.benefitText}>Next steps to claim your rebates</Text>
          </View>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={14} color={THEME.colors.text.light} />
          <Text style={styles.privacyText}>
            We respect your privacy. Your information is never sold or shared.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="See My Savings Report"
          onPress={handleSubmit}
          disabled={isLoading}
          loading={isLoading}
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
  previewCard: {
    backgroundColor: THEME.colors.primary,
    marginBottom: 24,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  previewValue: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginVertical: 8,
  },
  previewBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  previewItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  previewItemLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.6)',
  },
  previewItemValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginTop: 2,
  },
  previewDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  form: {
    marginBottom: 24,
  },
  smsOptIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  smsOptInContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  smsOptInText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  benefitsList: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.secondary,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 10,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  privacyText: {
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
