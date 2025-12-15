// Consultation Booking Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEME } from '../lib/constants';
import { useCalculator } from '../lib/store';
import { submitConsultationRequest } from '../lib/firebase';
import { validateEmail, validatePhone } from '../lib/calculator';
import { Button, Input, Card } from '../components/ui';

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '9am - 12pm' },
  { id: 'afternoon', label: 'Afternoon', time: '12pm - 5pm' },
  { id: 'evening', label: 'Evening', time: '5pm - 7pm' },
];

const CONSULTATION_TYPES = [
  {
    id: 'homeowner',
    title: 'Homeowner Consultation',
    description: 'Discuss your heat pump options, rebates, and get a custom savings estimate',
    duration: '30 minutes',
    icon: 'home-outline',
  },
  {
    id: 'contractor',
    title: 'Contractor Partnership',
    description: 'Learn about lead generation, market intelligence, and partnership opportunities',
    duration: '45 minutes',
    icon: 'construct-outline',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Analysis',
    description: 'Review electrification risk and incentive opportunities across your assets',
    duration: '60 minutes',
    icon: 'analytics-outline',
  },
];

export default function ConsultationScreen() {
  const router = useRouter();
  const { state } = useCalculator();
  
  const [consultationType, setConsultationType] = useState('homeowner');
  const [email, setEmail] = useState(state.contact.email);
  const [phone, setPhone] = useState(state.contact.phone);
  const [name, setName] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (text: string) => {
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
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    if (!email.trim() && !phone.trim()) {
      newErrors.email = 'Please enter email or phone';
    }
    
    if (email.trim() && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (phone.trim() && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await submitConsultationRequest({
        leadId: state.leadId || undefined,
        email,
        phone: phone.replace(/\D/g, ''),
        preferredTime,
        notes: `Type: ${consultationType}\n${notes}`,
        source: 'ios-app',
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting consultation:', error);
      Alert.alert(
        'Error',
        'Unable to submit your request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={THEME.colors.success} />
          </View>
          <Text style={styles.successTitle}>Request Submitted!</Text>
          <Text style={styles.successText}>
            We'll reach out within 24 hours to schedule your consultation.
          </Text>
          
          <View style={styles.successDetails}>
            <View style={styles.successDetailItem}>
              <Ionicons name="person-outline" size={20} color={THEME.colors.text.secondary} />
              <Text style={styles.successDetailText}>{name}</Text>
            </View>
            <View style={styles.successDetailItem}>
              <Ionicons name="mail-outline" size={20} color={THEME.colors.text.secondary} />
              <Text style={styles.successDetailText}>{email || phone}</Text>
            </View>
            {preferredTime && (
              <View style={styles.successDetailItem}>
                <Ionicons name="time-outline" size={20} color={THEME.colors.text.secondary} />
                <Text style={styles.successDetailText}>
                  Preferred: {TIME_SLOTS.find(t => t.id === preferredTime)?.label}
                </Text>
              </View>
            )}
          </View>
          
          <Button
            title="Back to Home"
            onPress={() => router.replace('/')}
            variant="outline"
            style={{ marginTop: 32 }}
          />
        </View>
      </View>
    );
  }

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Book a Consultation</Text>
          <Text style={styles.subtitle}>
            Get expert guidance on heat pump options, incentives, and next steps
          </Text>
        </View>

        {/* Consultation Types */}
        <Text style={styles.sectionLabel}>What can we help with?</Text>
        {CONSULTATION_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              consultationType === type.id && styles.typeCardSelected
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setConsultationType(type.id);
            }}
            activeOpacity={0.7}
          >
            <View style={[
              styles.typeIcon,
              consultationType === type.id && styles.typeIconSelected
            ]}>
              <Ionicons 
                name={type.icon as any} 
                size={24} 
                color={consultationType === type.id ? '#fff' : THEME.colors.primary} 
              />
            </View>
            <View style={styles.typeContent}>
              <Text style={[
                styles.typeTitle,
                consultationType === type.id && styles.typeTitleSelected
              ]}>
                {type.title}
              </Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
              <Text style={styles.typeDuration}>{type.duration}</Text>
            </View>
            <View style={[
              styles.typeRadio,
              consultationType === type.id && styles.typeRadioSelected
            ]}>
              {consultationType === type.id && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Contact Form */}
        <Text style={styles.sectionLabel}>Your Information</Text>
        
        <Input
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors(prev => ({ ...prev, name: '' }));
          }}
          error={errors.name}
          icon="person-outline"
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          icon="mail-outline"
        />

        <Input
          label="Phone (optional)"
          placeholder="(555) 123-4567"
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          error={errors.phone}
          icon="call-outline"
        />

        {/* Preferred Time */}
        <Text style={styles.sectionLabel}>Preferred Time (optional)</Text>
        <View style={styles.timeSlots}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlot,
                preferredTime === slot.id && styles.timeSlotSelected
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPreferredTime(preferredTime === slot.id ? '' : slot.id);
              }}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.timeSlotLabel,
                preferredTime === slot.id && styles.timeSlotLabelSelected
              ]}>
                {slot.label}
              </Text>
              <Text style={[
                styles.timeSlotTime,
                preferredTime === slot.id && styles.timeSlotTimeSelected
              ]}>
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Input
          label="Additional Notes (optional)"
          placeholder="Tell us about your situation..."
          value={notes}
          onChangeText={setNotes}
          icon="document-text-outline"
        />

        {/* Trust Signals */}
        <View style={styles.trustSignals}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark-outline" size={18} color={THEME.colors.success} />
            <Text style={styles.trustText}>No obligation</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="time-outline" size={18} color={THEME.colors.success} />
            <Text style={styles.trustText}>Response within 24h</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed-outline" size={18} color={THEME.colors.success} />
            <Text style={styles.trustText}>Privacy protected</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <Button
          title="Request Consultation"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          size="large"
          icon="send-outline"
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
    paddingBottom: 40,
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
    marginTop: 8,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: THEME.colors.border,
  },
  typeCardSelected: {
    borderColor: THEME.colors.secondary,
    backgroundColor: '#f0fdfa',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIconSelected: {
    backgroundColor: THEME.colors.secondary,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  typeTitleSelected: {
    color: THEME.colors.secondary,
  },
  typeDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 18,
  },
  typeDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.light,
    marginTop: 4,
  },
  typeRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  typeRadioSelected: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
  },
  timeSlots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.border,
  },
  timeSlotSelected: {
    borderColor: THEME.colors.secondary,
    backgroundColor: '#f0fdfa',
  },
  timeSlotLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  timeSlotLabelSelected: {
    color: THEME.colors.secondary,
  },
  timeSlotTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  timeSlotTimeSelected: {
    color: THEME.colors.secondary,
  },
  trustSignals: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.secondary,
    marginLeft: 4,
  },
  bottomCta: {
    padding: 24,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  // Success State
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.text.primary,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  successDetails: {
    marginTop: 32,
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  successDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  successDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 12,
  },
});
