// src/api/salaries.js
import apiClient, { handleApiResponse, handleApiError } from './client';

/**
 * Get salary estimation based on job parameters
 * @param {Object} params - Salary estimation parameters
 * @param {string} params.job_title - Job title
 * @param {string} params.location - Job location
 * @param {string} params.experience_level - Experience level (entry, mid, senior, lead)
 * @param {Array} params.skills - Array of required skills
 * @param {string} params.industry - Industry/company sector
 * @param {string} params.company_size - Company size (startup, small, medium, large, enterprise)
 * @param {string} params.job_type - Job type (full-time, part-time, contract, freelance)
 * @returns {Promise} API response with salary estimation
 */
export const getSalaryEstimation = async (params) => {
  try {
    const response = await apiClient.post('/salaries/estimate', {
      job_title: params.job_title,
      location: params.location,
      experience_level: params.experience_level,
      skills: params.skills || [],
      industry: params.industry || '',
      company_size: params.company_size || '',
      job_type: params.job_type || 'full-time',
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get salary range for a specific job title and location
 * @param {string} jobTitle - Job title
 * @param {string} location - Location
 * @param {string} experienceLevel - Experience level
 * @returns {Promise} API response with salary range
 */
export const getSalaryRange = async (jobTitle, location, experienceLevel = 'mid') => {
  try {
    const response = await apiClient.get('/salaries/range', {
      params: {
        job_title: jobTitle,
        location: location,
        experience_level: experienceLevel,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get salary trends for a job title over time
 * @param {string} jobTitle - Job title
 * @param {string} location - Location (optional)
 * @param {string} period - Time period (6m, 1y, 2y, 5y)
 * @returns {Promise} API response with salary trends
 */
export const getSalaryTrends = async (jobTitle, location = '', period = '1y') => {
  try {
    const response = await apiClient.get('/salaries/trends', {
      params: {
        job_title: jobTitle,
        location: location,
        period: period,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Compare salaries across different locations
 * @param {string} jobTitle - Job title
 * @param {Array} locations - Array of locations to compare
 * @param {string} experienceLevel - Experience level
 * @returns {Promise} API response with salary comparison
 */
export const compareSalariesByLocation = async (jobTitle, locations, experienceLevel = 'mid') => {
  try {
    const response = await apiClient.post('/salaries/compare/locations', {
      job_title: jobTitle,
      locations: locations,
      experience_level: experienceLevel,
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Compare salaries across different job titles
 * @param {Array} jobTitles - Array of job titles to compare
 * @param {string} location - Location
 * @param {string} experienceLevel - Experience level
 * @returns {Promise} API response with salary comparison
 */
export const compareSalariesByJobTitle = async (jobTitles, location, experienceLevel = 'mid') => {
  try {
    const response = await apiClient.post('/salaries/compare/titles', {
      job_titles: jobTitles,
      location: location,
      experience_level: experienceLevel,
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get salary breakdown by components (base, bonus, equity, etc.)
 * @param {string} jobTitle - Job title
 * @param {string} location - Location
 * @param {string} experienceLevel - Experience level
 * @param {string} companySize - Company size
 * @returns {Promise} API response with salary breakdown
 */
export const getSalaryBreakdown = async (jobTitle, location, experienceLevel = 'mid', companySize = '') => {
  try {
    const response = await apiClient.get('/salaries/breakdown', {
      params: {
        job_title: jobTitle,
        location: location,
        experience_level: experienceLevel,
        company_size: companySize,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get salary data by industry
 * @param {string} industry - Industry name
 * @param {string} location - Location (optional)
 * @param {string} experienceLevel - Experience level (optional)
 * @returns {Promise} API response with industry salary data
 */
export const getSalariesByIndustry = async (industry, location = '', experienceLevel = '') => {
  try {
    const response = await apiClient.get('/salaries/industry', {
      params: {
        industry: industry,
        location: location,
        experience_level: experienceLevel,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get skills impact on salary for a job title
 * @param {string} jobTitle - Job title
 * @param {string} location - Location
 * @param {string} experienceLevel - Experience level
 * @returns {Promise} API response with skills salary impact
 */
export const getSkillsSalaryImpact = async (jobTitle, location, experienceLevel = 'mid') => {
  try {
    const response = await apiClient.get('/salaries/skills-impact', {
      params: {
        job_title: jobTitle,
        location: location,
        experience_level: experienceLevel,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get cost of living adjusted salary
 * @param {number} salary - Base salary amount
 * @param {string} fromLocation - Original location
 * @param {string} toLocation - Target location
 * @returns {Promise} API response with adjusted salary
 */
export const getCostOfLivingAdjustedSalary = async (salary, fromLocation, toLocation) => {
  try {
    const response = await apiClient.post('/salaries/cost-of-living-adjustment', {
      salary: salary,
      from_location: fromLocation,
      to_location: toLocation,
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get popular job titles for salary comparison
 * @param {string} category - Job category (optional)
 * @param {number} limit - Number of titles to return
 * @returns {Promise} API response with popular job titles
 */
export const getPopularJobTitles = async (category = '', limit = 20) => {
  try {
    const response = await apiClient.get('/salaries/popular-titles', {
      params: {
        category: category,
        limit: limit,
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Submit salary data (crowdsourced)
 * @param {Object} salaryData - Salary information to submit
 * @param {string} salaryData.job_title - Job title
 * @param {string} salaryData.location - Location
 * @param {number} salaryData.base_salary - Base salary
 * @param {number} salaryData.bonus - Annual bonus (optional)
 * @param {number} salaryData.equity - Equity value (optional)
 * @param {string} salaryData.experience_level - Experience level
 * @param {Array} salaryData.skills - Skills used in the role
 * @param {string} salaryData.industry - Industry
 * @param {string} salaryData.company_size - Company size
 * @param {number} salaryData.years_experience - Years of experience
 * @returns {Promise} API response
 */
export const submitSalaryData = async (salaryData) => {
  try {
    const response = await apiClient.post('/salaries/submit', salaryData);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};