/**
 * Navigation Module
 * @fileoverview Handles mobile navigation, menu interactions, and navigation state
 */

import { APP_CONFIG } from '../config/constants.js';
import { $ } from '../utils/dom-helpers.js';

export class NavigationManager {
    constructor() {
        this.activeLink = null;
        this.init();
    }

    /**
     * Initialize navigation system
     */
    init() {
        this.setupMobileMenu();
        this.setupNavigation();
    }

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const menuToggle = $(APP_CONFIG.SELECTORS.MENU_TOGGLE);
        const navMenu = $(APP_CONFIG.SELECTORS.NAV_MENU);
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }

    /**
     * Setup navigation links
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll(APP_CONFIG.SELECTORS.NAV_LINK);
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Get the href to determine if it's a category link
                const href = link.getAttribute('href');
                
                // If we're on a category page and the link has a proper href, don't prevent default
                if (window.location.pathname.includes('category.html') && 
                    (href.includes('category.html') || href === 'index.html')) {
                    // Let the browser handle the navigation normally
                    return;
                }
                
                // Only prevent default for hash links on main page
                if (href.startsWith('#')) {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    navLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    this.activeLink = link;
                    
                    // Handle category navigation
                    this.handleCategoryClick(link);
                }
            });
        });
    }

    /**
     * Handle category link clicks
     * @param {Element} link - Clicked link element
     */
    handleCategoryClick(link) {
        const href = link.getAttribute('href');
        const category = href.replace('#', '');
        
        // If it's "inicio", stay on the main page
        if (category === 'inicio') {
            // Reload main page content or scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // For other categories, navigate to category page
        this.navigateToCategory(category);
    }

    /**
     * Navigate to category page
     * @param {string} category - Category identifier
     */
    navigateToCategory(category) {
        // Map hash category names to proper category page names
        const categoryMap = {
            'inicio': 'home',
            'roblox': 'roblox',
            'free-fire': 'free-fire',
            'codigos': 'codigos',
            'diamantes': 'diamantes',
            'gems': 'gems',
            'valorant': 'valorant',
            'brawl-stars': 'brawl-stars'
        };
        
        const mappedCategory = categoryMap[category] || category;
        
        // Build the URL for the category page
        const categoryUrl = `category.html?category=${mappedCategory}`;
        
        // Navigate to the category page
        window.location.href = categoryUrl;
    }
}

// Create singleton instance
const navigationManager = new NavigationManager();

// Export navigation manager and convenience functions
export default navigationManager;

export const toggleMenu = () => navigationManager.toggleMobileMenu();
export const openMenu = () => navigationManager.openMenu();
export const closeMenu = () => navigationManager.closeMenu();
export const isMenuOpen = () => navigationManager.isOpen();
