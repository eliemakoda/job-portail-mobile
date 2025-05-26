import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Share,
  Linking,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { RemoteJobs } from '../data/remote';

const { width, height } = Dimensions.get('window');

const RemoteJobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Helper function to get job description
  const getJobDescription = (job) => {
    if (job.job_details && job.job_details.description) {
      return job.job_details.description;
    }
    if (job.job_details && job.job_details.error) {
      return `We're looking for a skilled ${job.title} to join ${job.company}. This is a great opportunity to work remotely and contribute to innovative projects.`;
    }
    return `Join ${job.company} as a ${job.title}. This remote position offers the opportunity to work with cutting-edge technologies and make a meaningful impact.`;
  };

  // Helper function to get job requirements
  const getJobRequirements = (job) => {
    if (job.job_details && job.job_details.requirements) {
      return job.job_details.requirements;
    }
    // Generate basic requirements based on job title and tags
    const baseRequirements = [`Experience with ${job.title.toLowerCase()}`];
    if (job.tags && job.tags.length > 0) {
      baseRequirements.push(`Proficiency in ${job.tags.slice(0, 3).join(', ')}`);
    }
    baseRequirements.push('Strong communication skills for remote work');
    baseRequirements.push('Self-motivated and able to work independently');
    return baseRequirements;
  };

  // Helper function to get job benefits
  const getJobBenefits = (job) => {
    if (job.job_details && job.job_details.benefits) {
      return job.job_details.benefits;
    }
    // Default benefits for remote jobs
    return [
      'Remote work flexibility',
      'Competitive compensation',
      'Professional development opportunities',
      'Work-life balance'
    ];
  };

  // Helper function to check if job details are available
  const hasJobDetailsError = (job) => {
    return job.job_details && job.job_details.error;
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, []);

  const loadJobs = async () => {
    setLoading(true);
      setJobs(RemoteJobs||[]);
      setFilteredJobs([]);
      setLoading(false);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );
    setFilteredJobs(filtered);
  };

  const openJobModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeJobModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleApply = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening URL:', error);
    }
  };

  const handleShare = async (job) => {
    try {
      await Share.share({
        message: `Check out this remote job: ${job.title} at ${job.company}\n${job.job_url}`,
        title: `${job.title} - ${job.company}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const toggleFavorite = (jobId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavorites(newFavorites);
  };

  const getTimeAgo = (timeStr) => {
    return timeStr;
  };

  const getSalaryColor = (salary) => {
    if (!salary || salary === 'N/A') return theme.colors.textSecondary;
    const amount = parseInt(salary.replace(/[^0-9]/g, ''));
    if (amount >= 150) return '#10B981'; // Green
    if (amount >= 100) return '#3B82F6'; // Blue
    return '#8B5CF6'; // Purple
  };

  const getCompanyColor = (company) => {
    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4'];
    const index = company.length % colors.length;
    return colors[index];
  };

  const renderTag = (tag, index) => (
    <View key={index} style={styles.tag}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );

  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => openJobModal(item)}
        activeOpacity={0.95}
      >
        {/* Premium Badge - only show if salary is available and not N/A */}
        {item.salary && item.salary !== 'N/A' && (
          <View style={[styles.premiumBadge, { backgroundColor: getSalaryColor(item.salary) }]}>
            <Ionicons name="diamond" size={12} color="#FFFFFF" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={[styles.companyLogo, { backgroundColor: getCompanyColor(item.company) }]}>
            <Text style={styles.companyInitial}>
              {item.company.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.jobTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.companyName}>{item.company}</Text>
            <View style={styles.quickInfo}>
              <View style={styles.jobTypeChip}>
                <Text style={styles.jobTypeText}>{item.job_type || 'Remote'}</Text>
              </View>
              <Text style={styles.postedTime}>{getTimeAgo(item.posted_at)} ago</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(item.job_id)}
          >
            <Ionicons 
              name={favorites.has(item.job_id) ? "heart" : "heart-outline"} 
              size={22} 
              color={favorites.has(item.job_id) ? "#EF4444" : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#06B6D4" />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
          {item.salary && item.salary !== 'N/A' && (
            <View style={styles.infoRow}>
              <Ionicons name="card" size={16} color={getSalaryColor(item.salary)} />
              <Text style={[styles.infoText, styles.salaryText, { color: getSalaryColor(item.salary) }]}>
                {item.salary}
              </Text>
            </View>
          )}
        </View>

        {/* Error indicator if job details failed to load */}
        {hasJobDetailsError(item) && (
          <View style={styles.errorIndicator}>
            <Ionicons name="warning" size={14} color="#F59E0B" />
            <Text style={styles.errorText}>Limited details available</Text>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {item.tags && item.tags.slice(0, 6).map(renderTag)}
          {item.tags && item.tags.length > 6 && (
            <View style={[styles.tag, styles.moreTag]}>
              <Text style={styles.tagText}>+{item.tags.length - 6}</Text>
            </View>
          )}
        </ScrollView>
      </TouchableOpacity>
    </View>
  );

  const renderJobList = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => openJobModal(item)}
      activeOpacity={0.95}
    >
      <View style={styles.listContent}>
        <View style={[styles.listCompanyLogo, { backgroundColor: getCompanyColor(item.company) }]}>
          <Text style={styles.listCompanyInitial}>
            {item.company.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.listInfo}>
          <View style={styles.listHeader}>
            <Text style={styles.listJobTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => toggleFavorite(item.job_id)}>
              <Ionicons 
                name={favorites.has(item.job_id) ? "heart" : "heart-outline"} 
                size={18} 
                color={favorites.has(item.job_id) ? "#EF4444" : theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.listCompanyName}>{item.company}</Text>
          <View style={styles.listMeta}>
            <Text style={styles.listMetaText}>{item.location}</Text>
            <Text style={styles.listMetaText}>•</Text>
            <Text style={styles.listMetaText}>{getTimeAgo(item.posted_at)} ago</Text>
            {item.salary && item.salary !== 'N/A' && (
              <>
                <Text style={styles.listMetaText}>•</Text>
                <Text style={[styles.listMetaText, { color: getSalaryColor(item.salary), fontWeight: '600' }]}>
                  {item.salary}
                </Text>
              </>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Remote Jobs</Text>
          <Text style={styles.headerSubtitle}>
            {filteredJobs.length} opportunities • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredJobs.length}</Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.size}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>
      </View>

      {/* Enhanced Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies, technologies..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="options" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'card' && styles.toggleBtnActive]}
            onPress={() => setViewMode('card')}
          >
            <MaterialIcons 
              name="view-agenda" 
              size={20} 
              color={viewMode === 'card' ? '#FFFFFF' : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <MaterialIcons 
              name="view-list" 
              size={20} 
              color={viewMode === 'list' ? '#FFFFFF' : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        renderItem={viewMode === 'card' ? renderJobCard : renderJobList}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // onRefresh={loadJobs}
        // refreshing={refreshing}
        numColumns={1}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={theme.colors.textTertiary} />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search criteria</Text>
          </View>
        }
      />

      {/* Enhanced Job Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeJobModal}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedJob && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={closeJobModal}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <View style={styles.modalHeaderCenter}>
                    <Text style={styles.modalHeaderTitle}>Job Details</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalShareBtn}
                    onPress={() => handleShare(selectedJob)}
                  >
                    <Ionicons name="share-outline" size={22} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                  {/* Enhanced Job Header */}
                  <View style={styles.modalJobHeader}>
                    <View style={[styles.modalCompanyLogo, { backgroundColor: getCompanyColor(selectedJob.company) }]}>
                      <Text style={styles.modalCompanyInitial}>
                        {selectedJob.company.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.modalJobInfo}>
                      <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
                      <Text style={styles.modalCompanyName}>{selectedJob.company}</Text>
                      <View style={styles.modalJobMeta}>
                        <View style={styles.modalMetaItem}>
                          <Ionicons name="location" size={16} color="#06B6D4" />
                          <Text style={styles.modalMetaText}>{selectedJob.location}</Text>
                        </View>
                        <View style={styles.modalMetaItem}>
                          <Ionicons name="time" size={16} color="#8B5CF6" />
                          <Text style={styles.modalMetaText}>{getTimeAgo(selectedJob.posted_at)} ago</Text>
                        </View>
                        <View style={styles.modalMetaItem}>
                          <Ionicons name="briefcase" size={16} color="#10B981" />
                          <Text style={styles.modalMetaText}>{selectedJob.job_type || 'Remote'}</Text>
                        </View>
                        {selectedJob.salary && selectedJob.salary !== 'N/A' && (
                          <View style={styles.modalMetaItem}>
                            <Ionicons name="card" size={16} color={getSalaryColor(selectedJob.salary)} />
                            <Text style={[styles.modalMetaText, { color: getSalaryColor(selectedJob.salary), fontWeight: '600' }]}>
                              {selectedJob.salary}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.modalFavoriteBtn}
                      onPress={() => toggleFavorite(selectedJob.job_id)}
                    >
                      <Ionicons 
                        name={favorites.has(selectedJob.job_id) ? "heart" : "heart-outline"} 
                        size={24} 
                        color={favorites.has(selectedJob.job_id) ? "#EF4444" : theme.colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Error notice if job details couldn't be loaded */}
                  {hasJobDetailsError(selectedJob) && (
                    <View style={styles.errorNotice}>
                      <Ionicons name="information-circle" size={20} color="#F59E0B" />
                      <Text style={styles.errorNoticeText}>
                        Some job details couldn't be loaded. Please visit the job link for complete information.
                      </Text>
                    </View>
                  )}

                  {/* Job Description */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>About this role</Text>
                    <Text style={styles.modalDescription}>{getJobDescription(selectedJob)}</Text>
                  </View>

                  {/* Skills & Technologies */}
                  {selectedJob.tags && selectedJob.tags.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Skills & Technologies</Text>
                      <View style={styles.modalTags}>
                        {selectedJob.tags.map(renderTag)}
                      </View>
                    </View>
                  )}

                  {/* Requirements */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Requirements</Text>
                    {getJobRequirements(selectedJob).map((req, index) => (
                      <View key={index} style={styles.requirementItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.requirementText}>{req}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Benefits */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Benefits & Perks</Text>
                    {getJobBenefits(selectedJob).map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Ionicons name="gift" size={16} color="#8B5CF6" />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Job Details */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Job Information</Text>
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Source</Text>
                        <Text style={styles.detailValue}>{selectedJob.source}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Posted</Text>
                        <Text style={styles.detailValue}>{getTimeAgo(selectedJob.posted_at)} ago</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Job ID</Text>
                        <Text style={styles.detailValue}>{selectedJob.job_id}</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* Enhanced Footer */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => toggleFavorite(selectedJob.job_id)}
                  >
                    <Ionicons 
                      name={favorites.has(selectedJob.job_id) ? "heart" : "heart-outline"} 
                      size={20} 
                      color={favorites.has(selectedJob.job_id) ? "#EF4444" : theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => handleApply(selectedJob.job_url)}
                  >
                    <Text style={styles.applyBtnText}>Apply Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 2,
  },
  toggleBtn: {
    padding: 8,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  jobCard: {
    marginBottom: 16,
  },
  cardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 1,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    lineHeight: 24,
  },
  companyName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  jobTypeChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  postedTime: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  favoriteBtn: {
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  salaryText: {
    fontWeight: '600',
  },
  errorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  tagsContainer: {
    marginTop: 4,
  },
  tagsContent: {
    paddingRight: 20,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  moreTag: {
    backgroundColor: '#E2E8F0',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listCompanyLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listCompanyInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  listInfo: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listJobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  listCompanyName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listMetaText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    flex: 1,
    marginTop: height * 0.1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalCloseBtn: {
    padding: 8,
    marginLeft: -8,
  },
  modalHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  modalShareBtn: {
    padding: 8,
    marginRight: -8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalJobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalCompanyLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalCompanyInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  modalJobInfo: {
    flex: 1,
  },
  modalJobTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    lineHeight: 28,
  },
  modalCompanyName: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalJobMeta: {
    gap: 12,
  },
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalMetaText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  modalFavoriteBtn: {
    padding: 12,
    marginTop: -12,
    marginRight: -12,
  },
  errorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    gap: 12,
  },
  errorNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#D97706',
    fontWeight: '500',
    lineHeight: 20,
  },
  modalSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  requirementText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
  },
  saveBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default RemoteJobsScreen;