// Contractor Playbook - Resources for HVAC Contractors
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEME, HEAT_PUMP_BRANDS } from '../../lib/constants';
import { Card, Badge, Button, Divider } from '../../components/ui';

interface ResourceSection {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: {
    title: string;
    description: string;
    action?: string;
    link?: string;
  }[];
}

const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    title: 'Training & Certification',
    icon: 'school-outline',
    items: [
      {
        title: 'NATE Heat Pump Certification',
        description: 'Industry-recognized certification for heat pump installation and service',
        action: 'Learn More',
        link: 'https://www.natex.org',
      },
      {
        title: 'Manufacturer Training',
        description: 'Mitsubishi Diamond Contractor, Daikin Comfort Pro, Carrier Factory Authorized',
        action: 'Contact Distributors',
      },
      {
        title: 'Maryland Clean Energy Jobs Act Grants',
        description: 'State funding for apprenticeship and pre-apprenticeship programs',
        action: 'View Programs',
      },
      {
        title: 'MEA Workforce Development',
        description: 'Up to $1,500/person for BPI and electrification certifications',
        action: 'Apply Now',
      },
    ],
  },
  {
    title: 'Manufacturer Partnerships',
    icon: 'business-outline',
    items: [
      {
        title: 'Heat Pump Specialist Lines',
        description: 'Mitsubishi, Daikin, Fujitsu - cold-climate leaders with dealer programs',
        action: 'View Brands',
      },
      {
        title: 'Hybrid Strategy',
        description: 'Maintain legacy relationships while adding heat pump specialist lines',
        action: 'Read Guide',
      },
      {
        title: 'Distributor Network',
        description: 'Ferguson, Winsupply, local distributors with heat pump inventory',
        action: 'Find Distributors',
      },
    ],
  },
  {
    title: 'Marketing for AI Search',
    icon: 'search-outline',
    items: [
      {
        title: 'Content Clusters',
        description: 'Build heat pump-specific pages for each service area and topic',
        action: 'View Strategy',
      },
      {
        title: 'Agent Experience (AX)',
        description: 'Structure content for AI parsing with clear entities and relationships',
        action: 'Learn More',
      },
      {
        title: 'Heat Pump-Specific Reviews',
        description: 'Build authority with targeted review generation campaigns',
        action: 'View Template',
      },
      {
        title: 'Calculator Lead Generation',
        description: 'Interactive tools convert 18-32% of visitors to consultations',
        action: 'Get Started',
      },
    ],
  },
  {
    title: 'Operational Excellence',
    icon: 'settings-outline',
    items: [
      {
        title: 'Manual J/S/D Training',
        description: 'Replace rule-of-thumb sizing with proper load calculations',
        action: 'Find Training',
      },
      {
        title: 'Jurisdiction Permit Playbooks',
        description: 'Document requirements for Montgomery, Fairfax, DC, and each county',
        action: 'Download Template',
      },
      {
        title: 'Customer Education Checklist',
        description: 'Eliminate callbacks by explaining defrost cycles and normal operation',
        action: 'Get Checklist',
      },
      {
        title: 'Commissioning Protocols',
        description: 'Refrigerant charging (+/- 5%), controls setup, documentation',
        action: 'View Standards',
      },
    ],
  },
];

const SKILLS_COMPARISON = [
  {
    area: 'System Concept',
    old: 'Separate heating & cooling systems',
    new: 'Integrated system for both; mistakes affect year-round comfort',
  },
  {
    area: 'Design & Sizing',
    old: 'Rule of thumb (400 sq ft/ton)',
    new: 'Manual J/S/D load calculations required',
  },
  {
    area: 'Building Science',
    old: 'Gas furnaces can brute-force through poor envelopes',
    new: 'Extremely sensitive to insulation and ductwork',
  },
  {
    area: 'Installation',
    old: 'Basic install, +/- 10% refrigerant acceptable',
    new: 'Precise charging (+/- 5%), advanced controls',
  },
  {
    area: 'Troubleshooting',
    old: 'Component failures obvious (bad igniter, gas valve)',
    new: 'Complex systemic issues; root cause can be multiple factors',
  },
];

export default function ContractorPlaybookScreen() {
  const router = useRouter();

  const handlePress = (item: { link?: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.link) {
      Linking.openURL(item.link);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Badge text="Competitive Edge" variant="info" />
          <Text style={styles.title}>Contractor Resources</Text>
          <Text style={styles.subtitle}>
            Everything you need to dominate the DMV heat pump transition before PE-backed competitors
          </Text>
        </View>

        {/* The Opportunity */}
        <Card variant="elevated" style={styles.opportunityCard}>
          <View style={styles.opportunityHeader}>
            <Ionicons name="trending-up" size={24} color={THEME.colors.secondary} />
            <Text style={styles.opportunityTitle}>The 5-Year Window</Text>
          </View>
          <Text style={styles.opportunityText}>
            Contractors who pivot NOW (2025-2027) will have 3 years of heat pump reviews, established rebate expertise, and AI citation authority by 2028.
          </Text>
          <Text style={styles.opportunityText}>
            Those who wait until 2028 will be scrambling for certifications while competing against established players.
          </Text>
        </Card>

        {/* Skills Gap */}
        <Text style={styles.sectionLabel}>The Skills Gap</Text>
        <Card variant="outlined" style={styles.skillsCard}>
          <Text style={styles.skillsIntro}>
            Why furnace experts struggle with heat pumps:
          </Text>
          {SKILLS_COMPARISON.map((skill, index) => (
            <View key={index} style={[
              styles.skillRow,
              index < SKILLS_COMPARISON.length - 1 && styles.skillRowBorder
            ]}>
              <Text style={styles.skillArea}>{skill.area}</Text>
              <View style={styles.skillComparison}>
                <View style={styles.skillOld}>
                  <Text style={styles.skillOldLabel}>Old Model</Text>
                  <Text style={styles.skillOldText}>{skill.old}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={THEME.colors.text.light} style={styles.skillArrow} />
                <View style={styles.skillNew}>
                  <Text style={styles.skillNewLabel}>Heat Pump Reality</Text>
                  <Text style={styles.skillNewText}>{skill.new}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Brand Tiers */}
        <Text style={styles.sectionLabel}>Heat Pump Brand Landscape</Text>
        <Card variant="outlined" style={styles.brandsCard}>
          <Text style={styles.brandTierLabel}>Premium Cold-Climate Lines</Text>
          <Text style={styles.brandTierDescription}>
            Consistently top-ranked for reliability and low-temperature performance
          </Text>
          <View style={styles.brandList}>
            {HEAT_PUMP_BRANDS.premiumColdClimate.map((brand, index) => (
              <View key={index} style={styles.brandItem}>
                <Ionicons name="checkmark-circle" size={16} color={THEME.colors.success} />
                <Text style={styles.brandName}>{brand.name}</Text>
                <Text style={styles.brandRating}>{brand.rating}</Text>
              </View>
            ))}
          </View>

          <Divider style={{ marginVertical: 16 }} />

          <Text style={styles.brandTierLabel}>Mid-Tier / Value Brands</Text>
          <Text style={styles.brandTierDescription}>
            Perform well but outcomes more dependent on installation quality
          </Text>
          <View style={styles.brandList}>
            {HEAT_PUMP_BRANDS.midTierValue.map((brand, index) => (
              <View key={index} style={styles.brandItem}>
                <Ionicons name="ellipse" size={16} color={THEME.colors.warning} />
                <Text style={styles.brandName}>{brand.name}</Text>
                <Text style={styles.brandRating}>{brand.rating}</Text>
              </View>
            ))}
          </View>

          <View style={styles.brandNote}>
            <Ionicons name="information-circle" size={16} color={THEME.colors.secondary} />
            <Text style={styles.brandNoteText}>
              A top-tier brand installed poorly is a liability. A mid-tier brand installed flawlessly is a high-margin asset.
            </Text>
          </View>
        </Card>

        {/* Resource Sections */}
        {RESOURCE_SECTIONS.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <Card variant="outlined" style={styles.resourceCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.resourceItem,
                    itemIndex < section.items.length - 1 && styles.resourceItemBorder
                  ]}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    <Text style={styles.resourceDescription}>{item.description}</Text>
                  </View>
                  {item.action && (
                    <View style={styles.resourceAction}>
                      <Text style={styles.resourceActionText}>{item.action}</Text>
                      <Ionicons name="chevron-forward" size={16} color={THEME.colors.secondary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* PE Threat Warning */}
        <Card variant="outlined" style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning" size={24} color={THEME.colors.error} />
            <Text style={styles.warningTitle}>The PE Consolidation Threat</Text>
          </View>
          <Text style={styles.warningText}>
            Large PE-backed aggregators like F.H. Furr and Michael & Son are acquisition machines. They're not winning because they're better at the trade—they're winning because they've built superior systems for customer acquisition, follow-up, and operational efficiency.
          </Text>
          <Text style={styles.warningText}>
            When the AI provides one answer to "Who's the best heat pump installer in Bethesda?", will it be you or them?
          </Text>
        </Card>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Partner With MBRACE"
            onPress={() => router.push('/consultation')}
            size="large"
            icon="arrow-forward"
          />
          <Text style={styles.ctaSubtext}>
            Get qualified leads and market intelligence for your territory
          </Text>
        </View>

        {/* Bottom Padding */}
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
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: THEME.colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 24,
  },
  opportunityCard: {
    marginBottom: 24,
    backgroundColor: '#f0fdfa',
  },
  opportunityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  opportunityTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginLeft: 8,
  },
  opportunityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    lineHeight: 22,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.secondary,
    marginBottom: 12,
    marginTop: 8,
  },
  skillsCard: {
    marginBottom: 24,
  },
  skillsIntro: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.primary,
    marginBottom: 16,
  },
  skillRow: {
    paddingVertical: 12,
  },
  skillRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  skillArea: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.primary,
    marginBottom: 8,
  },
  skillComparison: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skillOld: {
    flex: 1,
  },
  skillOldLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.error,
    marginBottom: 2,
  },
  skillOldText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 16,
  },
  skillArrow: {
    marginHorizontal: 8,
    marginTop: 8,
  },
  skillNew: {
    flex: 1,
  },
  skillNewLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.success,
    marginBottom: 2,
  },
  skillNewText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    lineHeight: 16,
  },
  brandsCard: {
    marginBottom: 24,
  },
  brandTierLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  brandTierDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginBottom: 12,
  },
  brandList: {
    gap: 8,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  brandName: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  brandRating: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
  },
  brandNote: {
    flexDirection: 'row',
    backgroundColor: '#f0fdfa',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  brandNoteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  resourceCard: {
    marginBottom: 16,
  },
  resourceItem: {
    paddingVertical: 12,
  },
  resourceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  resourceContent: {
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    lineHeight: 18,
  },
  resourceAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceActionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: THEME.colors.secondary,
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderColor: THEME.colors.error,
    marginBottom: 24,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.colors.text.primary,
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.primary,
    lineHeight: 22,
    marginBottom: 8,
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaSubtext: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: THEME.colors.text.secondary,
    marginTop: 12,
    textAlign: 'center',
  },
});
