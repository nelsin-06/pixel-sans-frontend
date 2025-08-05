/**
 * Search Module
 * @fileoverview Handles search functionality including modal, input handling, and results display
 */

import { $, $$ } from '../utils/dom-helpers.js';
import { debounce } from '../utils/helpers.js';
import { APP_CONFIG } from '../config/constants.js';
import notificationManager from './notifications.js';

class SearchManager {
    constructor() {
        this.searchBtn = $('.search-btn');
        this.searchModal = null;
        this.searchInput = null;
        this.searchResults = null;
        this.isSearchOpen = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.addStyles();
    }

    bindEvents() {
        // Search button click
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.toggleSearch());
        }

        // Keyboard shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }
        });
    }

    toggleSearch() {
        if (this.isSearchOpen) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }

    openSearch() {
        this.createSearchModal();
        this.isSearchOpen = true;
        
        // Focus the search input
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.focus();
            }
        }, 100);
    }

    closeSearch() {
        if (this.searchModal) {
            this.searchModal.remove();
            this.searchModal = null;
            this.searchInput = null;
            this.searchResults = null;
        }
        this.isSearchOpen = false;
    }

    createSearchModal() {
        this.searchModal = document.createElement('div');
        this.searchModal.className = 'search-modal';
        this.searchModal.innerHTML = `
            <div class="search-container">
                <input type="text" placeholder="Search articles..." class="search-input" autofocus>
                <button class="search-close" aria-label="Close search">&times;</button>
            </div>
            <div class="search-results"></div>
        `;

        document.body.appendChild(this.searchModal);

        // Get references
        this.searchInput = this.searchModal.querySelector('.search-input');
        this.searchResults = this.searchModal.querySelector('.search-results');
        const searchClose = this.searchModal.querySelector('.search-close');

        // Bind modal events
        searchClose.addEventListener('click', () => this.closeSearch());
        this.searchModal.addEventListener('click', (e) => {
            if (e.target === this.searchModal) {
                this.closeSearch();
            }
        });

        // Bind search input
        this.searchInput.addEventListener('input', debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    async handleSearch(query) {
        if (query.length < 2) {
            this.searchResults.innerHTML = '';
            return;
        }

        this.showSearchLoading();

        try {
            const results = await this.performSearch(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        }
    }

    async performSearch(query) {
        try {
            // Use constants for dynamic URL construction
            const searchParams = new URLSearchParams({
                page: '1',
                pageSize: '3', // Keep the backend pageSize but limit frontend display
                title: query // Note: Using "title" as specified in the requirement
            });
            
            // Construct URL using constants
            const searchUrl = `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS.POSTS}?${searchParams}`;
            
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Normalize the response to expected format
            const results = this.normalizeSearchResults(data, query);
            
            // Limit results to first 3 items as requested
            return results.slice(0, 3);
            
        } catch (error) {
            console.error('Search API error:', error);
            
            // Show error notification
            notificationManager.error('Search error occurred. Please try again.');
            
            // Fallback to mock results (also limited to 3)
            const mockResults = await this.getMockResults(query);
            return mockResults.slice(0, 3);
        }
    }

    normalizeSearchResults(data, query) {
        // Handle the actual API response structure
        let posts = [];
        
        if (data.success && data.data && data.data.items && Array.isArray(data.data.items)) {
            posts = data.data.items;
        } else if (Array.isArray(data)) {
            posts = data;
        } else if (data.posts && Array.isArray(data.posts)) {
            posts = data.posts;
        } else if (data.data && Array.isArray(data.data)) {
            posts = data.data;
        } else if (data.items && Array.isArray(data.items)) {
            posts = data.items;
        }
        
        // Transform API posts to search result format
        return posts.map(post => {
            // Create excerpt from the first section if available
            let excerpt = '';
            if (post.secciones && Array.isArray(post.secciones) && post.secciones.length > 0) {
                // Use summary section if available, otherwise first section
                const summarySection = post.secciones.find(section => 
                    section.titulo && section.titulo.toLowerCase() === 'summary'
                );
                excerpt = summarySection ? 
                    summarySection.contenido.substring(0, 150) + '...' :
                    post.secciones[0].contenido.substring(0, 150) + '...';
            }
            
            return {
                id: post._id,
                title: post.title || 'Untitled',
                url: `post-detail.html?id=${post._id}`, // Navigate to detail page with post ID
                category: this.formatCategory(post.category || 'General'),
                excerpt: excerpt,
                image: post.image || '',
                youtubeChannelName: post.youtubeChannelName || ''
            };
        });
    }

    formatCategory(categoryString) {
        // Handle comma-separated categories from API
        if (!categoryString) return 'General';
        
        const categories = categoryString.split(',').map(cat => cat.trim());
        // Return the first category, properly formatted
        const firstCategory = categories[0];
        
        // Capitalize first letter of each word
        return firstCategory.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    /**
     * Convert category code to English name for API requests
     * @param {string} categoryCode - Internal category code
     * @returns {string} English category name for API
     */
    convertCategoryToEnglish(categoryCode) {
        if (!categoryCode) return categoryCode;
        
        // Use the mapping from constants
        return APP_CONFIG.CATEGORY_TO_ENGLISH?.[categoryCode] || categoryCode;
    }

    getMockResults(query) {
        // Mock search results as fallback
        const mockResults = [
            { 
                title: 'Definitive Guide: What are Robux and How are they Used in Roblox?', 
                url: '#article-1',
                category: 'Roblox',
                excerpt: 'Robux are the official virtual currency used on the Roblox gaming platform...'
            },
            { 
                title: 'Foolproof Methods to Earn More Robux', 
                url: '#article-2',
                category: 'Roblox',
                excerpt: 'Discover the best legitimate methods to get Robux in Roblox...'
            },
            { 
                title: 'Updated Free Fire Codes January 2025', 
                url: '#article-3',
                category: 'Free Fire',
                excerpt: 'The latest codes for Free Fire that will let you get diamonds...'
            },
            { 
                title: 'Complete Diamonds Guide in Free Fire', 
                url: '#article-4',
                category: 'Free Fire',
                excerpt: 'Everything you need to know about diamonds in Free Fire...'
            },
            { 
                title: 'Valorant Pro Tips and Tricks', 
                url: '#article-5',
                category: 'Valorant',
                excerpt: 'Master Valorant with these professional tips and strategies...'
            },
            { 
                title: 'Brawl Stars: Best Brawlers Guide', 
                url: '#article-6',
                category: 'Brawl Stars',
                excerpt: 'Discover the most powerful brawlers and how to use them effectively...'
            }
        ];

        // Simulate API delay
        return new Promise(resolve => {
            setTimeout(() => {
                const filteredResults = mockResults.filter(item => 
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                    item.category.toLowerCase().includes(query.toLowerCase())
                );
                resolve(filteredResults);
            }, 300);
        });
    }

    displaySearchResults(results) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            const noResultsElement = document.createElement('div');
            noResultsElement.className = 'search-no-results';
            
            const message = document.createElement('p');
            message.textContent = 'No results found';
            
            const subMessage = document.createElement('small');
            subMessage.textContent = 'Try different search terms or keywords';
            
            noResultsElement.appendChild(message);
            noResultsElement.appendChild(subMessage);
            
            this.searchResults.innerHTML = '';
            this.searchResults.appendChild(noResultsElement);
            return;
        }

        // Clear existing results
        this.searchResults.innerHTML = '';
        
        // Ensure we only show maximum 3 results
        const limitedResults = results.slice(0, 3);
        
        limitedResults.forEach(item => {
            const resultElement = document.createElement('a');
            resultElement.href = item.url;
            resultElement.className = 'search-result';
            resultElement.setAttribute('data-category', item.category);
            resultElement.setAttribute('data-id', item.id || '');
            
            // Add image if available
            if (item.image) {
                const imageElement = document.createElement('div');
                imageElement.className = 'search-result-image';
                imageElement.style.backgroundImage = `url(${item.image})`;
                resultElement.appendChild(imageElement);
            }
            
            const contentContainer = document.createElement('div');
            contentContainer.className = 'search-result-content';
            
            const categoryElement = document.createElement('div');
            categoryElement.className = 'search-result-category';
            categoryElement.textContent = item.category;
            
            const titleElement = document.createElement('div');
            titleElement.className = 'search-result-title';
            titleElement.innerHTML = this.highlightQuery(item.title);
            
            const excerptElement = document.createElement('div');
            excerptElement.className = 'search-result-excerpt';
            excerptElement.innerHTML = this.highlightQuery(item.excerpt);
            
            // Add channel name if available
            if (item.youtubeChannelName) {
                const channelElement = document.createElement('div');
                channelElement.className = 'search-result-channel';
                channelElement.textContent = `By: ${item.youtubeChannelName}`;
                contentContainer.appendChild(channelElement);
            }
            
            contentContainer.appendChild(categoryElement);
            contentContainer.appendChild(titleElement);
            contentContainer.appendChild(excerptElement);
            resultElement.appendChild(contentContainer);
            
            // Add click handler for navigation
            resultElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSearch();
                
                // Navigate to the detailed view
                window.location.href = item.url;
            });
            
            this.searchResults.appendChild(resultElement);
        });

        // Show success notification
        notificationManager.success(`Search completed - ${limitedResults.length} results found`);
    }

    highlightQuery(text) {
        if (!this.searchInput) return text;
        
        const query = this.searchInput.value.trim();
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showSearchLoading() {
        if (!this.searchResults) return;
        
        // Create loading element with proper DOM structure
        const loadingElement = document.createElement('div');
        loadingElement.className = 'search-loading';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const message = document.createElement('p');
        message.textContent = 'Searching...';
        
        loadingElement.appendChild(spinner);
        loadingElement.appendChild(message);
        
        this.searchResults.innerHTML = '';
        this.searchResults.appendChild(loadingElement);
    }

    showSearchError() {
        if (!this.searchResults) return;
        
        const errorElement = document.createElement('div');
        errorElement.className = 'search-error';
        
        const icon = document.createElement('p');
        icon.textContent = '❌ Search Error';
        
        const message = document.createElement('small');
        message.textContent = 'Unable to fetch results. Please try again later.';
        
        errorElement.appendChild(icon);
        errorElement.appendChild(message);
        
        this.searchResults.innerHTML = '';
        this.searchResults.appendChild(errorElement);
    }

    addStyles() {
        const styles = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                z-index: 1000;
                backdrop-filter: blur(5px);
            }
            
            .search-container {
                background: var(--bg-primary);
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .search-input {
                flex: 1;
                padding: 0.75rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius);
                font-size: 1rem;
                background: var(--bg-primary);
                color: var(--text-primary);
            }
            
            .search-input:focus {
                border-color: var(--primary-color);
                outline: none;
            }
            
            .search-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0.5rem;
                border-radius: var(--border-radius);
            }
            
            .search-close:hover {
                background: var(--bg-secondary);
            }
            
            .search-results {
                background: var(--bg-primary);
                max-height: 400px;
                overflow-y: auto;
                padding: 1rem;
            }
            
            .search-result {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                color: var(--text-primary);
                text-decoration: none;
                border-radius: var(--border-radius);
                margin-bottom: 0.5rem;
                border: 1px solid var(--border-color);
                transition: var(--transition);
            }
            
            .search-result:hover {
                background: var(--bg-secondary);
                border-color: var(--primary-color);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .search-result-image {
                width: 80px;
                height: 60px;
                background-size: cover;
                background-position: center;
                border-radius: var(--border-radius);
                flex-shrink: 0;
                background-color: var(--bg-secondary);
                border: 1px solid var(--border-color);
            }
            
            .search-result-content {
                flex: 1;
                min-width: 0;
            }
            
            .search-result-category {
                font-size: 0.75rem;
                color: var(--primary-color);
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 0.25rem;
            }
            
            .search-result-title {
                font-weight: 600;
                margin-bottom: 0.5rem;
                line-height: 1.3;
                font-size: 0.95rem;
            }
            
            .search-result-excerpt {
                font-size: 0.85rem;
                color: var(--text-secondary);
                line-height: 1.4;
                margin-bottom: 0.25rem;
            }
            
            .search-result-channel {
                font-size: 0.75rem;
                color: var(--text-tertiary);
                font-style: italic;
                margin-bottom: 0.25rem;
            }
            
            .search-no-results,
            .search-loading,
            .search-error {
                text-align: center;
                padding: 2rem;
                color: var(--text-secondary);
            }
            
            .search-loading .loading-spinner {
                width: 2rem;
                height: 2rem;
                border: 2px solid var(--border-color);
                border-top: 2px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .search-result mark {
                background: var(--primary-color);
                color: white;
                padding: 0.1em 0.2em;
                border-radius: 0.2em;
            }
            
            /* Responsive styles for mobile */
            @media (max-width: 768px) {
                .search-modal {
                    padding: 0;
                }
                
                .search-container {
                    padding: 0.75rem;
                }
                
                .search-input {
                    font-size: 16px; /* Prevent zoom on iOS */
                }
                
                .search-results {
                    padding: 0.75rem;
                    max-height: 60vh;
                }
                
                .search-result {
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .search-result-image {
                    width: 100%;
                    height: 120px;
                    align-self: center;
                }
                
                .search-result-content {
                    text-align: left;
                }
                
                .search-result-title {
                    font-size: 0.9rem;
                    line-height: 1.2;
                }
                
                .search-result-excerpt {
                    font-size: 0.8rem;
                }
            }
        `;

        if (!document.querySelector('#search-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'search-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Initialize and export
const searchManager = new SearchManager();
export default searchManager;
