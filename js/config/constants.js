/**
 * Application Constants and Configuration
 * @fileoverview Central configuration file for all app constants
 */

export const APP_CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:8080',
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

    // Categories (internal codes)
    CATEGORIES: {
        GEMS: 'gems', // New category added at top
        ROBLOX: 'roblox',
        FREE_FIRE: 'free-fire',
        CODES: 'codigos',
        DIAMONDS: 'diamantes',
        VALORANT: 'valorant',
        BRAWL_STARS: 'brawl-stars',
        CODE: 'code' // New category added at bottom
    },

    // Category to English Name Mapping (for API requests)
    CATEGORY_TO_ENGLISH: {
        'gems': 'gems',
        'roblox': 'roblox',
        'free-fire': 'free fire', // Remove hyphens
        'codigos': 'codes', // Spanish to English
        'diamantes': 'diamonds', // Spanish to English
        'valorant': 'valorant',
        'brawl-stars': 'brawl stars', // Remove hyphens
        'code': 'code'
    },

    // Category Display Names
    CATEGORY_NAMES: {
        'gems': 'Gems', // New category
        'roblox': 'Roblox',
        'free-fire': 'Free Fire',
        'codigos': 'Codes',
        'diamantes': 'Diamonds',
        'valorant': 'Valorant',
        'brawl-stars': 'Brawl Stars',
        'code': 'Code', // New category
        'default': 'Gaming'
    },

    // Default Images by Category
    CATEGORY_IMAGES: {
        'gems': 'https://via.placeholder.com/400x250/9b59b6/ffffff?text=Gems', // New category
        'roblox': 'https://via.placeholder.com/400x250/667eea/ffffff?text=Roblox',
        'free-fire': 'https://via.placeholder.com/400x250/ef4444/ffffff?text=Free+Fire',
        'codigos': 'https://via.placeholder.com/400x250/10b981/ffffff?text=Codes',
        'diamantes': 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=Diamonds',
        'valorant': 'https://via.placeholder.com/400x250/ff6b6b/ffffff?text=Valorant',
        'brawl-stars': 'https://via.placeholder.com/400x250/4ecdc4/ffffff?text=Brawl+Stars',
        'code': 'https://via.placeholder.com/400x250/34495e/ffffff?text=Code', // New category
        'default': 'https://via.placeholder.com/400x250/6b7280/ffffff?text=Gaming'
    },

    // Notification Messages
    MESSAGES: {
        PAGE_LOADED_SUCCESS: 'Page loaded successfully',
        SEARCH_SUCCESS: 'Search completed',
        SEARCH_ERROR: 'Search failed. Please try again.',
        LOADING_CONTENT: 'Loading content...',
        LOADING_PAGE: 'Loading page',
        NO_RESULTS: 'No results found',
        NETWORK_ERROR: 'Network error. Please check your connection.',
        GENERIC_ERROR: 'Something went wrong. Please try again.'
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
