/**
 * Mobile Menu Handler
 * @fileoverview Handles mobile navigation menu functionality
 */

class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.body = document.body;

        this.bindEvents();
    }

    bindEvents() {
        // Toggle mobile menu
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when clicking overlay
        if (this.mobileNavOverlay) {
            this.mobileNavOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileNavOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Close menu when clicking nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.body.classList.contains('mobile-menu-open')) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.body.classList.contains('mobile-menu-open')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.body.classList.contains('mobile-menu-open')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.body.classList.add('mobile-menu-open');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        this.body.style.overflow = 'hidden';
        
        // Focus trap
        const firstFocusableElement = this.mobileNavOverlay.querySelector('.mobile-nav-link');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }

    closeMobileMenu() {
        this.body.classList.remove('mobile-menu-open');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        this.body.style.overflow = '';
        
        // Return focus to toggle button
        this.mobileMenuToggle.focus();
    }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});

export default MobileMenu;
