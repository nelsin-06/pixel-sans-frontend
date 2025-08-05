/**
 * Home Page Controller
 * @fileoverview Manages the home page posts loading and pagination
 */

import { PostsAPI } from './api/endpoints.js';
import { showError, showSuccess } from './modules/notifications.js';

class HomePageManager {
    constructor() {
        this.postsAPI = new PostsAPI();
        this.currentPage = 1;
        this.pageSize = 6; // 6 posts per page as requested
        this.postsContainer = null;
        this.paginationContainer = null;
        this.loadingState = null;
        this.errorState = null;
        
        this.init();
    }

    /**
     * Initialize the home page
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }

    /**
     * Setup DOM elements and load initial posts
     */
    setupElements() {
        this.postsContainer = document.getElementById('posts-container');
        this.paginationContainer = document.getElementById('pagination-container');
        this.loadingState = document.getElementById('loading-state');
        this.errorState = document.getElementById('error-state');
        
        if (!this.postsContainer) {
            console.error('Posts container not found');
            return;
        }

        // Setup retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadPosts());
        }

        // Load initial posts
        this.loadPosts();
    }

    /**
     * Load posts from API
     * @param {number} page - Page number to load
     */
    async loadPosts(page = 1) {
        try {
            this.currentPage = page;
            this.showLoading();

            console.log(`Loading posts - Page: ${page}, Page Size: ${this.pageSize}`);
            
            const response = await this.postsAPI.getPosts(page, this.pageSize);
            
            console.log('Posts response:', response);

            if (response && response.items && response.items.length > 0) {
                this.renderPosts(response.items);
                this.renderPagination(response);
                this.hideLoading();
            } else {
                this.showEmptyState();
            }

        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('Failed to load posts. Please try again.');
        }
    }

    /**
     * Render posts in the container
     * @param {Array} posts - Array of post objects
     */

    renderPosts(posts) {
        if (!this.postsContainer) return;

        // Normalize posts to expected structure
        const normalizedPosts = posts.map(post => ({
            id: post._id,
            title: post.title,
            category: post.category,
            image: post.image,
            date: post.createdAt,
            excerpt: Array.isArray(post.secciones) && post.secciones.length > 0 ? post.secciones[0].contenido : '',
            youtubeChannelName: post.youtubeChannelName || '',
            comments: post.comments || 0
        }));

        this.postsContainer.innerHTML = normalizedPosts.map(post => this.createPostHTML(post)).join('');
    }

    /**
     * Create HTML for a single post
     * @param {Object} post - Post object
     * @returns {string} HTML string
     */
    createPostHTML(post) {
        const postUrl = `post-detail.html?id=${post.id}`;
        const imageUrl = post.image || 'https://placehold.co/400x250?text=No+Image';
        return `
            <article class="post-card" onclick="window.location.href='${postUrl}'">
                <div class="post-image">
                    <img src="${imageUrl}" alt="${post.title}" loading="lazy" onerror="this.src='https://placehold.co/400x250?text=No+Image'">
                </div>
                <div class="post-content">
                    <span class="post-category">${post.category || 'General'}</span>
                    <h3 class="post-title">
                        <a href="${postUrl}">${post.title}</a>
                    </h3>
                    <div class="post-meta">
                        <time datetime="${post.date}">${this.formatDate(post.date)}</time>
                        <span class="comments">${post.comments} comments</span>
                    </div>
                    <p class="post-excerpt">
                        ${post.excerpt ? this.truncateText(post.excerpt, 150) : 'No preview available...'}
                    </p>
                    <a href="${postUrl}" class="post-read-more">Read more</a>
                </div>
            </article>
        `;
    }

    /**
     * Render pagination controls
     * @param {Object} paginationData - Pagination information
     */
    renderPagination(paginationData) {
        if (!this.paginationContainer) return;

        const { page, totalPages, hasPrevPage, hasNextPage } = paginationData;

        if (totalPages <= 1) {
            this.paginationContainer.style.display = 'none';
            return;
        }

        let paginationHTML = '<div class="pagination">';

        // Previous button
        if (hasPrevPage) {
            paginationHTML += `<button class="pagination-btn" onclick="homePageManager.loadPosts(${page - 1})">Previous</button>`;
        }

        // Page numbers
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(totalPages, page + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="homePageManager.loadPosts(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === page ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="homePageManager.loadPosts(${i})">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
            paginationHTML += `<button class="pagination-btn" onclick="homePageManager.loadPosts(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        if (hasNextPage) {
            paginationHTML += `<button class="pagination-btn" onclick="homePageManager.loadPosts(${page + 1})">Next</button>`;
        }

        paginationHTML += '</div>';

        // Add pagination info
        paginationHTML += `
            <div class="pagination-info">
                Showing page ${page} of ${totalPages} (${paginationData.totalItems} total posts)
            </div>
        `;

        this.paginationContainer.innerHTML = paginationHTML;
        this.paginationContainer.style.display = 'block';
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingState) this.loadingState.style.display = 'block';
        if (this.errorState) this.errorState.style.display = 'none';
        if (this.postsContainer) this.postsContainer.innerHTML = '';
        if (this.paginationContainer) this.paginationContainer.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingState) this.loadingState.style.display = 'none';
        if (this.errorState) this.errorState.style.display = 'none';
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        this.hideLoading();
        if (this.errorState) {
            this.errorState.style.display = 'block';
            const errorText = this.errorState.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
        }
        showError(message);
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        this.hideLoading();
        if (this.postsContainer) {
            this.postsContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No posts found</h3>
                    <p>There are no posts available at the moment.</p>
                </div>
            `;
        }
    }

    /**
     * Format date for display
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'No date';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @returns {string} Truncated text
     */
    truncateText(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    }
}

// Initialize home page manager
const homePageManager = new HomePageManager();

// Make it globally available for pagination buttons
window.homePageManager = homePageManager;

export default HomePageManager;
