import axios from "axios";
import { HOST } from "./constants";

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to sanitize sensitive data
const sanitizeData = (data) => {
  if (!data) return data;
  
  // Check if it's FormData
  if (data instanceof FormData) {
    const formDataObj = {};
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        formDataObj[key] = `File: ${value.name} (${value.type}, ${value.size} bytes)`;
      } else {
        formDataObj[key] = value;
      }
    }
    return formDataObj;
  }
  
  // For regular objects, hide sensitive fields
  const sanitized = { ...data };
  const sensitiveFields = ['password', 'confirmPassword', 'token', 'authorization', 'currentPassword', 'newPassword'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***HIDDEN***';
    }
  });
  
  return sanitized;
};

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add token to Authorization header if it exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    console.log("Request:", config.method.toUpperCase(), config.url);
    if (config.data) {
      console.log("Data:", sanitizeData(config.data));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response?.status);
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/auth') && !currentPath.includes('/login') && !currentPath.includes('/signup')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;