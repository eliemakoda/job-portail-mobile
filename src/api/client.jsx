import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens or logging
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    // const token = getAuthToken(); // Implement based on your auth system
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Log request in development
    if (__DEV__) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Handle unauthorized - redirect to login
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 429:
          // Handle rate limiting
          console.error('Too many requests');
          break;
        case 500:
          // Handle server error
          console.error('Server error');
          break;
        default:
          console.error(`API Error ${status}:`, data);
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data: data,
      });
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        data: null,
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred',
        data: null,
      });
    }
  }
);

// Helper function to handle API responses consistently
export const handleApiResponse = (response) => {
  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

// Helper function to handle API errors consistently
export const handleApiError = (error) => {
  return {
    success: false,
    error: {
      status: error.status || 500,
      message: error.message || 'An error occurred',
      data: error.data || null,
    },
  };
};

export default apiClient;