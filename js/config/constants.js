/**
 * Application Constants and Configuration
 * @fileoverview Central configuration file for all app constants
 */

export const APP_CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://api.pixel-sans.com',
        ENDPOINTS: {
            POSTS: '/post',
            SEARCH: '/search'
        },
        DEFAULT_PAGE_SIZE: 6,
        REQUEST_TIMEOUT: 10000
    },

    // UI Configuration
    UI: {
        MAX_VISIBLE_PAGES: 5,
        NOTIFICATION_DURATION: 3000,
        ANIMATION_DELAY_INCREMENT: 100,
        SCROLL_THROTTLE_DELAY: 100
    },

    // Theme Configuration
    THEME: {
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
    },

    // Storage Keys
    STORAGE_KEYS: {
        THEME: 'pixel-san-theme'
    },

    // CSS Selectors
    SELECTORS: {
        // Navigation
        MENU_TOGGLE: '.menu-toggle',
        NAV_MENU: '.nav-menu',
        NAV_LINK: '.nav-link',
        
        // Theme
        THEME_TOGGLE: '.theme-toggle',
        
        // Search
        SEARCH_BTN: '.search-btn',
        SEARCH_MODAL: '.search-modal',
        
        // Content
        ANNOUNCEMENTS: '.announcements',
        POST_CARD: '.post-card',
        MAIN_CONTENT: '.main-content',
        
        // Robux
        ROBUX_BTN: '.robux-btn',
        ROBUX_OPTIONS: 'input[name="robux"]',
        
        // Pagination
        PAGINATION_CONTAINER: '.pagination-controls'
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        THEME: 'pixelsan-theme',
        USER_PREFERENCES: 'pixelsan-preferences'
    },

    // Categories
    CATEGORIES: {
        ROBLOX: 'roblox',
        FREE_FIRE: 'free-fire',
        CODES: 'codigos',
        DIAMONDS: 'diamantes'
    },

    // Category Display Names
    CATEGORY_NAMES: {
        'roblox': 'Roblox',
        'free-fire': 'Free Fire',
        'codigos': 'Códigos',
        'diamantes': 'Diamantes',
        'default': 'Gaming'
    },

    // Default Images by Category
    CATEGORY_IMAGES: {
        'roblox': 'https://via.placeholder.com/400x250/667eea/ffffff?text=Roblox',
        'free-fire': 'https://via.placeholder.com/400x250/ef4444/ffffff?text=Free+Fire',
        'codigos': 'https://via.placeholder.com/400x250/10b981/ffffff?text=Códigos',
        'diamantes': 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=Diamantes',
        'default': 'https://via.placeholder.com/400x250/6b7280/ffffff?text=Gaming'
    }
};

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

export const KEYBOARD_KEYS = {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    TAB: 'Tab',
    SPACE: ' ',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    CTRL_K: 'k' // Used with ctrlKey
};
