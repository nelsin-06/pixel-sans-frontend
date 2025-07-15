/**
 * Pagination Module
 * @fileoverview Advanced pagination component with full functionality
 */

import { APP_CONFIG } from '../config/constants.js';
import { getPosts } from './endpoints.js';
import { showSuccess, showError } from '../modules/notifications.js';
import { $, createElement, addEventListener, scrollToElement } from '../utils/dom-helpers.js';
import { formatDate, truncateText } from '../utils/helpers.js';

class PaginationManager {
    constructor(config = {}) {
        this.config = {
            container: config.container || APP_CONFIG.SELECTORS.ANNOUNCEMENTS,
            paginationContainer: config.paginationContainer || APP_CONFIG.SELECTORS.PAGINATION_CONTAINER,
            pageSize: config.pageSize || APP_CONFIG.API.DEFAULT_PAGE_SIZE,
            maxVisiblePages: config.maxVisiblePages || APP_CONFIG.UI.MAX_VISIBLE_PAGES,
            autoScroll: config.autoScroll !== false,
            showInfo: config.showInfo !== false,
            ...config
        };

        this.state = {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
            isLoading: false,
            filters: {}
        };

        this.elements = {
            container: null,
            paginationContainer: null,
            loadingElement: null,
            errorElement: null
        };

        this.cleanupFunctions = [];
        
        this.init();
    }

    /**
     * Initialize pagination system
     */
    async init() {
        this.findElements();
        this.createPaginationContainer();
        await this.loadPage(1);
    }

    /**
     * Find required DOM elements
     */
    findElements() {
        this.elements.container = $(this.config.container);
        this.elements.paginationContainer = $(this.config.paginationContainer);

        if (!this.elements.container) {
            throw new Error(`Container not found: ${this.config.container}`);
        }
    }

    /**
     * Create pagination controls container
     */
    createPaginationContainer() {
        if (this.elements.paginationContainer) return;

        const paginationHTML = `
            <div class="pagination-controls">
                ${this.config.showInfo ? this.createInfoHTML() : ''}
                <div class="pagination-buttons">
                    <button class="btn-pagination btn-first" title="Primera página" aria-label="Ir a la primera página">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="11 17 6 12 11 7"></polyline>
                            <polyline points="18 17 13 12 18 7"></polyline>
                        </svg>
                    </button>
                    <button class="btn-pagination btn-prev" title="Página anterior" aria-label="Ir a la página anterior">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <div class="page-numbers" role="navigation" aria-label="Páginas"></div>
                    <button class="btn-pagination btn-next" title="Página siguiente" aria-label="Ir a la página siguiente">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <button class="btn-pagination btn-last" title="Última página" aria-label="Ir a la última página">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="13 17 18 12 13 7"></polyline>
                            <polyline points="6 17 11 12 6 7"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        this.elements.container.insertAdjacentHTML('afterend', paginationHTML);
        this.elements.paginationContainer = $('.pagination-controls');
        this.bindPaginationEvents();
    }

    /**
     * Create info section HTML
     * @returns {string} Info HTML
     */
    createInfoHTML() {
        return `
            <div class="pagination-info" role="status" aria-live="polite">
                <span class="page-info">
                    Página <span class="current-page">1</span> de <span class="total-pages">1</span>
                </span>
                <span class="items-info">
                    Mostrando <span class="items-range">1-10</span> de <span class="total-items">0</span> artículos
                </span>
            </div>
        `;
    }

    /**
     * Bind pagination event listeners
     */
    bindPaginationEvents() {
        const buttons = {
            '.btn-first': () => this.goToPage(1),
            '.btn-prev': () => this.goToPage(this.state.currentPage - 1),
            '.btn-next': () => this.goToPage(this.state.currentPage + 1),
            '.btn-last': () => this.goToPage(this.state.totalPages)
        };

        Object.entries(buttons).forEach(([selector, handler]) => {
            const button = this.elements.paginationContainer.querySelector(selector);
            if (button) {
                const cleanup = addEventListener(button, 'click', handler);
                this.cleanupFunctions.push(cleanup);
            }
        });
    }

    /**
     * Load specific page
     * @param {number} page - Page number to load
     */
    async loadPage(page) {
        if (this.state.isLoading || page < 1) return;

        try {
            this.state.isLoading = true;
            this.showLoadingState();

            // Fetch data from API
            const data = await getPosts(page, this.config.pageSize, this.state.filters);
            
            if (data && data.items) {
                this.updateState(data);
                this.renderCards(data.items);
                this.updatePaginationControls();
                this.hideLoadingState();

                if (this.config.autoScroll && page !== 1) {
                    this.scrollToTop();
                }

                showSuccess(`Página ${page} cargada exitosamente`);
                this.dispatchPageChangeEvent(page, data);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error loading page:', error);
            this.showErrorState(error);
            showError('Error al cargar el contenido');
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Update internal state
     * @param {Object} data - API response data
     */
    updateState(data) {
        this.state = {
            ...this.state,
            currentPage: data.page,
            totalPages: data.totalPages,
            totalItems: data.totalItems,
            hasNextPage: data.hasNextPage,
            hasPrevPage: data.hasPrevPage
        };
    }

    /**
     * Render post cards
     * @param {Array} items - Array of post items
     */
    renderCards(items) {
        // Clear existing dynamic cards (keep static featured card)
        const existingCards = this.elements.container.querySelectorAll('.post-card:not(.featured)');
        existingCards.forEach(card => card.remove());

        // Render new cards
        items.forEach((item, index) => {
            if (item.active) {
                const card = this.createCard(item, index);
                this.elements.container.appendChild(card);
            }
        });
    }

    /**
     * Create post card element
     * @param {Object} post - Post data
     * @param {number} index - Card index for animation delay
     * @returns {Element} Card element
     */
    createCard(post, index) {
        const card = createElement('article', {
            className: 'post-card',
            'data-post-id': post._id
        });

        card.style.animationDelay = `${index * APP_CONFIG.UI.ANIMATION_DELAY_INCREMENT}ms`;

        const formattedDate = formatDate(post.createdAt);
        const excerpt = post.secciones && post.secciones[0] 
            ? truncateText(post.secciones[0].contenido)
            : 'Contenido no disponible...';

        card.innerHTML = `
            <div class="post-image">
                <img src="${this.getPostImage(post)}" 
                     alt="${post.title}" 
                     loading="lazy">
            </div>
            
            <div class="post-content">
                <span class="post-category">${this.getCategoryDisplayName(post.category)}</span>
                <h3 class="post-title">
                    <a href="#article-${post._id}">${post.title}</a>
                </h3>
                <div class="post-meta">
                    <time datetime="${post.createdAt}">${formattedDate}</time>
                    <span class="comments">Sin comentarios</span>
                </div>
                <p class="post-excerpt">${excerpt}</p>
            </div>
        `;

        // Add click handler
        const cleanup = addEventListener(card, 'click', () => this.handleCardClick(post));
        this.cleanupFunctions.push(cleanup);

        return card;
    }

    /**
     * Get post image URL
     * @param {Object} post - Post data
     * @returns {string} Image URL
     */
    getPostImage(post) {
        // return post.image || 'https://media.istockphoto.com/id/2175813389/photo/set-of-flaming-torch-isolated-on-white-background.jpg?s=1024x1024&w=is&k=20&c=UDsDucHm39zDcjhDZebZWVx3c2uMpQK2XnYIwJ2BsfM=';
        return 'https://media.istockphoto.com/id/2175813389/photo/set-of-flaming-torch-isolated-on-white-background.jpg?s=1024x1024&w=is&k=20&c=UDsDucHm39zDcjhDZebZWVx3c2uMpQK2XnYIwJ2BsfM=';
    }

    /**
     * Get category display name
     * @param {string} category - Category key
     * @returns {string} Display name
     */
    getCategoryDisplayName(category) {
        return APP_CONFIG.CATEGORY_NAMES[category] || APP_CONFIG.CATEGORY_NAMES.default;
    }

    /**
     * Handle card click event
     * @param {Object} post - Post data
     */
    handleCardClick(post) {
        // Dispatch custom event for card click
        const event = new CustomEvent('cardclick', {
            detail: { post, pagination: this }
        });
        document.dispatchEvent(event);
    }

    /**
     * Update pagination controls
     */
    updatePaginationControls() {
        this.updateInfoDisplay();
        this.updateButtonStates();
        this.updatePageNumbers();
    }

    /**
     * Update pagination info display
     */
    updateInfoDisplay() {
        if (!this.config.showInfo) return;

        const elements = {
            currentPage: this.elements.paginationContainer.querySelector('.current-page'),
            totalPages: this.elements.paginationContainer.querySelector('.total-pages'),
            itemsRange: this.elements.paginationContainer.querySelector('.items-range'),
            totalItems: this.elements.paginationContainer.querySelector('.total-items')
        };

        if (elements.currentPage) {
            elements.currentPage.textContent = this.state.currentPage;
        }
        if (elements.totalPages) {
            elements.totalPages.textContent = this.state.totalPages;
        }
        if (elements.totalItems) {
            elements.totalItems.textContent = this.state.totalItems;
        }
        if (elements.itemsRange) {
            const startItem = (this.state.currentPage - 1) * this.config.pageSize + 1;
            const endItem = Math.min(this.state.currentPage * this.config.pageSize, this.state.totalItems);
            elements.itemsRange.textContent = `${startItem}-${endItem}`;
        }
    }

    /**
     * Update button states
     */
    updateButtonStates() {
        const buttons = {
            '.btn-first': !this.state.hasPrevPage,
            '.btn-prev': !this.state.hasPrevPage,
            '.btn-next': !this.state.hasNextPage,
            '.btn-last': !this.state.hasNextPage
        };

        Object.entries(buttons).forEach(([selector, disabled]) => {
            const button = this.elements.paginationContainer.querySelector(selector);
            if (button) {
                button.disabled = disabled;
                button.setAttribute('aria-disabled', disabled.toString());
            }
        });
    }

    /**
     * Update page number buttons
     */
    updatePageNumbers() {
        const pageNumbersContainer = this.elements.paginationContainer.querySelector('.page-numbers');
        if (!pageNumbersContainer) return;

        pageNumbersContainer.innerHTML = '';

        if (this.state.totalPages <= 1) return;

        const { startPage, endPage } = this.calculatePageRange();

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            this.addPageButton(pageNumbersContainer, 1);
            if (startPage > 2) {
                this.addEllipsis(pageNumbersContainer);
            }
        }

        // Add page numbers in range
        for (let i = startPage; i <= endPage; i++) {
            this.addPageButton(pageNumbersContainer, i);
        }

        // Add ellipsis and last page if needed
        if (endPage < this.state.totalPages) {
            if (endPage < this.state.totalPages - 1) {
                this.addEllipsis(pageNumbersContainer);
            }
            this.addPageButton(pageNumbersContainer, this.state.totalPages);
        }
    }

    /**
     * Calculate visible page range
     * @returns {Object} Start and end page numbers
     */
    calculatePageRange() {
        const half = Math.floor(this.config.maxVisiblePages / 2);
        let startPage = Math.max(1, this.state.currentPage - half);
        let endPage = Math.min(this.state.totalPages, startPage + this.config.maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < this.config.maxVisiblePages) {
            startPage = Math.max(1, endPage - this.config.maxVisiblePages + 1);
        }

        return { startPage, endPage };
    }

    /**
     * Add page number button
     * @param {Element} container - Container element
     * @param {number} pageNumber - Page number
     */
    addPageButton(container, pageNumber) {
        const isActive = pageNumber === this.state.currentPage;
        const button = createElement('button', {
            className: `btn-pagination btn-page ${isActive ? 'active' : ''}`,
            'aria-label': `Ir a la página ${pageNumber}`,
            'aria-current': isActive ? 'page' : 'false'
        }, pageNumber.toString());

        const cleanup = addEventListener(button, 'click', () => this.goToPage(pageNumber));
        this.cleanupFunctions.push(cleanup);

        container.appendChild(button);
    }

    /**
     * Add ellipsis element
     * @param {Element} container - Container element
     */
    addEllipsis(container) {
        const ellipsis = createElement('span', {
            className: 'pagination-ellipsis',
            'aria-hidden': 'true'
        }, '...');
        container.appendChild(ellipsis);
    }

    /**
     * Navigate to specific page
     * @param {number} page - Target page number
     */
    async goToPage(page) {
        if (page < 1 || page > this.state.totalPages || page === this.state.currentPage || this.state.isLoading) {
            return;
        }

        await this.loadPage(page);
    }

    /**
     * Set filters for pagination
     * @param {Object} filters - Filter object
     */
    async setFilters(filters) {
        this.state.filters = { ...filters };
        await this.loadPage(1); // Reset to first page when filters change
    }

    /**
     * Refresh current page
     */
    async refresh() {
        await this.loadPage(this.state.currentPage);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        this.hideErrorState();
        
        if (!this.elements.loadingElement) {
            this.elements.loadingElement = createElement('div', {
                className: 'loading-card'
            }, `
                <div class="loading-spinner"></div>
                <p>Cargando página ${this.state.currentPage}...</p>
            `);
        }

        this.elements.container.appendChild(this.elements.loadingElement);
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        if (this.elements.loadingElement && this.elements.loadingElement.parentNode) {
            this.elements.loadingElement.parentNode.removeChild(this.elements.loadingElement);
        }
    }

    /**
     * Show error state
     * @param {Error} error - Error object
     */
    showErrorState(error) {
        this.hideLoadingState();
        
        this.elements.errorElement = createElement('div', {
            className: 'error-card'
        }, `
            <div class="error-icon">⚠️</div>
            <h3>Error al cargar la página</h3>
            <p>No se pudo cargar la página ${this.state.currentPage}. ${error.message}</p>
            <button class="retry-btn">Reintentar</button>
        `);

        const retryBtn = this.elements.errorElement.querySelector('.retry-btn');
        const cleanup = addEventListener(retryBtn, 'click', () => this.refresh());
        this.cleanupFunctions.push(cleanup);

        this.elements.container.appendChild(this.elements.errorElement);
    }

    /**
     * Hide error state
     */
    hideErrorState() {
        if (this.elements.errorElement && this.elements.errorElement.parentNode) {
            this.elements.errorElement.parentNode.removeChild(this.elements.errorElement);
        }
    }

    /**
     * Scroll to top of content
     */
    scrollToTop() {
        scrollToElement(this.elements.container);
    }

    /**
     * Dispatch page change event
     * @param {number} page - Current page
     * @param {Object} data - Page data
     */
    dispatchPageChangeEvent(page, data) {
        const event = new CustomEvent('pagechange', {
            detail: {
                page,
                data,
                pagination: this
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current state
     * @returns {Object} Current pagination state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Cleanup event listeners and resources
     */
    destroy() {
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        
        if (this.elements.paginationContainer && this.elements.paginationContainer.parentNode) {
            this.elements.paginationContainer.parentNode.removeChild(this.elements.paginationContainer);
        }
    }
}

// Export pagination manager
export default PaginationManager;
