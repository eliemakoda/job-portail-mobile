// src/utils/constants.js

// API Configuration
export const API_BASE_URL = 'http://localhost:3000/'  // Development URL

export const API_TIMEOUT = 10000; // 10 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Job Types
export const JOB_TYPES = {
  GENERAL: 'general',
  REMOTE: 'remote',
};

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: 'entry' },
  { label: 'Mid Level', value: 'mid' },
  { label: 'Senior Level', value: 'senior' },
  { label: 'Lead/Principal', value: 'lead' },
  { label: 'Executive', value: 'executive' },
];

// Company Sizes
export const COMPANY_SIZES = [
  { label: 'Startup (1-10)', value: 'startup' },
  { label: 'Small (11-50)', value: 'small' },
  { label: 'Medium (51-200)', value: 'medium' },
  { label: 'Large (201-1000)', value: 'large' },
  { label: 'Enterprise (1000+)', value: 'enterprise' },
];

// Job Categories
export const JOB_CATEGORIES = [
  'Software Development',
  'Data Science',
  'Product Management',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
  'Human Resources',
  'Customer Support',
  'Engineering',
  'DevOps',
  'Security',
  'Quality Assurance',
  'Business Analysis',
];

// Employment Types
export const EMPLOYMENT_TYPES = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Internship', value: 'internship' },
  { label: 'Temporary', value: 'temporary' },
];

// Work Arrangements
export const WORK_ARRANGEMENTS = [
  { label: 'Remote', value: 'remote', color: '#8b5cf6' },
  { label: 'Hybrid', value: 'hybrid', color: '#06b6d4' },
  { label: 'On-site', value: 'onsite', color: '#64748b' },
];

// Salary Ranges (in USD)
export const SALARY_RANGES = [
  { label: 'Under $30k', value: { min: 0, max: 30000 } },
  { label: '$30k - $50k', value: { min: 30000, max: 50000 } },
  { label: '$50k - $70k', value: { min: 50000, max: 70000 } },
  { label: '$70k - $100k', value: { min: 70000, max: 100000 } },
  { label: '$100k - $150k', value: { min: 100000, max: 150000 } },
  { label: '$150k - $200k', value: { min: 150000, max: 200000 } },
  { label: 'Over $200k', value: { min: 200000, max: 999999 } },
];

// Date Posted Filters
export const DATE_POSTED_FILTERS = [
  { label: 'Last 24 hours', value: 'last_24h' },
  { label: 'Last 3 days', value: 'last_3d' },
  { label: 'Last week', value: 'last_week' },
  { label: 'Last month', value: 'last_month' },
  { label: 'Anytime', value: 'anytime' },
];

// Sort Options
export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Date Posted', value: 'date' },
  { label: 'Salary (High to Low)', value: 'salary_desc' },
  { label: 'Salary (Low to High)', value: 'salary_asc' },
  { label: 'Company A-Z', value: 'company_asc' },
  { label: 'Title A-Z', value: 'title_asc' },
];

// Popular Skills (for autocomplete/suggestions)
export const POPULAR_SKILLS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'TypeScript', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
  'Kotlin', 'C++', 'C', 'Scala', 'R', 'MATLAB', 'SQL',
  
  // Frontend Technologies
  'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS',
  'Next.js', 'Nuxt.js', 'Svelte', 'jQuery',
  
  // Backend Technologies
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails',
  'ASP.NET', 'FastAPI', 'NestJS',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
  'Elasticsearch', 'Cassandra', 'DynamoDB',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
  'Terraform', 'Ansible', 'Linux', 'Git', 'CI/CD',
  
  // Data Science & ML
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
  'Data Analysis', 'Statistics', 'Deep Learning', 'NLP', 'Computer Vision',
  
  // Mobile Development
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
  
  // Other
  'Agile', 'Scrum', 'Project Management', 'API Design', 'Microservices', 'GraphQL',
  'REST API', 'Testing', 'Unit Testing', 'Integration Testing', 'Security',
];

// Popular Locations
export const POPULAR_LOCATIONS = [
  // US Cities
  'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA',
  'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Atlanta, GA', 'Miami, FL', 'Phoenix, AZ',
  'Portland, OR', 'San Diego, CA', 'Las Vegas, NV', 'Nashville, TN', 'Charlotte, NC',
  
  // International
  'London, UK', 'Toronto, Canada', 'Vancouver, Canada', 'Berlin, Germany', 'Amsterdam, Netherlands',
  'Paris, France', 'Barcelona, Spain', 'Sydney, Australia', 'Melbourne, Australia',
  'Singapore', 'Tokyo, Japan', 'Tel Aviv, Israel', 'Dublin, Ireland', 'Zurich, Switzerland',
  
  // Remote/Global
  'Remote - Worldwide', 'Remote - US Only', 'Remote - EU Only', 'Remote - Americas',
];

// Salary Periods
export const SALARY_PERIODS = [
  { label: 'Per Hour', value: 'hourly' },
  { label: 'Per Month', value: 'monthly' },
  { label: 'Per Year', value: 'annually' },
];

// Currency Options
export const CURRENCIES = [
  { label: 'USD ($)', value: 'USD', symbol: ' },
  { label: 'EUR (€)', value: 'EUR', symbol: '€' },
  { label: 'GBP (£)', value: 'GBP', symbol: '£' },
  { label: 'CAD ($)', value: 'CAD', symbol: 'C },
  { label: 'AUD ($)', value: 'AUD', symbol: 'A },
  { label: 'JPY (¥)', value: 'JPY', symbol: '¥' },
  { label: 'CHF (₣)', value: 'CHF', symbol: '₣' },
];

// Job Application Status
export const APPLICATION_STATUS = {
  NOT_APPLIED: 'not_applied',
  APPLIED: 'applied',
  IN_PROGRESS: 'in_progress',
  INTERVIEWED: 'interviewed',
  REJECTED: 'rejected',
  OFFER: 'offer',
  ACCEPTED: 'accepted',
};

// Alert/Notification Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Screen Names (for navigation)
export const SCREEN_NAMES = {
  GENERAL_JOBS: 'GeneralJobs',
  REMOTE_JOBS: 'RemoteJobs',
  SALARIES: 'Salaries',
  JOB_DETAIL: 'JobDetail',
  SAVED_JOBS: 'SavedJobs',
  SEARCH: 'Search',
  FILTERS: 'Filters',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

// Validation Rules
export const VALIDATION = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MIN_SALARY: 0,
  MAX_SALARY: 10000000,
  MAX_SKILLS_COUNT: 20,
  MAX_LOCATIONS_COUNT: 10,
};

// App Info
export const APP_INFO = {
  NAME: 'JobPortal',
  VERSION: '1.0.0',
  DESCRIPTION: 'Find your dream job',
  SUPPORT_EMAIL: 'support@jobportal.com',
  PRIVACY_POLICY_URL: 'https://jobportal.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://jobportal.com/terms',
};

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
  SAVED_FILTERS: 'saved_filters',
  THEME_PREFERENCE: 'theme_preference',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Network Status
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  TOO_MANY_REQUESTS: 'Too many requests. Please wait a moment and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  JOB_SAVED: 'Job saved successfully!',
  JOB_UNSAVED: 'Job removed from saved list.',
  SALARY_DATA_SUBMITTED: 'Thank you for contributing salary data!',
  SEARCH_SAVED: 'Search criteria saved.',
  PROFILE_UPDATED: 'Profile updated successfully.',
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  COMPANY_SIZES,
  JOB_CATEGORIES,
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  SALARY_RANGES,
  DATE_POSTED_FILTERS,
  SORT_OPTIONS,
  POPULAR_SKILLS,
  POPULAR_LOCATIONS,
  SALARY_PERIODS,
  CURRENCIES,
  APPLICATION_STATUS,
  ALERT_TYPES,
  SCREEN_NAMES,
  VALIDATION,
  APP_INFO,
  STORAGE_KEYS,
  ANIMATIONS,
  NETWORK_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};