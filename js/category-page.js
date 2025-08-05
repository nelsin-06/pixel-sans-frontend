/**
 * Category Page Module
 * @fileoverview Handles category page functionality, rendering, and pagination
 */

import { APP_CONFIG } from './config/constants.js';
import { getPosts } from './api/endpoints.js';
import { showSuccess, showError } from './modules/notifications.js';
import { $, createElement, addEventListener } from './utils/dom-helpers.js';
import { formatDate, truncateText } from './utils/helpers.js';

// Import existing modules for theme, navigation, and accessibility
import './modules/theme.js';
import './modules/navigation.js';
import './modules/accessibility.js';

class CategoryPageManager {
    constructor() {
        this.currentCategory = null;
        this.currentPage = 1;
        this.pageSize = APP_CONFIG.API.DEFAULT_PAGE_SIZE;
        this.totalPages = 0;
        this.isLoading = false;
        
        this.elements = {
            categoryTitle: $('#category-title'),
            categoryDescription: $('#category-description'),
            currentCategoryBreadcrumb: $('#category-breadcrumb'),
            contentContainer: $('#category-content'),
            itemsContainer: $('#category-items'),
            loadingState: $('#loading-state'),
            emptyState: $('#empty-state'),
            paginationContainer: $('#pagination-container')
        };

        this.bindEvents();
        this.init();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Bind retry button functionality
        const retryButton = $('#retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    /**
     * Initialize the category page
     */
    async init() {
        try {
            // Extract category from URL
            this.currentCategory = this.getCategoryFromURL();
            
            if (!this.currentCategory) {
                this.showErrorState('Invalid category specified.');
                return;
            }

            // Update page elements with category info
            this.updatePageInfo();
            
            // Load category content
            await this.loadCategoryContent();
            
            // Show success notification when page is fully loaded
            showSuccess(`${APP_CONFIG.MESSAGES.PAGE_LOADED_SUCCESS} - ${this.getCategoryDisplayName(this.currentCategory)}`);
            
        } catch (error) {
            console.error('Error initializing category page:', error);
            showError('Error loading category page.');
            this.showErrorState('Error loading category page.');
        }
    }

    /**
     * Extract category parameter from URL
     * @returns {string|null} Category name
     */
    getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('category');
    }

    /**
     * Update page title, breadcrumb, and description based on category
     */
    updatePageInfo() {
        const categoryDisplayName = this.getCategoryDisplayName(this.currentCategory);
        const categoryDescriptions = {
            'roblox': 'Discover guides, tricks and tips for Roblox. Learn how to get Robux and master the best games.',
            'free-fire': 'Strategies, codes and tips for Free Fire. Improve your gameplay and get the best rewards.',
            'codigos': 'The latest codes for your favorite games. Get free rewards and exclusive content.',
            'diamantes': 'Guides to get free diamonds in your favorite mobile games legally and safely.',
            'valorant': 'Master Valorant with professional strategies, agent guides, and tactical tips.',
            'brawl-stars': 'Dominate Brawl Stars with brawler guides, strategies, and advanced gameplay tips.',
            'gems': 'Complete guides to earn gems and premium currency in popular mobile games.'
        };

        // Update page title
        document.title = `${categoryDisplayName} - PIXEL SAN`;
        
        // Update header elements
        if (this.elements.categoryTitle) {
            this.elements.categoryTitle.textContent = categoryDisplayName;
        }
        
        if (this.elements.categoryDescription) {
            this.elements.categoryDescription.textContent = 
                categoryDescriptions[this.currentCategory] || 'Specialized gaming and technology content.';
        }
        
        if (this.elements.currentCategoryBreadcrumb) {
            this.elements.currentCategoryBreadcrumb.textContent = categoryDisplayName;
        }

        // Set active navigation
        this.setActiveNavigation();
    }

    /**
     * Set active navigation link
     */
    setActiveNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current category link - improved selector
        const categoryLink = document.querySelector(`[href*="category=${this.currentCategory}"]`) ||
                           document.querySelector(`[href="#${this.currentCategory}"]`);
        if (categoryLink) {
            categoryLink.classList.add('active');
        }
    }

    /**
     * Load category content from API
     * @param {number} page - Page number to load
     */
    async loadCategoryContent(page = 1) {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.currentPage = page;
            this.showLoadingState();

            console.log(`🔄 Loading category: ${this.currentCategory}, page: ${page}, pageSize: ${this.pageSize}`);

            // Call existing getPosts function with category filter
            const response = await getPosts(page, this.pageSize, { 
                category: this.currentCategory 
            });

            console.log('📡 API Response:', response);

            // Check if response has data and items
            if (response && response.data && response.data.items) {
                console.log(`✅ Found ${response.data.items.length} items`);
                if (response.data.items.length > 0) {
                    this.renderContent(response.data);
                } else {
                    this.showEmptyState();
                }
            } else if (response && response.items) {
                // Handle direct items array in response
                console.log(`✅ Found ${response.items.length} items (direct)`);
                if (response.items.length > 0) {
                    this.renderContent(response);
                } else {
                    this.showEmptyState();
                }
            } else {
                console.log('❌ No items found in response');
                this.showEmptyState();
            }

        } catch (error) {
            console.error('❌ Error loading category content:', error);
            
            // Show appropriate error message based on error type
            let errorMessage = APP_CONFIG.MESSAGES.GENERIC_ERROR;
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                errorMessage = APP_CONFIG.MESSAGES.NETWORK_ERROR;
            }
            
            showError(`Error loading ${this.getCategoryDisplayName(this.currentCategory)} content`);
            this.showErrorState(errorMessage);
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    /**
     * Render category content
     * @param {Object} data - API response data
     */
    renderContent(data) {
        console.log('🎨 Rendering content with data:', data);
        
        const { items, totalPages, totalItems, page, hasNextPage, hasPrevPage } = data;
        
        // Store pagination info
        this.totalPages = totalPages;
        this.currentPage = page;

        // Clear existing content in items container
        if (this.elements.itemsContainer) {
            this.elements.itemsContainer.innerHTML = '';
        }

        // Check if we have items to render
        if (!items || items.length === 0) {
            console.log('⚠️ No items to render');
            this.showEmptyState();
            return;
        }

        // Render items
        items.forEach((item, index) => {
            if (item.active !== false) { // Include items that are active or don't have the property
                console.log(`🎯 Rendering item ${index + 1}:`, item);
                const card = this.createPostCard(item, index);
                if (this.elements.itemsContainer && card) {
                    this.elements.itemsContainer.appendChild(card);
                }
            }
        });

        // Show the content container
        if (this.elements.contentContainer) {
            this.elements.contentContainer.style.display = 'block';
        }

        // Create and render pagination
        this.renderPagination(data);

        // Hide empty state if visible
        this.hideEmptyState();

        // Show success message
        showSuccess(`Se cargaron ${items.length} artículos de ${this.getCategoryDisplayName(this.currentCategory)}`);

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Create post card element (reusing pagination logic)
     * @param {Object} post - Post data
     * @param {number} index - Card index for animation delay
     * @returns {Element} Card element
     */
    createPostCard(post, index) {
        console.log("🚀 ~ CategoryPageManager ~ createPostCard ~ post:", post)
        const card = createElement('article', {
            className: 'post-card',
            'data-post-id': post._id || post.id
        });

        // Add animation delay
        card.style.animationDelay = `${index * (APP_CONFIG.UI.ANIMATION_DELAY_INCREMENT || 100)}ms`;

        // Format date and excerpt
        const formattedDate = formatDate ? formatDate(post.createdAt) : new Date(post.createdAt).toLocaleDateString('es-ES');
        const excerpt = this.getPostExcerpt(post);

        card.innerHTML = `
            <div class="post-image">
                <img src="${this.getPostImage(post)}" 
                     alt="${post.title}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250/6b7280/ffffff?text=Gaming'">
            </div>
            
            <div class="post-content">
                <span class="post-category">${this.getCategoryDisplayName(post.category)}</span>
                <h3 class="post-title">
                    <a href="post-detail.html?id=${post._id || post.id}">${post.title}</a>
                </h3>
                <div class="post-meta">
                    <time datetime="${post.createdAt}">${formattedDate}</time>
                    <span class="comments">${post.comments || 0} comentarios</span>
                </div>
                <p class="post-excerpt">${excerpt}</p>
            </div>
        `;

        // Add click handler (but not for links)
        card.addEventListener('click', (e) => {
            // Don't handle click if it's on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            this.handleCardClick(post);
        });

        return card;
    }

    /**
     * Get post excerpt text
     * @param {Object} post - Post data
     * @returns {string} Excerpt text
     */
    getPostExcerpt(post) {
        if (post.excerpt) {
            return truncateText(post.excerpt, 150);
        }
        
        if (post.secciones && post.secciones[0] && post.secciones[0].contenido) {
            return truncateText(post.secciones[0].contenido, 150);
        }
        
        return 'Contenido no disponible...';
    }

    /**
     * Get post image URL
     * @param {Object} post - Post data
     * @returns {string} Image URL
     */
    getPostImage(post) {
        if (post.image) {
            return post.image;
        }
        
        // Return category-specific default image
        const categoryImages = {
            'roblox': 'https://via.placeholder.com/400x250/667eea/ffffff?text=Roblox',
            'free-fire': 'https://via.placeholder.com/400x250/ef4444/ffffff?text=Free+Fire',
            'codigos': 'https://via.placeholder.com/400x250/10b981/ffffff?text=Códigos',
            'diamantes': 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=Diamantes'
        };
        
        return categoryImages[this.currentCategory] || 
               'https://via.placeholder.com/400x250/6b7280/ffffff?text=Gaming';
    }

    /**
     * Get category display name
     * @param {string} category - Category key
     * @returns {string} Display name
     */
    getCategoryDisplayName(category) {
        const categoryNames = {
            'roblox': 'Roblox',
            'free-fire': 'Free Fire',
            'codigos': 'Códigos',
            'diamantes': 'Diamantes'
        };
        return categoryNames[category] || category || 'Gaming';
    }

    /**
     * Handle card click event
     * @param {Object} post - Post data
     */
    handleCardClick(post) {
        console.log(`🖱️ Card clicked, post ID: ${post._id || post.id}`);
        // Redirect to post detail page
        window.location.href = `post-detail.html?id=${post._id || post.id}`;
    }

    /**
     * Render pagination controls
     * @param {Object} data - Pagination data
     */
    renderPagination(data) {
        if (!this.elements.paginationContainer || data.totalPages <= 1) {
            return;
        }

        const { page, totalPages, hasNextPage, hasPrevPage, totalItems } = data;

        const paginationHTML = `
            <div class="pagination-controls">
                <div class="pagination-info">
                    <span class="page-info">
                        Page ${page} of ${totalPages}
                    </span>
                    <span class="items-info">
                        ${totalItems} articles found
                    </span>
                </div>
                <div class="pagination-buttons">
                    <button class="btn-pagination btn-first" 
                            ${!hasPrevPage ? 'disabled' : ''} 
                            title="Primera página">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="11 17 6 12 11 7"></polyline>
                            <polyline points="18 17 13 12 18 7"></polyline>
                        </svg>
                    </button>
                    <button class="btn-pagination btn-prev" 
                            ${!hasPrevPage ? 'disabled' : ''} 
                            title="Página anterior">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div class="page-numbers">
                        ${this.generatePageNumbers(page, totalPages)}
                    </div>
                    <button class="btn-pagination btn-next" 
                            ${!hasNextPage ? 'disabled' : ''} 
                            title="Página siguiente">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <button class="btn-pagination btn-last" 
                            ${!hasNextPage ? 'disabled' : ''} 
                            title="Última página">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="13 17 18 12 13 7"></polyline>
                            <polyline points="6 17 11 12 6 7"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.elements.paginationContainer.innerHTML = paginationHTML;

        // Bind pagination events
        this.bindPaginationEvents();
    }

    /**
     * Generate page number buttons
     * @param {number} currentPage - Current page
     * @param {number} totalPages - Total pages
     * @returns {string} HTML for page numbers
     */
    generatePageNumbers(currentPage, totalPages) {
        const maxVisible = APP_CONFIG.UI.MAX_VISIBLE_PAGES;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        let html = '';
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage;
            html += `
                <button class="btn-page ${isActive ? 'active' : ''}" 
                        data-page="${i}"
                        ${isActive ? 'disabled' : ''}
                        title="Página ${i}">
                    ${i}
                </button>
            `;
        }

        return html;
    }

    /**
     * Bind pagination event listeners
     */
    bindPaginationEvents() {
        const paginationContainer = this.elements.paginationContainer;
        
        // First page
        const firstBtn = paginationContainer.querySelector('.btn-first');
        if (firstBtn) {
            addEventListener(firstBtn, 'click', () => this.loadCategoryContent(1));
        }

        // Previous page
        const prevBtn = paginationContainer.querySelector('.btn-prev');
        if (prevBtn) {
            addEventListener(prevBtn, 'click', () => {
                if (this.currentPage > 1) {
                    this.loadCategoryContent(this.currentPage - 1);
                }
            });
        }

        // Next page
        const nextBtn = paginationContainer.querySelector('.btn-next');
        if (nextBtn) {
            addEventListener(nextBtn, 'click', () => {
                if (this.currentPage < this.totalPages) {
                    this.loadCategoryContent(this.currentPage + 1);
                }
            });
        }

        // Last page
        const lastBtn = paginationContainer.querySelector('.btn-last');
        if (lastBtn) {
            addEventListener(lastBtn, 'click', () => this.loadCategoryContent(this.totalPages));
        }

        // Page number buttons
        const pageButtons = paginationContainer.querySelectorAll('.btn-page');
        pageButtons.forEach(btn => {
            addEventListener(btn, 'click', () => {
                const page = parseInt(btn.dataset.page);
                if (page !== this.currentPage) {
                    this.loadCategoryContent(page);
                }
            });
        });
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        if (this.elements.loadingState) {
            // Clear existing content and create proper loading elements
            this.elements.loadingState.innerHTML = '';
            
            const spinner = createElement('div', { className: 'spinner' });
            const loadingText = createElement('p');
            loadingText.textContent = `${APP_CONFIG.MESSAGES.LOADING_PAGE} ${this.currentPage}...`;
            
            this.elements.loadingState.appendChild(spinner);
            this.elements.loadingState.appendChild(loadingText);
            this.elements.loadingState.style.display = 'block';
        }
        if (this.elements.contentContainer) {
            this.elements.contentContainer.style.opacity = '0.5';
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        if (this.elements.loadingState) {
            this.elements.loadingState.style.display = 'none';
        }
        if (this.elements.contentContainer) {
            this.elements.contentContainer.style.opacity = '1';
        }
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'block';
        }
        if (this.elements.contentContainer) {
            this.elements.contentContainer.style.display = 'none';
        }
        if (this.elements.paginationContainer) {
            this.elements.paginationContainer.innerHTML = '';
        }
    }

    /**
     * Hide empty state
     */
    hideEmptyState() {
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'none';
        }
        if (this.elements.contentContainer) {
            this.elements.contentContainer.style.display = 'block';
        }
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showErrorState(message) {
        showError(message);
        this.hideLoadingState();
        
        if (this.elements.contentContainer) {
            // Clear existing content
            this.elements.contentContainer.innerHTML = '';
            
            // Create error state elements
            const errorContainer = createElement('div', { className: 'error-state' });
            
            const errorTitle = createElement('h3');
            errorTitle.textContent = 'Error';
            
            const errorMessage = createElement('p');
            errorMessage.textContent = message;
            
            const reloadButton = createElement('button', { className: 'btn-primary' });
            reloadButton.textContent = 'Reload Page';
            reloadButton.addEventListener('click', () => window.location.reload());
            
            errorContainer.appendChild(errorTitle);
            errorContainer.appendChild(errorMessage);
            errorContainer.appendChild(reloadButton);
            
            this.elements.contentContainer.appendChild(errorContainer);
        }
    }

    /**
     * Get current category
     * @returns {string} Current category
     */
    getCurrentCategory() {
        return this.currentCategory;
    }

    /**
     * Get current page
     * @returns {number} Current page
     */
    getCurrentPage() {
        return this.currentPage;
    }
}

// Initialize category page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.categoryPageManager = new CategoryPageManager();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    if (window.categoryPageManager) {
        window.categoryPageManager.init();
    }
});

export default CategoryPageManager;
