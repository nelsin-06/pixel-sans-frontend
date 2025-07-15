/**
 * API Client Module
 * @fileoverview Central API client for all HTTP requests
 */

import { APP_CONFIG } from '../config/constants.js';
import { showError } from '../modules/notifications.js';

class APIClient {
    constructor() {
        this.baseURL = APP_CONFIG.API.BASE_URL;
        this.timeout = APP_CONFIG.API.REQUEST_TIMEOUT;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            headers = {},
            body = null,
            timeout = this.timeout,
            ...otherOptions
        } = options;

        const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
        
        const config = {
            method,
            headers: {
                ...this.defaultHeaders,
                ...headers
            },
            ...otherOptions
        };

        // Add body for non-GET requests
        if (body && method !== 'GET') {
            config.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Handle HTTP errors
            if (!response.ok) {
                throw new APIError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    response
                );
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408);
            }
            
            // Re-throw API errors
            if (error instanceof APIError) {
                throw error;
            }
            
            // Handle network errors
            throw new APIError(
                error.message || 'Network error occurred',
                0,
                null,
                error
            );
        }
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, { 
            ...options, 
            method: 'POST',
            body: data 
        });
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, { 
            ...options, 
            method: 'PUT',
            body: data 
        });
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Set authentication token
     * @param {string} token - Bearer token
     */
    setAuthToken(token) {
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.defaultHeaders['Authorization'];
        }
    }

    /**
     * Set custom header
     * @param {string} name - Header name
     * @param {string} value - Header value
     */
    setHeader(name, value) {
        this.defaultHeaders[name] = value;
    }

    /**
     * Remove custom header
     * @param {string} name - Header name
     */
    removeHeader(name) {
        delete this.defaultHeaders[name];
    }

    /**
     * Set base URL
     * @param {string} url - Base URL
     */
    setBaseURL(url) {
        this.baseURL = url;
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status = 0, response = null, originalError = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.response = response;
        this.originalError = originalError;
    }

    /**
     * Check if error is a network error
     * @returns {boolean} True if network error
     */
    isNetworkError() {
        return this.status === 0;
    }

    /**
     * Check if error is a client error (4xx)
     * @returns {boolean} True if client error
     */
    isClientError() {
        return this.status >= 400 && this.status < 500;
    }

    /**
     * Check if error is a server error (5xx)
     * @returns {boolean} True if server error
     */
    isServerError() {
        return this.status >= 500;
    }
}

// Create singleton instance
const apiClient = new APIClient();

// Export API client and error class
export default apiClient;
export { APIError };

// Convenience functions
export const get = (endpoint, options) => apiClient.get(endpoint, options);
export const post = (endpoint, data, options) => apiClient.post(endpoint, data, options);
export const put = (endpoint, data, options) => apiClient.put(endpoint, data, options);
export const del = (endpoint, options) => apiClient.delete(endpoint, options);
export const setAuthToken = (token) => apiClient.setAuthToken(token);
export const setBaseURL = (url) => apiClient.setBaseURL(url);
