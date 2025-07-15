/**
 * Post Detail Page Module
 * @fileoverview Handles post detail page functionality and rendering
 */

import { APP_CONFIG } from './config/constants.js';
import apiClient from './api/api-client.js';
import { showError, showSuccess } from './modules/notifications.js';
import { formatDate, truncateText } from './utils/helpers.js';
import { $, createElement } from './utils/dom-helpers.js';

class PostDetailManager {
    constructor() {
        this.postId = null;
        this.postData = null;
        this.isLoading = false;
        
        this.elements = {
            loadingState: $('#loading-state'),
            errorState: $('#error-state'),
            postContent: $('#post-content'),
            relatedPosts: $('#related-posts'),
            relatedPostsContainer: $('#related-posts-container'),
            categoryBreadcrumb: $('#category-breadcrumb'),
            postBreadcrumb: $('#post-breadcrumb')
        };

        this.init();
    }

    /**
     * Initialize the post detail page
     */
    async init() {
        try {
            // Extract post ID from URL
            this.postId = this.getPostIdFromURL();
            
            if (!this.postId) {
                this.showErrorState('No se especificó un ID de post válido.');
                return;
            }

            console.log(`🔍 Loading post with ID: ${this.postId}`);
            
            // Load post content
            await this.loadPostContent();
            
        } catch (error) {
            console.error('Error initializing post detail page:', error);
            this.showErrorState('Error al cargar la página del artículo.');
        }
    }

    /**
     * Extract post ID parameter from URL
     * @returns {string|null} Post ID
     */
    getPostIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    /**
     * Load post content from API
     */
    async loadPostContent() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoadingState();

            console.log(`🔄 Fetching post data for ID: ${this.postId}`);

            // Fetch post data from API
            const response = await apiClient.get(`/post/${this.postId}`);
            
            console.log('📡 Post API Response:', response);

            // Handle different response formats
            this.postData = response.data || response;

            if (!this.postData) {
                throw new Error('No se encontraron datos del post');
            }

            // Render post content
            this.renderPostContent();
            
            // Update page metadata
            this.updatePageMetadata();
            
            // Load related posts
            await this.loadRelatedPosts();

        } catch (error) {
            console.error('❌ Error loading post content:', error);
            this.showErrorState('Error al cargar el contenido del artículo. Por favor, intenta de nuevo.');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Render post content
     */
    renderPostContent() {
        if (!this.postData) return;

        const { _id, title, category, image, createdAt, secciones = [] } = this.postData;

        // Create post article HTML
        const postHTML = `
            <article class="post-article" itemscope itemtype="http://schema.org/Article">
                <!-- Post header -->
                <header class="post-header">
                    <div class="post-meta">
                        <span class="post-category" data-category="${category}">
                            ${this.getCategoryDisplayName(category)}
                        </span>
                        <time class="post-date" datetime="${createdAt}" itemprop="datePublished">
                            ${formatDate(createdAt)}
                        </time>
                    </div>
                    
                    <h1 class="post-title" itemprop="headline">${title}</h1>
                </header>

                <!-- Featured image -->
                <figure class="post-featured-image" itemprop="image" itemscope itemtype="http://schema.org/ImageObject">
                    <img src="${image || APP_CONFIG.UI.DEFAULT_IMAGE}" 
                         alt="${title}" 
                         class="post-image"
                         itemprop="url">
                    <meta itemprop="width" content="1200">
                    <meta itemprop="height" content="630">
                </figure>

                <!-- Post content -->
                <div class="post-body" itemprop="articleBody">
                    ${this.renderPostSections(secciones)}
                </div>

                <!-- Post footer with metadata -->
                <footer class="post-footer">
                    <div class="post-tags">
                        <span class="tag">${this.getCategoryDisplayName(category)}</span>
                    </div>
                    
                    <div class="post-actions">
                        <button class="btn btn-outline share-btn" data-post-id="${_id}" title="Compartir artículo">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            Compartir
                        </button>
                        
                        <a href="category.html?category=${category}" class="btn btn-primary">
                            Ver más de ${this.getCategoryDisplayName(category)}
                        </a>
                    </div>
                </footer>
            </article>
        `;

        // Insert content into container
        this.elements.postContent.innerHTML = postHTML;
        
        // Show post content
        this.hideLoadingState();
        this.elements.postContent.style.display = 'block';

        // Bind events
        this.bindPostEvents();
    }

    /**
     * Render post sections
     * @param {Array} secciones - Array of post sections
     * @returns {string} HTML for post sections
     */
    renderPostSections(secciones) {
        if (!secciones || secciones.length === 0) {
            return '<p>Este artículo no tiene contenido disponible.</p>';
        }

        return secciones.map((seccion, index) => {
            const { titulo, contenido } = seccion;
            
            return `
                <section class="post-section" data-section-index="${index}">
                    <h2 class="section-title">${titulo}</h2>
                    <div class="section-content">
                        ${this.formatSectionContent(contenido)}
                    </div>
                </section>
            `;
        }).join('');
    }

    /**
     * Format section content (convert line breaks, etc.)
     * @param {string} content - Raw content
     * @returns {string} Formatted content
     */
    formatSectionContent(content) {
        if (!content) return '';
        
        // Convert line breaks to paragraphs
        return content
            .split('\n\n')
            .filter(paragraph => paragraph.trim())
            .map(paragraph => `<p>${paragraph.trim()}</p>`)
            .join('');
    }

    /**
     * Update page metadata
     */
    updatePageMetadata() {
        if (!this.postData) return;

        const { title, category, image, createdAt } = this.postData;
        const categoryDisplayName = this.getCategoryDisplayName(category);

        // Update document title
        document.title = `${title} - PIXEL SAN`;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = `${truncateText(title, 150)} - ${categoryDisplayName} en PIXEL SAN`;
        }

        // Update Open Graph meta tags
        this.updateOpenGraphTags(title, image, categoryDisplayName);

        // Update breadcrumb
        this.updateBreadcrumb(category, categoryDisplayName, title);
    }

    /**
     * Update Open Graph meta tags
     * @param {string} title - Post title
     * @param {string} image - Post image
     * @param {string} categoryDisplayName - Category display name
     */
    updateOpenGraphTags(title, image, categoryDisplayName) {
        const ogTitle = document.querySelector('meta[property="og:title"]') || 
                       this.createMetaTag('property', 'og:title');
        const ogDescription = document.querySelector('meta[property="og:description"]') || 
                             this.createMetaTag('property', 'og:description');
        const ogImage = document.querySelector('meta[property="og:image"]') || 
                       this.createMetaTag('property', 'og:image');
        const ogUrl = document.querySelector('meta[property="og:url"]') || 
                     this.createMetaTag('property', 'og:url');

        ogTitle.content = title;
        ogDescription.content = `${truncateText(title, 150)} - ${categoryDisplayName}`;
        ogImage.content = image || `${window.location.origin}/assets/images/default-og-image.jpg`;
        ogUrl.content = window.location.href;
    }

    /**
     * Create meta tag if it doesn't exist
     * @param {string} attribute - Attribute name (name or property)
     * @param {string} value - Attribute value
     * @returns {HTMLElement} Meta element
     */
    createMetaTag(attribute, value) {
        const meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        document.head.appendChild(meta);
        return meta;
    }

    /**
     * Update breadcrumb navigation
     * @param {string} category - Post category
     * @param {string} categoryDisplayName - Category display name
     * @param {string} postTitle - Post title
     */
    updateBreadcrumb(category, categoryDisplayName, postTitle) {
        if (this.elements.categoryBreadcrumb) {
            this.elements.categoryBreadcrumb.textContent = categoryDisplayName;
            this.elements.categoryBreadcrumb.href = `category.html?category=${category}`;
        }

        if (this.elements.postBreadcrumb) {
            this.elements.postBreadcrumb.textContent = truncateText(postTitle, 50);
        }
    }

    /**
     * Load related posts
     */
    async loadRelatedPosts() {
        try {
            if (!this.postData?.category) return;

            console.log(`🔗 Loading related posts for category: ${this.postData.category}`);

            // Fetch posts from the same category
            const response = await apiClient.get(`/post?category=${this.postData.category}&pageSize=4`);
            const relatedPosts = (response.data?.items || response.items || response)
                .filter(post => post._id !== this.postId)
                .slice(0, 3);

            if (relatedPosts.length > 0) {
                this.renderRelatedPosts(relatedPosts);
                this.elements.relatedPosts.style.display = 'block';
            }

        } catch (error) {
            console.error('Error loading related posts:', error);
            // Don't show error for related posts, just hide the section
        }
    }

    /**
     * Render related posts
     * @param {Array} posts - Array of related posts
     */
    renderRelatedPosts(posts) {
        const relatedPostsHTML = posts.map(post => {
            const { _id, title, image, category, createdAt } = post;
            
            return `
                <article class="related-post-card">
                    <a href="post-detail.html?id=${_id}" class="related-post-link">
                        <figure class="related-post-image">
                            <img src="${image || APP_CONFIG.UI.DEFAULT_IMAGE}" 
                                 alt="${title}"
                                 loading="lazy">
                        </figure>
                        <div class="related-post-content">
                            <span class="related-post-category">${this.getCategoryDisplayName(category)}</span>
                            <h3 class="related-post-title">${truncateText(title, 60)}</h3>
                            <time class="related-post-date">${formatDate(createdAt)}</time>
                        </div>
                    </a>
                </article>
            `;
        }).join('');

        this.elements.relatedPostsContainer.innerHTML = relatedPostsHTML;
    }

    /**
     * Bind post events
     */
    bindPostEvents() {
        // Share button functionality
        const shareBtn = this.elements.postContent.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.handleShare());
        }

        // Smooth scrolling for section links (if any)
        this.elements.postContent.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Handle share functionality
     */
    async handleShare() {
        if (!this.postData) return;

        const shareData = {
            title: this.postData.title,
            text: `Lee este artículo en PIXEL SAN: ${this.postData.title}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showSuccess('Artículo compartido correctamente');
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showSuccess('Enlace copiado al portapapeles');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                showSuccess('Enlace copiado al portapapeles');
            } catch (clipboardError) {
                showError('No se pudo compartir el artículo');
            }
        }
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
        return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        this.elements.loadingState.style.display = 'flex';
        this.elements.errorState.style.display = 'none';
        this.elements.postContent.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        this.elements.loadingState.style.display = 'none';
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showErrorState(message) {
        this.hideLoadingState();
        this.elements.errorState.style.display = 'flex';
        this.elements.postContent.style.display = 'none';
        
        const errorMessage = this.elements.errorState.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PostDetailManager();
});

// Export for potential external use
export default PostDetailManager;
