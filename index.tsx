// Playbooks Hub - Resource Center
import React from 'react';
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
import { Card, Badge } from '../../components/ui';

interface PlaybookCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'error' | 'info';
  onPress: () => void;
}

function PlaybookCard({ 
  title, 
  subtitle, 
  description, 
  icon, 
  badge, 
  badgeVariant = 'info',
  onPress 
}: PlaybookCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity 
      style={styles.playbookCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.playbookCardHeader}>
        <View style={styles.playbookCardIcon}>
          <Ionicons name={icon} size={28} color={THEME.colors.primary} />
        </View>
        {badge && <Badge text={badge} variant={badgeVariant} />}
      </View>
      
      <Text style={styles.playbookCardTitle}>{title}</Text>
      <Text style={styles.playbookCardSubtitle}>{subtitle}</Text>
      <Text style={styles.playbookCardDescription}>{description}</Text>
      
      <View style={styles.playbookCardFooter}>
        <Text style={styles.playbookCardCta}>View Playbook</Text>
        <Ionicons name="arrow-forward" size={16} color={THEME.colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}

export default function PlaybooksScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#1a365d', '#0f172a']}
          style={styles.hero}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="book" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Funding Playbooks</Text>
          <Text style={styles.heroSubtitle}>
            Step-by-step guides to secure up to 100% coverage for heat pump installations
          </Text>
        </LinearGradient>

        {/* Intro */}
        <Card variant="outlined" style={styles.introCard}>
          <View style={styles.introRow}>
            <Ionicons name="bulb-outline" size={20} color={THEME.colors.secondary} />
            <Text style={styles.introText}>
              The key to "essentially free" installation is stacking state grants, utility rebates, 
              and federal funds (IRA/HEEHRA). These playbooks show you exactly how.
            </Text>
          </View>
        </Card>

        {/* Playbook Cards */}
        <Text style={styles.sectionTitle}>Select Your Playbook</Text>

        <PlaybookCard
          title="Nonprofit Organizations"
          subtitle="501(c)(3) Community-Serving Facilities"
          description="Churches, schools, clinics, community centers, shelters, and arts centers. Target MEA ECB + EEE grants for maximum coverage."
          icon="heart-outline"
          badge="Up to 100%"
          badgeVariant="success"
          onPress={() => router.push('/playbooks/nonprofit')}
        />

        <PlaybookCard
          title="Low-Income Housing"
          subtitle="Owners & Operators of Affordable Housing"
          description="1-4 unit and 5+ unit multifamily buildings serving residents at <80% AMI. Access DHCD/MEEHA and IRA HEEHR programs."
          icon="home-outline"
          badge="Up to 100%"
          badgeVariant="success"
          onPress={() => router.push('/playbooks/low-income')}
        />

        <PlaybookCard
          title="HVAC Contractors"
          subtitle="DMV Contractor Resource Hub"
          description="Training resources, certification pathways, brand guidance, and the operational pivot playbook for the heat pump transition."
          icon="construct-outline"
          badge="Strategic"
          badgeVariant="info"
          onPress={() => router.push('/playbooks/contractor')}
        />

        {/* Program Overview */}
        <Text style={styles.sectionTitle}>Key Programs</Text>
        
        <Card variant="outlined" style={styles.programCard}>
          <View style={styles.programHeader}>
            <Text style={styles.programState}>Maryland</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>MEA ECB Grant</Text>
            <Text style={styles.programDesc}>Electrifying Community Buildings - Heat pumps, HPWH, panel upgrades</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>MEA EEE Grant</Text>
            <Text style={styles.programDesc}>Energy Efficiency Equity - Insulation, air sealing for LMI facilities</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>EmPOWER Maryland</Text>
            <Text style={styles.programDesc}>Utility incentives for commercial/C&I/SMB and low-income residential</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>DHCD MEEHA</Text>
            <Text style={styles.programDesc}>Multifamily energy programs - 50-100% coverage for eligible buildings</Text>
          </View>
        </Card>

        <Card variant="outlined" style={styles.programCard}>
          <View style={styles.programHeader}>
            <Text style={styles.programState}>Virginia</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>HEEHRA Program</Text>
            <Text style={styles.programDesc}>100% installation coverage for low-income, 50% (up to $4K) for moderate</Text>
          </View>
        </Card>

        <Card variant="outlined" style={styles.programCard}>
          <View style={styles.programHeader}>
            <Text style={styles.programState}>Federal</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>IRA HEEHR/HOMES</Text>
            <Text style={styles.programDesc}>Up to ~$14,000 per project for eligible heat pump and efficiency measures</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>IRA 25C Tax Credit</Text>
            <Text style={styles.programDesc}>Up to $2,000 for qualifying heat pump installations through 2032</Text>
          </View>
        </Card>

        {/* Bottom CTA */}
        <Card variant="elevated" style={styles.ctaCard}>
          <Ionicons name="help-circle-outline" size={32} color={THEME.colors.secondary} />
          <Text style={styles.ctaTitle}>Not sure which applies to you?</Text>
          <Text style={styles.ctaText}>
            Use our calculator to determine your eligibility and see exactly which programs you qualify for.
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/calculator/location')}
          >
            <Text style={styles.ctaButtonText}>Calculate My Eligibility</Text>
            <Ionicons name="arrow-forward" size={16} color={THEME.colors.secondary} />
          </TouchableOpacity>
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
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    marginTop: 8,
    lineHeight: 20,
  },
  introCard: {
    marginBottom: 24,
    backgroundColor: '#f0fdfa',
    borderColor: THEME.colors.secondary,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  introText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 12,
  },
  playbookCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  playbookCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  playbookCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbookCardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.text.primary,
  },
  playbookCardSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.secondary,
    marginTop: 2,
  },
  playbookCardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 8,
    lineHeight: 20,
  },
  playbookCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  playbookCardCta: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.secondary,
    marginRight: 4,
  },
  programCard: {
    marginBottom: 12,
  },
  programHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  programState: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.primary,
  },
  programItem: {
    marginBottom: 10,
  },
  programName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
  },
  programDesc: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  ctaCard: {
    alignItems: 'center',
    marginTop: 16,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginTop: 12,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.secondary,
    marginRight: 6,
  },
});
