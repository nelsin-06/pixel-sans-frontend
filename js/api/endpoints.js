/**
 * API Endpoints Module
 * @fileoverview Handles all API endpoints and data fetching logic
 */

import { APP_CONFIG } from '../config/constants.js';
import apiClient, { APIError } from './api-client.js';
import { showError } from '../modules/notifications.js';

export class PostsAPI {
    /**
     * Convert category code to English name for API requests
     * @param {string} categoryCode - Internal category code
     * @returns {string} English category name for API
     */
    convertCategoryToEnglish(categoryCode) {
        if (!categoryCode) return categoryCode;
        
        // Use the mapping from constants
        return APP_CONFIG.CATEGORY_TO_ENGLISH[categoryCode] || categoryCode;
    }

    /**
     * Fetch paginated posts
     * @param {number} page - Page number (1-based)
     * @param {number} pageSize - Number of items per page
     * @param {Object} filters - Optional filters
     * @returns {Promise<Object>} Paginated posts response
     */
    async getPosts(page = 1, pageSize = APP_CONFIG.API.DEFAULT_PAGE_SIZE, filters = {}) {
        try {
            // Convert category code to English name if category filter is provided
            const processedFilters = { ...filters };
            if (processedFilters.category) {
                processedFilters.category = this.convertCategoryToEnglish(processedFilters.category);
            }

            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                ...processedFilters
            });

            const endpoint = `${APP_CONFIG.API.ENDPOINTS.POSTS}?${params}`;
            
            const response = await apiClient.get(endpoint);
            
            // Normalize response to expected format
            return this.normalizeAPIResponse(response, page, pageSize);

        } catch (error) {
            throw error;
        }
    }

    /**
     * Normalize API response to expected format
     * @param {Object} response - Raw API response
     * @param {number} page - Current page
     * @param {number} pageSize - Page size
     * @returns {Object} Normalized response
     */
    normalizeAPIResponse(response, page, pageSize) {
        // Handle different API response formats
        let data = response;
        let items = [];
        let totalItems = 0;

        // Check if response has a data property (common API pattern)
        if (response.data) {
            data = response.data;
        }

        // Extract items array
        if (Array.isArray(data)) {
            items = data;
            totalItems = data.length;
        } else if (data.items) {
            items = data.items;
            totalItems = data.totalItems || data.total || items.length;
        } else if (data.posts) {
            items = data.posts;
            totalItems = data.totalItems || data.total || items.length;
        }

        // Calculate pagination info
        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalItems: totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            items: items.map(item => this.normalizePostItem(item))
        };
    }

    /**
     * Normalize a single post item
     * @param {Object} item - Raw post item
     * @returns {Object} Normalized post item
     */
    normalizePostItem(item) {
        return {
            _id: item._id || item.id || `post-${Date.now()}-${Math.random()}`,
            active: item.active !== false, // Default to true
            category: item.category || 'general',
            title: item.title || 'Sin título',
            image: item.image || this.getDefaultImageForCategory(item.category),
            secciones: item.secciones || item.sections || [
                {
                    titulo: 'Contenido',
                    contenido: item.excerpt || item.content || 'Contenido no disponible...'
                }
            ],
            createdAt: item.createdAt || item.created_at || new Date().toISOString()
        };
    }

    /**
     * Get default image for category
     * @param {string} category - Post category
     * @returns {string} Default image URL
     */
    getDefaultImageForCategory(category) {
        const images = {
            'roblox': 'https://via.placeholder.com/400x250/667eea/ffffff?text=Roblox',
            'free-fire': 'https://via.placeholder.com/400x250/ef4444/ffffff?text=Free+Fire',
            'codigos': 'https://via.placeholder.com/400x250/10b981/ffffff?text=Code',
            'diamantes': 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=Diamantes',
            'default': 'https://via.placeholder.com/400x250/6b7280/ffffff?text=Gaming'
        };
        
        return images[category] || images.default;
    }

    /**
     * Get single post by ID
     * @param {string} postId - Post ID
     * @returns {Promise<Object>} Post data
     */
    async getPost(postId) {
        try {
            const endpoint = `${APP_CONFIG.API.ENDPOINTS.POSTS}/${postId}`;
            return await apiClient.get(endpoint);
        } catch (error) {
            console.error(`Error fetching post ${postId}:`, error);
            throw error;
        }
    }

    /**
     * Search posts using the title parameter (specific endpoint format)
     * @param {string} title - Search query for title
     * @param {number} page - Page number (default: 1)
     * @param {number} pageSize - Items per page (default: 10)
     * @returns {Promise<Object>} Search results
     */
    async searchPostsByTitle(title, page = 1, pageSize = 3) {
        try {
            // Use the specific endpoint format: /post?page=1&pageSize=10&tittle=nombre
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                title: title // Note: Using "tittle" as specified in the requirement
            });

            const endpoint = `${APP_CONFIG.API.ENDPOINTS.POSTS}?${params}`;
            const response = await apiClient.get(endpoint);
            
            // Normalize response to expected format
            return this.normalizeAPIResponse(response, page, pageSize);

        } catch (error) {
            console.error('Error searching posts by title:', error);
            throw error;
        }
    }

    /**
     * Search posts
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results
     */
    async searchPosts(query, options = {}) {
        try {
            const {
                page = 1,
                pageSize = APP_CONFIG.API.DEFAULT_PAGE_SIZE,
                category = null
            } = options;

            const params = new URLSearchParams({
                q: query,
                page: page.toString(),
                pageSize: pageSize.toString()
            });

            if (category) {
                params.append('category', category);
            }

            const endpoint = `${APP_CONFIG.API.ENDPOINTS.SEARCH}?${params}`;
            return await apiClient.get(endpoint);

        } catch (error) {
            console.error('Error searching posts:', error);
            throw error;
        }
    }

    /**
     * Get posts by category
     * @param {string} category - Category name
     * @param {number} page - Page number
     * @param {number} pageSize - Items per page
     * @returns {Promise<Object>} Category posts
     */
    async getPostsByCategory(category, page = 1, pageSize = APP_CONFIG.API.DEFAULT_PAGE_SIZE) {
        return this.getPosts(page, pageSize, { category });
    }
}

// Create singleton instance
const postsAPI = new PostsAPI();

// Export API instance and methods
export default postsAPI;

// Convenience exports
export const getPosts = (page, pageSize, filters) => postsAPI.getPosts(page, pageSize, filters);
export const getPost = (postId) => postsAPI.getPost(postId);
export const searchPosts = (query, options) => postsAPI.searchPosts(query, options);
export const searchPostsByTitle = (title, page, pageSize) => postsAPI.searchPostsByTitle(title, page, pageSize);
export const getPostsByCategory = (category, page, pageSize) => postsAPI.getPostsByCategory(category, page, pageSize);
