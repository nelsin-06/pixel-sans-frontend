/**
 * Theme Management Module
 * @fileoverview Handles dark/light theme switching and persistence
 */

import { APP_CONFIG } from '../config/constants.js';
import { $, addEventListener } from '../utils/dom-helpers.js';

class ThemeManager {
    constructor() {
        this.currentTheme = APP_CONFIG.THEME.LIGHT;
        this.toggleButton = null;
        this.mediaQuery = window.matchMedia('prefers-color-scheme: dark');
        
        this.init();
    }

    /**
     * Initialize theme system
     */
    init() {
        this.loadSavedTheme();
        this.bindToggleButton();
        this.listenToSystemChanges();
        this.applyTheme();
    }

    /**
     * Load theme from localStorage or use system preference
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME);
        
        if (savedTheme && Object.values(APP_CONFIG.THEME).includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = this.mediaQuery.matches ? 
                APP_CONFIG.THEME.DARK : 
                APP_CONFIG.THEME.LIGHT;
        }
    }

    /**
     * Bind theme toggle button
     */
    bindToggleButton() {
        this.toggleButton = $(APP_CONFIG.SELECTORS.THEME_TOGGLE);
        
        if (this.toggleButton) {
            addEventListener(this.toggleButton, 'click', () => this.toggle());
            
            // Update button aria-label
            this.updateToggleButton();
        }
    }

    /**
     * Listen to system theme changes
     */
    listenToSystemChanges() {
        this.mediaQuery.addEventListener('change', (e) => {
            // Only apply system changes if no manual theme is set
            if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME)) {
                this.currentTheme = e.matches ? 
                    APP_CONFIG.THEME.DARK : 
                    APP_CONFIG.THEME.LIGHT;
                this.applyTheme();
                this.updateToggleButton();
            }
        });
    }

    /**
     * Apply current theme to document
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Add transition class for smooth theme switching
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remove transition after animation
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);

        // Dispatch theme change event
        this.dispatchThemeChangeEvent();
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        this.currentTheme = this.currentTheme === APP_CONFIG.THEME.LIGHT ? 
            APP_CONFIG.THEME.DARK : 
            APP_CONFIG.THEME.LIGHT;
        
        this.saveTheme();
        this.applyTheme();
        this.updateToggleButton();
    }

    /**
     * Set specific theme
     * @param {string} theme - Theme to set (light/dark)
     */
    setTheme(theme) {
        if (!Object.values(APP_CONFIG.THEME).includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        this.currentTheme = theme;
        this.saveTheme();
        this.applyTheme();
        this.updateToggleButton();
    }

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Check if current theme is dark
     * @returns {boolean} True if dark theme
     */
    isDark() {
        return this.currentTheme === APP_CONFIG.THEME.DARK;
    }

    /**
     * Save theme to localStorage
     */
    saveTheme() {
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, this.currentTheme);
    }

    /**
     * Update toggle button appearance and accessibility
     */
    updateToggleButton() {
        if (!this.toggleButton) return;

        const isDark = this.isDark();
        const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
        
        this.toggleButton.setAttribute('aria-label', label);
        this.toggleButton.setAttribute('title', label);
        
        // Update icon if needed (you can customize this)
        const icon = this.toggleButton.querySelector('svg');
        if (icon) {
            icon.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }

    /**
     * Dispatch custom theme change event
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: this.currentTheme,
                isDark: this.isDark()
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Reset theme to system preference
     */
    resetToSystem() {
        localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.THEME);
        this.currentTheme = this.mediaQuery.matches ? 
            APP_CONFIG.THEME.DARK : 
            APP_CONFIG.THEME.LIGHT;
        this.applyTheme();
        this.updateToggleButton();
    }
}

// Create singleton instance
const themeManager = new ThemeManager();

// Export theme manager and convenience functions
export default themeManager;

export const toggleTheme = () => themeManager.toggle();
export const setTheme = (theme) => themeManager.setTheme(theme);
export const getTheme = () => themeManager.getTheme();
export const isDarkTheme = () => themeManager.isDark();
export const resetTheme = () => themeManager.resetToSystem();
