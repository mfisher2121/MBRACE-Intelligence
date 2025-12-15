// Reusable UI Components
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEME } from '../lib/constants';

// ============================================
// BUTTON
// ============================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  style,
}: ButtonProps) {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 14, paddingHorizontal: 24 },
    large: { paddingVertical: 18, paddingHorizontal: 32 },
  };

  const textSizes = {
    small: 14,
    medium: 16,
    large: 18,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={disabled ? ['#94a3b8', '#94a3b8'] : ['#0d9488', '#0f766e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.buttonBase,
            sizeStyles[size],
            disabled && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              {icon && iconPosition === 'left' && (
                <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
              <Text style={[styles.buttonTextPrimary, { fontSize: textSizes[size] }]}>
                {title}
              </Text>
              {icon && iconPosition === 'right' && (
                <Ionicons name={icon} size={20} color="#fff" style={{ marginLeft: 8 }} />
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    secondary: {
      container: { backgroundColor: THEME.colors.primary },
      text: { color: '#fff' },
    },
    outline: {
      container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: THEME.colors.secondary },
      text: { color: THEME.colors.secondary },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: THEME.colors.secondary },
    },
  };

  const currentStyle = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.buttonBase,
        sizeStyles[size],
        currentStyle.container,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentStyle.text.color} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={20} color={currentStyle.text.color} style={{ marginRight: 8 }} />
          )}
          <Text style={[styles.buttonText, currentStyle.text, { fontSize: textSizes[size] }]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={20} color={currentStyle.text.color} style={{ marginLeft: 8 }} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ============================================
// CARD
// ============================================

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const variantStyles = {
    default: styles.cardDefault,
    elevated: styles.cardElevated,
    outlined: styles.cardOutlined,
  };

  return (
    <View style={[styles.cardBase, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

// ============================================
// SELECTABLE CARD
// ============================================

interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function SelectableCard({
  title,
  description,
  icon,
  selected = false,
  onPress,
  style,
}: SelectableCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.selectableCard,
        selected && styles.selectableCardSelected,
        style,
      ]}
    >
      <View style={styles.selectableCardContent}>
        {icon && (
          <View style={[styles.selectableCardIcon, selected && styles.selectableCardIconSelected]}>
            <Ionicons
              name={icon}
              size={24}
              color={selected ? '#fff' : THEME.colors.secondary}
            />
          </View>
        )}
        <View style={styles.selectableCardText}>
          <Text style={[styles.selectableCardTitle, selected && styles.selectableCardTitleSelected]}>
            {title}
          </Text>
          {description && (
            <Text style={styles.selectableCardDescription}>{description}</Text>
          )}
        </View>
      </View>
      <View style={[styles.selectableCardRadio, selected && styles.selectableCardRadioSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
}

// ============================================
// INPUT
// ============================================

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  helper?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  maxLength?: number;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  helper,
  icon,
  style,
  maxLength,
}: InputProps) {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={THEME.colors.text.secondary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.text.light}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
      {helper && !error && <Text style={styles.inputHelper}>{helper}</Text>}
    </View>
  );
}

// ============================================
// PROGRESS BAR
// ============================================

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({ progress, height = 8, showLabel = false, style }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={style}>
      <View style={[styles.progressBarContainer, { height }]}>
        <LinearGradient
          colors={['#0d9488', '#0f766e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressBarFill,
            { width: `${clampedProgress}%`, height },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.progressBarLabel}>{Math.round(clampedProgress)}% complete</Text>
      )}
    </View>
  );
}

// ============================================
// SECTION HEADER
// ============================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionHeader({ title, subtitle, style }: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionHeaderSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: ViewStyle;
}

export function StatCard({ label, value, icon, color = THEME.colors.secondary, style }: StatCardProps) {
  return (
    <View style={[styles.statCard, style]}>
      {icon && (
        <Ionicons name={icon} size={24} color={color} style={styles.statCardIcon} />
      )}
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </View>
  );
}

// ============================================
// DIVIDER
// ============================================

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

// ============================================
// BADGE
// ============================================

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export function Badge({ text, variant = 'info', style }: BadgeProps) {
  const variantStyles = {
    success: { bg: '#dcfce7', text: '#166534' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    error: { bg: '#fee2e2', text: '#991b1b' },
    info: { bg: '#e0f2fe', text: '#075985' },
  };

  const colors = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{text}</Text>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Button
  buttonBase: {
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextPrimary: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
  },

  // Card
  cardBase: {
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
  },
  cardDefault: {
    backgroundColor: THEME.colors.surface,
  },
  cardElevated: {
    backgroundColor: THEME.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardOutlined: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },

  // Selectable Card
  selectableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 2,
    borderColor: THEME.colors.border,
  },
  selectableCardSelected: {
    borderColor: THEME.colors.secondary,
    backgroundColor: '#f0fdfa',
  },
  selectableCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectableCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  selectableCardIconSelected: {
    backgroundColor: THEME.colors.secondary,
  },
  selectableCardText: {
    flex: 1,
  },
  selectableCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  selectableCardTitleSelected: {
    color: THEME.colors.secondary,
  },
  selectableCardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  selectableCardRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectableCardRadioSelected: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
  },

  // Input
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  inputWrapperError: {
    borderColor: THEME.colors.error,
  },
  inputIcon: {
    marginLeft: THEME.spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
  },
  inputWithIcon: {
    paddingLeft: THEME.spacing.sm,
  },
  inputError: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.error,
    marginTop: THEME.spacing.xs,
  },
  inputHelper: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.xs,
  },

  // Progress Bar
  progressBarContainer: {
    backgroundColor: THEME.colors.border,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    borderRadius: 100,
  },
  progressBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: THEME.spacing.xs,
  },

  // Section Header
  sectionHeader: {
    marginBottom: THEME.spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.text.primary,
  },
  sectionHeaderSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.xs,
  },

  // Stat Card
  statCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    alignItems: 'center',
    flex: 1,
  },
  statCardIcon: {
    marginBottom: THEME.spacing.xs,
  },
  statCardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  statCardLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.md,
  },

  // Badge
  badge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});
