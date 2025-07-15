/**
 * Main Application Entry Point
 * @fileoverview Initializes and coordinates all application modules
 */

import { APP_CONFIG } from './config/constants.js';
import themeManager from './modules/theme.js';
import navigationManager from './modules/navigation.js';
import notificationManager from './modules/notifications.js';
import PaginationManager from './api/pagination.js';
import { $ } from './utils/dom-helpers.js';

// Import other modules
import searchManager from './modules/search.js';
import robuxManager from './modules/robux.js';
import scrollEffectsManager from './modules/scroll-effects.js';
import accessibilityManager from './modules/accessibility.js';

class Application {
    constructor() {
        this.managers = {
            theme: themeManager,
            navigation: navigationManager,
            notifications: notificationManager,
            search: searchManager,
            robux: robuxManager,
            scrollEffects: scrollEffectsManager,
            accessibility: accessibilityManager,
            pagination: null
        };

        this.state = {
            initialized: false,
            modules: new Set()
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize core managers (already auto-initialized)
            this.state.modules.add('theme');
            this.state.modules.add('navigation');
            this.state.modules.add('notifications');
            this.state.modules.add('search');
            this.state.modules.add('robux');
            this.state.modules.add('scrollEffects');
            this.state.modules.add('accessibility');

            // Initialize pagination
            await this.initializePagination();

            // Initialize other modules
            this.initializeEventListeners();
            this.setupGlobalErrorHandling();

            this.state.initialized = true;

            // Dispatch application ready event
            this.dispatchReadyEvent();

        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize pagination manager
     */
    async initializePagination() {
        try {
            this.managers.pagination = new PaginationManager({
                container: APP_CONFIG.SELECTORS.ANNOUNCEMENTS,
                pageSize: 6,
                maxVisiblePages: 5,
                autoScroll: true,
                showInfo: true
            });

            this.state.modules.add('pagination');

        } catch (error) {
            console.error('❌ Failed to initialize pagination:', error);
            throw error;
        }
    }

    /**
     * Initialize global event listeners
     */
    initializeEventListeners() {
        // Handle refresh button
        const refreshBtn = $('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }

        // Handle card clicks
        document.addEventListener('cardclick', (e) => {
            this.handleCardClick(e.detail.post);
        });

        // Handle page changes
        document.addEventListener('pagechange', (e) => {
            this.handlePageChange(e.detail);
        });

        // Handle theme changes
        document.addEventListener('themechange', (e) => {
            this.handleThemeChange(e.detail);
        });

        // Handle menu events
        document.addEventListener('menuopen', () => {
            // Mobile menu opened
        });

        document.addEventListener('menuclose', () => {
            // Mobile menu closed
        });

        // Handle visibility change (for performance)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.managers.notifications.error(
                'Se produjo un error inesperado. Por favor, recarga la página.',
                { persistent: true }
            );
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            this.managers.notifications.error(
                'Se produjo un error. Algunos elementos pueden no funcionar correctamente.'
            );
        });
    }

    /**
     * Handle card click events
     * @param {Object} post - Post data
     */
    handleCardClick(post) {
        console.log(`🖱️ Post card clicked, redirecting to post detail: ${post._id || post.id}`);
        // Redirect to post detail page
        window.location.href = `post-detail.html?id=${post._id || post.id}`;
    }

    /**
     * Handle page change events
     * @param {Object} detail - Page change details
     */
    handlePageChange(detail) {
        // Update page title
        this.updatePageTitle(detail.page);
        
        // Track page view (analytics)
        this.trackPageView(detail.page);
    }

    /**
     * Handle theme change events
     * @param {Object} detail - Theme change details
     */
    handleThemeChange(detail) {
        // Update meta theme-color
        this.updateThemeColor(detail.isDark);
    }

    /**
     * Handle visibility change (tab switching)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause any animations or timers
        } else {
            // Resume animations or timers
        }
    }

    /**
     * Update page title with current page info
     * @param {number} page - Current page number
     */
    updatePageTitle(page) {
        const baseTitle = 'PIXEL SAN - Juegos, Tecnología y más';
        document.title = page > 1 ? `${baseTitle} - Página ${page}` : baseTitle;
    }

    /**
     * Update theme color meta tag
     * @param {boolean} isDark - Whether dark theme is active
     */
    updateThemeColor(isDark) {
        let themeColorMeta = $('meta[name="theme-color"]');
        
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        themeColorMeta.content = isDark ? '#111827' : '#ffffff';
    }

    /**
     * Track page view for analytics
     * @param {number} page - Page number
     */
    trackPageView(page) {
        // Add your analytics tracking here
        // Example: gtag('event', 'page_view', { page_title: `Page ${page}` });
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Initialization error
     */
    handleInitializationError(error) {
        // Show fallback error message
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            z-index: 9999;
            max-width: 400px;
        `;
        errorMessage.innerHTML = `
            <h3>Error de Inicialización</h3>
            <p>La aplicación no pudo iniciarse correctamente.</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #ef4444;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
            ">Recargar Página</button>
        `;
        
        document.body.appendChild(errorMessage);
    }

    /**
     * Dispatch application ready event
     */
    dispatchReadyEvent() {
        const event = new CustomEvent('appinitalized', {
            detail: {
                managers: this.managers,
                modules: Array.from(this.state.modules),
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get application state
     * @returns {Object} Application state
     */
    getState() {
        return {
            ...this.state,
            managers: Object.keys(this.managers),
            modules: Array.from(this.state.modules)
        };
    }

    /**
     * Refresh application data
     */
    async refresh() {
        if (this.managers.pagination) {
            await this.managers.pagination.refresh();
        }
        
        this.managers.notifications.success('Contenido actualizado');
    }

    /**
     * Cleanup application resources
     */
    destroy() {
        Object.values(this.managers).forEach(manager => {
            if (manager && typeof manager.destroy === 'function') {
                manager.destroy();
            }
        });
    }
}

// Create and initialize application instance
const app = new Application();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for global access
window.PixelSanApp = app;

// Export for module usage
export default app;

// Export refresh function for global access
window.refreshCards = () => app.refresh();
