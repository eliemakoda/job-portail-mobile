import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

const JobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return formatter.format(min || max);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleApply = async () => {
    try {
      if (job.job_url_direct) {
        await Linking.openURL(job.job_url_direct);
      } else if (job.job_url) {
        await Linking.openURL(job.job_url);
      } else {
        Alert.alert('Application Link', 'No application link available for this job.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open application link.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job opportunity: ${job.title} at ${job.company}\n${job.job_url || 'No link available'}`,
        title: `${job.title} - ${job.company}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Job Removed' : 'Job Saved',
      isSaved ? 'Job removed from your saved list.' : 'Job saved to your list!'
    );
  };

 const parseDescription = (description) => {
  if (!description) return [];
  const sections = description.split(/\n\s*\n|\*\*|\n\s*•|\n\s*-/).filter(line => line.trim());
  return sections.map(section => section.trim()).filter(section => section.length > 0);
};

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={toggleSave}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={22}
            color={isSaved ? theme.colors.error : theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCompanyInfo = () => (
    <View style={styles.companySection}>
      <View style={styles.companyHeader}>
        <Image
          source={{ uri: job.company_logo || 'https://via.placeholder.com/80' }}
          style={styles.companyLogo}
          resizeMode="contain"
        />
        <View style={styles.companyDetails}>
          <Text style={styles.companyName}>{job.company}</Text>
          {job.company_industry && (
            <Text style={styles.companyIndustry} numberOfLines={2}>
              {job.company_industry}
            </Text>
          )}
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(job.date_posted)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderJobTitle = () => (
    <View style={styles.titleSection}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <View style={styles.badges}>
        <View style={[styles.badge, styles.jobTypeBadge]}>
          <Text style={styles.badgeText}>
            {job.job_type?.toUpperCase() || 'FULL-TIME'}
          </Text>
        </View>
        {job.is_remote && (
          <View style={[styles.badge, styles.remoteBadge]}>
            <Ionicons name="wifi-outline" size={14} color={theme.colors.success} />
            <Text style={[styles.badgeText, styles.remoteBadgeText]}>Remote</Text>
          </View>
        )}
        {job.job_function && (
          <View style={[styles.badge, styles.functionBadge]}>
            <Text style={[styles.badgeText, styles.functionBadgeText]}>
              {job.job_function}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSalaryInfo = () => {
    const salary = formatSalary(job.min_amount, job.max_amount, job.currency);
    if (!salary) return null;

    return (
      <View style={styles.salarySection}>
        <View style={styles.salaryCard}>
          <View style={styles.salaryHeader}>
            <Ionicons name="card-outline" size={20} color={theme.colors.success} />
            <Text style={styles.salaryLabel}>Salary Range</Text>
          </View>
          <Text style={styles.salaryAmount}>{salary}</Text>
          <Text style={styles.salaryNote}>Per year • Before taxes</Text>
        </View>
      </View>
    );
  };
const renderDescription = () => {
  const sections = parseDescription(job.description);
  const displaySections = isExpanded ? sections : sections.slice(0, 3);

  return (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Job Description</Text>
      <View style={styles.descriptionContent}>
        {displaySections.map((section, index) => (
          <Text key={index} style={styles.descriptionText}>
            {section}
          </Text>
        ))}
        {sections.length > 3 && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.expandButtonText}>
              {isExpanded ? 'Show Less' : 'Read More'}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="business-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.quickActionText}>Company Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.quickActionText}>Similar Jobs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.quickActionText}>Ask Questions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCompanyInfo()}
        {renderJobTitle()}
        {renderSalaryInfo()}
        {renderDescription()}
        {renderQuickActions()}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={toggleSave}
        >
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={20}
            color={isSaved ? theme.colors.error : theme.colors.textSecondary}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  companySection: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.md,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  companyIndustry: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  jobMeta: {
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  titleSection: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  jobTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.md,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  jobTypeBadge: {
    backgroundColor: theme.colors.primary,
  },
  remoteBadge: {
    backgroundColor: theme.colors.success + '20',
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  functionBadge: {
    backgroundColor: theme.colors.secondary + '20',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  badgeText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.background,
  },
  remoteBadgeText: {
    color: theme.colors.success,
    marginLeft: theme.spacing.xxs,
  },
  functionBadgeText: {
    color: theme.colors.secondary,
  },
  salarySection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  salaryCard: {
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success + '30',
  },
  salaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  salaryLabel: {
    ...theme.typography.body2,
    color: theme.colors.success,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  salaryAmount: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xxs,
  },
  salaryNote: {
    ...theme.typography.caption,
    color: theme.colors.success,
    opacity: 0.8,
  },
  descriptionSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  descriptionContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
  },
  descriptionText: {
    ...theme.typography.body1,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  expandButtonText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  quickActionsSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickActionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomPadding: {
    height: theme.spacing.xl,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.md,
  },
  applyButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    marginRight: theme.spacing.xs,
    textTransform: 'none',
    fontWeight: '600',
  },
});

export default JobDetailScreen;