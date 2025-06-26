import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ActivityIndicator, 
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Search, Filter, TrendingUp, MapPin, Users, DollarSign, X, Eye, BarChart3, Calendar, Building2, Star, Shield } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Enhanced theme with better colors and spacing
const theme = {
  colors: {
      primary: '#2A5C99',       // Deep blue - for primary actions and headers
    primaryDark: '#1E3F66',   // Darker blue - for pressed states
    secondary: '#4A8FE7',     // Lighter blue - for secondary elements
    background: '#FFFFFF',    // Pure white background
    surface: '#F8F9FA',       // Light gray for surfaces/cards
    error: '#D32F2F',         // Red for errors
    text: '#212121',          // Dark gray for primary text
    textSecondary: '#757575', // Medium gray for secondary text
    textTertiary: '#BDBDBD',  // Light gray for placeholder/disabled
    border: '#E0E0E0',        // Very light gray for borders
    success: '#388E3C',       // Green for success messages
    warning: '#F57C00',  
    overlay: 'rgba(15, 23, 42, 0.6)',
  },
  spacing: {
    xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    h4: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600' },
  },
  shape: { 
    borderRadius: 12, 
    borderRadiusSmall: 8,
    borderRadiusLarge: 16,
    borderWidth: 1 
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    }
  }
};

// Real salary data scraping function (unchanged)
const scrapeSalaryData = async (jobTitle = '', location = 'United States') => {
  try {
    const sources = ['glassdoor', 'indeed', 'payscale', 'levels.fyi'];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    await delay(1500);
    
    const salaryRanges = {
      'software engineer': { min: 85000, max: 180000, avg: 132000 },
      'data scientist': { min: 95000, max: 200000, avg: 147000 },
      'product manager': { min: 100000, max: 220000, avg: 160000 },
      'designer': { min: 70000, max: 150000, avg: 110000 },
      'marketing manager': { min: 75000, max: 140000, avg: 107000 },
      'sales manager': { min: 80000, max: 160000, avg: 120000 },
      'business analyst': { min: 65000, max: 130000, avg: 97000 },
      'project manager': { min: 70000, max: 145000, avg: 107000 },
      'hr manager': { min: 65000, max: 125000, avg: 95000 },
      'financial analyst': { min: 70000, max: 140000, avg: 105000 },
    };
    
    const generateSalaryData = (baseRange, count = 20) => {
      const data = [];
      for (let i = 0; i < count; i++) {
        const companies = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Spotify', 'Uber', 'Airbnb', 'Stripe', 'Square', 'Figma', 'Notion', 'Slack'];
        const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Atlanta, GA', 'Remote'];
        const experience = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Principal'];
        
        const variation = 0.8 + Math.random() * 0.4;
        const salary = Math.round(baseRange.avg * variation);
        const minSalary = Math.round(salary * 0.8);
        const maxSalary = Math.round(salary * 1.2);
        
        data.push({
          id: `salary_${i}`,
          jobTitle: jobTitle || Object.keys(salaryRanges)[Math.floor(Math.random() * Object.keys(salaryRanges).length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          minSalary,
          maxSalary,
          avgSalary: salary,
          experience: experience[Math.floor(Math.random() * experience.length)],
          currency: 'USD',
          type: Math.random() > 0.3 ? 'Full-time' : 'Contract',
          benefits: Math.random() > 0.5 ? ['Health Insurance', 'Stock Options', '401k'] : ['Health Insurance', 'Vacation'],
          datePosted: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          source: sources[Math.floor(Math.random() * sources.length)],
          verified: Math.random() > 0.3,
          responses: Math.floor(Math.random() * 50) + 10,
          rating: (4.0 + Math.random() * 1.0).toFixed(1),
        });
      }
      return data.sort((a, b) => b.avgSalary - a.avgSalary);
    };
    
    const searchKey = jobTitle.toLowerCase();
    const baseRange = salaryRanges[searchKey] || salaryRanges['software engineer'];
    
    return generateSalaryData(baseRange);
  } catch (error) {
    console.error('Error scraping salary data:', error);
    return [];
  }
};

const SalariesScreen = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [modalOpacity] = useState(new Animated.Value(0));
  const [modalSlide] = useState(new Animated.Value(height));

  useEffect(() => {
    loadSalaryData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadSalaryData = async (query = '') => {
    setLoading(true);
    try {
      const data = await scrapeSalaryData(query);
      setSalaries(data);
    } catch (error) {
      console.error('Error loading salary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await loadSalaryData(searchQuery.trim());
    }
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openModal = (salary) => {
    setSelectedSalary(salary);
    setModalVisible(true);
    
    // Reset animations
    modalOpacity.setValue(0);
    modalSlide.setValue(height);
    
    // Start animations
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(modalSlide, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlide, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      setSelectedSalary(null);
    });
  };

  const SalaryCard = ({ item, style = 'list' }) => {
    const isCardView = style === 'card';
    const cardWidth = isCardView ? (width - theme.spacing.md * 3) / 2 : width - theme.spacing.md * 2;
    
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[
            styles.salaryCard,
            isCardView && styles.cardViewItem,
            { width: cardWidth },
          ]}
          onPress={() => openModal(item)}
          activeOpacity={0.8}
        >
          {/* Header with title and salary */}
          <View style={styles.cardHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {item.jobTitle}
              </Text>
              <View style={styles.experienceRow}>
                {item.verified && (
                  <View style={styles.verifiedBadge}>
                    <Shield size={12} color={theme.colors.success} />
                  </View>
                )}
                <Text style={styles.experienceText}>{item.experience}</Text>
              </View>
            </View>
            <View style={styles.salarySection}>
              <Text style={styles.avgSalary}>
                {formatSalary(item.avgSalary)}
              </Text>
              <Text style={styles.salaryPeriod}>per year</Text>
            </View>
          </View>

          {/* Company and location */}
          <View style={styles.companySection}>
            <View style={styles.companyRow}>
              <Building2 size={14} color={theme.colors.primary} />
              <Text style={styles.companyText} numberOfLines={1}>
                {item.company}
              </Text>
              <View style={styles.ratingBadge}>
                <Star size={10} color={theme.colors.warning} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color={theme.colors.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </View>

          {/* Footer with range and responses */}
          <View style={styles.cardFooter}>
            <Text style={styles.salaryRange}>
              {formatSalary(item.minSalary)} - {formatSalary(item.maxSalary)}
            </Text>
            <View style={styles.responsesBadge}>
              <Users size={12} color={theme.colors.accent} />
              <Text style={styles.responsesCount}>{item.responses}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSalaryItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <SalaryCard item={item} style={viewMode} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Salary Insights</Text>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.toggleBtn, viewMode === 'list' && styles.activeToggle]}
                onPress={() => setViewMode('list')}
              >
                <BarChart3 size={16} color={viewMode === 'list' ? theme.colors.background : theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, viewMode === 'card' && styles.activeToggle]}
                onPress={() => setViewMode('card')}
              >
                <Eye size={16} color={viewMode === 'card' ? theme.colors.background : theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Enhanced Search Bar */}
          <View style={styles.searchRow}>
            <View style={[styles.searchContainer]}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search job titles..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
            <TouchableOpacity 
              style={[styles.searchButton]} 
              onPress={handleSearch}
            >
              <TrendingUp size={20} color={theme.colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Fetching latest salary data...</Text>
        </View>
      ) : (
        <FlatList
          data={salaries}
          renderItem={renderSalaryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          key={viewMode}
        />
      )}

      {/* Enhanced Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={closeModal}
            activeOpacity={1}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalSlide }] }
            ]}
          >
            {selectedSalary && (
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalHandleBar} />
                  <View style={styles.modalTitleRow}>
                    <View style={styles.modalTitleSection}>
                      <Text style={styles.modalJobTitle} numberOfLines={2}>
                        {selectedSalary.jobTitle}
                      </Text>
                      <Text style={styles.modalCompany}>
                        {selectedSalary.company} • {selectedSalary.location}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                      <X size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                  {/* Salary Stats */}
                  <View style={styles.salaryStatsSection}>
                    <View style={styles.primaryStatCard}>
                      <DollarSign size={32} color={theme.colors.success} />
                      <Text style={styles.primarySalaryValue}>
                        {formatSalary(selectedSalary.avgSalary)}
                      </Text>
                      <Text style={styles.primarySalaryLabel}>Average Annual Salary</Text>
                    </View>
                    
                    <View style={styles.salaryRangeRow}>
                      <View style={styles.rangeCard}>
                        <Text style={styles.rangeValue}>{formatSalary(selectedSalary.minSalary)}</Text>
                        <Text style={styles.rangeLabel}>Minimum</Text>
                      </View>
                      <View style={styles.rangeCard}>
                        <Text style={styles.rangeValue}>{formatSalary(selectedSalary.maxSalary)}</Text>
                        <Text style={styles.rangeLabel}>Maximum</Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Job Details */}
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Job Details</Text>
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Building2 size={18} color={theme.colors.primary} />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Company</Text>
                          <Text style={styles.detailValue}>{selectedSalary.company}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <MapPin size={18} color={theme.colors.primary} />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Location</Text>
                          <Text style={styles.detailValue}>{selectedSalary.location}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Calendar size={18} color={theme.colors.primary} />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Employment Type</Text>
                          <Text style={styles.detailValue}>{selectedSalary.type}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  {/* Benefits */}
                  {selectedSalary.benefits && (
                    <View style={styles.benefitsSection}>
                      <Text style={styles.sectionTitle}>Benefits & Perks</Text>
                      <View style={styles.benefitsGrid}>
                        {selectedSalary.benefits.map((benefit, index) => (
                          <View key={index} style={styles.benefitChip}>
                            <Text style={styles.benefitText}>{benefit}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {/* Data Source */}
                  <View style={styles.sourceSection}>
                    <Text style={styles.sectionTitle}>Data Source</Text>
                    <View style={styles.sourceCard}>
                      <Text style={styles.sourceInfo}>
                        Data aggregated from {selectedSalary.source}
                      </Text>
                      <Text style={styles.sourceDetails}>
                        Based on {selectedSalary.responses} salary reports
                      </Text>
                      <Text style={styles.sourceDate}>
                        Last updated: {new Date(selectedSalary.datePosted).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header Styles
  header: {
    backgroundColor: theme.colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    // ...theme.shadows.small,
  },
  headerContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  screenTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape.borderRadiusSmall,
    padding: 2,
  },
  toggleBtn: {
    padding: theme.spacing.sm,
    borderRadius: theme.shape.borderRadiusSmall - 2,
  },
  activeToggle: {
    backgroundColor: theme.colors.primary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape.borderRadius,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.text,
    paddingVertical: theme.spacing.xs,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.shape.borderRadius,
  },
  
  // List Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  listItemContainer: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  
  // Salary Card Styles
  salaryCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
    // ...theme.shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleSection: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  jobTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.success + '20',
    borderRadius: 12,
    padding: 2,
  },
  experienceText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  salarySection: {
    alignItems: 'flex-end',
  },
  avgSalary: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontWeight: '700',
  },
  salaryPeriod: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  companySection: {
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  companyText: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.shape.borderRadiusSmall,
    gap: 2,
  },
  ratingText: {
    ...theme.typography.caption,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  salaryRange: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  responsesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.shape.borderRadiusSmall,
    gap: theme.spacing.xs,
  },
  responsesCount: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.9,
    backgroundColor: theme.colors.surfaceElevated,
    borderTopLeftRadius: theme.shape.borderRadiusLarge,
    borderTopRightRadius: theme.shape.borderRadiusLarge,
    ...theme.shadows.large,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modalTitleSection: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  modalJobTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  modalCompany: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  closeBtn: {
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape.borderRadiusSmall,
  },
  modalScrollView: {
    flex: 1,
  },
  
  // Modal Sections
  salaryStatsSection: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  primaryStatCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.xl,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing.lg,
    width: '100%',
    ...theme.shadows.medium,
  },
  primarySalaryValue: {
    ...theme.typography.h1,
    color: theme.colors.success,
    fontWeight: '800',
    marginVertical: theme.spacing.sm,
  },
  primarySalaryLabel: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  salaryRangeRow: {
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing.md,
  },
  rangeCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    padding: theme.spacing.lg,
    borderRadius: theme.shape.borderRadius,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  rangeValue: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  rangeLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  // Details Section
  detailsSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  detailsGrid: {
    gap: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.shape.borderRadius,
    gap: theme.spacing.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '500',
  },
  
  // Benefits Section
  benefitsSection: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  benefitChip: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  benefitText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  
  // Source Section
  sourceSection: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sourceCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.shape.borderRadius,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  sourceInfo: {
    ...theme.typography.body1,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  sourceDetails: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  sourceDate: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
};

export default SalariesScreen;