// src/api/jobs.js
import apiClient, { handleApiResponse, handleApiError } from './client';

/**
 * Fetch general jobs with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query
 * @param {string} params.location - Location filter
 * @param {string} params.category - Job category
 * @param {string} params.experience - Experience level
 * @param {string} params.salary_min - Minimum salary
 * @param {string} params.salary_max - Maximum salary
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise} API response
 */
export const fetchGeneralJobs = async (params = {}) => {
  try {
    const response = await apiClient.get('/jobs/general');
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch remote jobs with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query
 * @param {string} params.skills - Required skills
 * @param {string} params.experience - Experience level
 * @param {string} params.salary_min - Minimum salary
 * @param {string} params.salary_max - Maximum salary
 * @param {string} params.timezone - Timezone preference
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise} API response
 */
export const fetchRemoteJobs = async (params = {}) => {
  try {
    const response = await apiClient.get('/jobs/remote', {
      params: {
        search: params.search || '',
        skills: params.skills || '',
        experience: params.experience || '',
        salary_min: params.salary_min || '',
        salary_max: params.salary_max || '',
        timezone: params.timezone || '',
        page: params.page || 1,
        limit: params.limit || 20,
        ...params,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch job details by ID
 * @param {string} jobId - Job ID
 * @param {string} type - Job type ('general' or 'remote')
 * @returns {Promise} API response
 */
export const fetchJobDetails = async (jobId, type = 'general') => {
  try {
    const endpoint = type === 'remote' ? `/jobs/remote/${jobId}` : `/jobs/general/${jobId}`;
    const response = await apiClient.get(endpoint);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch job categories
 * @returns {Promise} API response
 */
export const fetchJobCategories = async () => {
  try {
    const response = await apiClient.get('/jobs/categories');
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch popular locations
 * @returns {Promise} API response
 */
export const fetchPopularLocations = async () => {
  try {
    const response = await apiClient.get('/jobs/locations');
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch featured jobs
 * @param {string} type - Job type ('general' or 'remote')
 * @param {number} limit - Number of featured jobs to fetch
 * @returns {Promise} API response
 */
export const fetchFeaturedJobs = async (type = 'general', limit = 5) => {
  try {
    const endpoint = type === 'remote' ? '/jobs/remote/featured' : '/jobs/general/featured';
    const response = await apiClient.get(endpoint, {
      params: { limit },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Search jobs with advanced filters
 * @param {Object} filters - Advanced search filters
 * @param {string} filters.query - Search query
 * @param {Array} filters.locations - Array of locations
 * @param {Array} filters.categories - Array of categories
 * @param {Array} filters.experience_levels - Array of experience levels
 * @param {Array} filters.job_types - Array of job types (full-time, part-time, etc.)
 * @param {Object} filters.salary_range - {min: number, max: number}
 * @param {string} filters.date_posted - Date filter (last_24h, last_week, last_month)
 * @param {string} filters.sort_by - Sort option (relevance, date, salary)
 * @param {string} filters.sort_order - Sort order (asc, desc)
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @returns {Promise} API response
 */
export const searchJobs = async (filters = {}) => {
  try {
    const response = await apiClient.post('/jobs/search', filters);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get job recommendations based on user preferences
 * @param {Object} preferences - User preferences
 * @param {Array} preferences.skills - User skills
 * @param {string} preferences.experience_level - Experience level
 * @param {Array} preferences.preferred_locations - Preferred locations
 * @param {Array} preferences.preferred_categories - Preferred categories
 * @param {number} limit - Number of recommendations
 * @returns {Promise} API response
 */
export const getJobRecommendations = async (preferences = {}, limit = 10) => {
  try {
    const response = await apiClient.post('/jobs/recommendations', {
      ...preferences,
      limit,
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Save/bookmark a job
 * @param {string} jobId - Job ID
 * @param {string} type - Job type ('general' or 'remote')
 * @returns {Promise} API response
 */
export const saveJob = async (jobId, type = 'general') => {
  try {
    const response = await apiClient.post('/jobs/save', {
      job_id: jobId,
      job_type: type,
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Remove saved/bookmarked job
 * @param {string} jobId - Job ID
 * @param {string} type - Job type ('general' or 'remote')
 * @returns {Promise} API response
 */
export const unsaveJob = async (jobId, type = 'general') => {
  try {
    const response = await apiClient.delete('/jobs/save', {
      data: {
        job_id: jobId,
        job_type: type,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get saved/bookmarked jobs
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} API response
 */
export const getSavedJobs = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/jobs/saved', {
      params: { page, limit },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};