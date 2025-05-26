import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { Jobs } from '../data/jobs';
const { width } = Dimensions.get('window');

const GeneralJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'card' or 'list'
  const [searchQuery, setSearchQuery] = useState('');

 
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setJobs(Jobs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

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
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const JobCardView = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: item.company_logo || 'https://via.placeholder.com/50' }}
          style={styles.companyLogo}
          resizeMode="contain"
        />
        <View style={styles.jobTypeContainer}>
          <View style={[styles.jobTypeBadge, item.is_remote && styles.remoteBadge]}>
            <Text style={[styles.jobTypeText, item.is_remote && styles.remoteText]}>
              {item.is_remote ? 'Remote' : item.job_type?.toUpperCase() || 'FULL-TIME'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.jobTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.companyName} numberOfLines={1}>
          {item.company}
        </Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        
        {item.min_amount && (
          <View style={styles.salaryRow}>
            <Ionicons name="card-outline" size={14} color={theme.colors.success} />
            <Text style={styles.salaryText}>
              {formatSalary(item.min_amount, item.max_amount, item.currency)}
            </Text>
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            {formatDate(item.date_posted)}
          </Text>
          <View style={styles.applyButton}>
            <Text style={styles.applyButtonText}>View Details</Text>
            <Ionicons name="arrow-forward" size={14} color={theme.colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const JobListView = ({ item }) => (
    <TouchableOpacity
      style={styles.jobListItem}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.company_logo || 'https://via.placeholder.com/40' }}
        style={styles.listCompanyLogo}
        resizeMode="contain"
      />
      
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listJobTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.listDateText}>
            {formatDate(item.date_posted)}
          </Text>
        </View>
        
        <Text style={styles.listCompanyName} numberOfLines={1}>
          {item.company}
        </Text>
        
        <View style={styles.listDetails}>
          <View style={styles.listLocationRow}>
            <Ionicons name="location-outline" size={12} color={theme.colors.textSecondary} />
            <Text style={styles.listLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          
          {item.min_amount && (
            <Text style={styles.listSalaryText}>
              {formatSalary(item.min_amount, item.max_amount, item.currency)}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.listBadges}>
        {item.is_remote && (
          <View style={styles.remoteBadgeSmall}>
            <Text style={styles.remoteBadgeSmallText}>Remote</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Find Your Dream Job</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'card' && styles.activeViewButton]}
            onPress={() => setViewMode('card')}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={viewMode === 'card' ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === 'list' ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {jobs.length} jobs available
        </Text>
        <View style={styles.filterButton}>
          <Ionicons name="filter-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading amazing opportunities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={viewMode === 'card' ? JobCardView : JobListView}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        numColumns={viewMode === 'card' ? 1 : 1}
        key={viewMode} // Force re-render when view mode changes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  listContainer: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape.borderRadius,
    padding: 2,
  },
  viewButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.shape.borderRadius - 2,
  },
  activeViewButton: {
    backgroundColor: theme.colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape.borderRadius,
  },
  filterText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xxs,
    fontWeight: '600',
  },
  // Card View Styles
  jobCard: {
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.shape.borderRadius * 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: theme.shape.borderRadius,
  },
  jobTypeContainer: {
    alignItems: 'flex-end',
  },
  jobTypeBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.shape.borderRadius,
  },
  remoteBadge: {
    backgroundColor: theme.colors.success + '15',
  },
  jobTypeText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  remoteText: {
    color: theme.colors.success,
  },
  cardContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  jobTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  companyName: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  locationText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xxs,
    flex: 1,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  salaryText: {
    ...theme.typography.body2,
    color: theme.colors.success,
    marginLeft: theme.spacing.xxs,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.shape.borderRadius,
  },
  applyButtonText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: theme.spacing.xxs,
  },
  // List View Styles
  jobListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.shape.borderRadius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listCompanyLogo: {
    width: 40,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing.sm,
  },
  listContent: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xxs,
  },
  listJobTitle: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  listDateText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  listCompanyName: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  listDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listLocationText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xxs,
  },
  listSalaryText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontWeight: '600',
  },
  listBadges: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteBadgeSmall: {
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.shape.borderRadius / 2,
    marginBottom: theme.spacing.xxs,
  },
  remoteBadgeSmallText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default GeneralJobsScreen;