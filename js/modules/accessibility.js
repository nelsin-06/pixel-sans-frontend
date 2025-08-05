/**
 * Accessibility Module
 * @fileoverview Enhances accessibility features and keyboard navigation
 */

import { $, $$ } from '../utils/dom-helpers.js';

class AccessibilityManager {
    constructor() {
        this.focusedElement = null;
        this.isKeyboardNavigating = false;
        this.reducedMotion = false;
        
        this.init();
    }

    init() {
        this.detectReducedMotion();
        this.setupKeyboardNavigation();
        this.createSkipLinks();
        this.enhanceFormAccessibility();
        this.setupFocusManagement();
        this.setupARIALiveRegions();
        this.addAccessibilityStyles();
        this.setupColorContrastDetection();
    }

    detectReducedMotion() {
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }

        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            document.body.classList.toggle('reduced-motion', e.matches);
        });
    }

    setupKeyboardNavigation() {
        // Track keyboard usage
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.isKeyboardNavigating = true;
                document.body.classList.add('keyboard-navigation');
            }

            // Handle escape key globally
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }

            // Handle arrow key navigation
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                this.handleArrowKeys(e);
            }
        });

        // Track mouse usage
        document.addEventListener('mousedown', () => {
            this.isKeyboardNavigating = false;
            document.body.classList.remove('keyboard-navigation');
        });

        // Enhanced navigation for specific elements
        this.setupMenuNavigation();
        this.setupCardNavigation();
    }

    setupMenuNavigation() {
        const navMenu = $('.nav-menu');
        if (!navMenu) return;

        const navLinks = $$('.nav-link', navMenu);
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % navLinks.length;
                        navLinks[nextIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                        navLinks[prevIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        navLinks[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        navLinks[navLinks.length - 1].focus();
                        break;
                }
            });
        });
    }

    setupCardNavigation() {
        const cards = $$('.post-card');
        
        cards.forEach((card, index) => {
            // Make cards focusable
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            // Add role if not present
            if (!card.hasAttribute('role')) {
                card.setAttribute('role', 'article');
            }

            card.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        card.click();
                        break;
                        
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextCard = cards[index + 1];
                        if (nextCard) nextCard.focus();
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevCard = cards[index - 1];
                        if (prevCard) prevCard.focus();
                        break;
                }
            });
        });
    }

    createSkipLinks() {
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';
        skipLinksContainer.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#main-nav" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);

        // Ensure target elements have proper IDs
        this.ensureElementIds();

        // Handle skip link clicks
        $$('.skip-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = $(`#${targetId}`);
                
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    ensureElementIds() {
        // Main content
        const mainContent = $('.main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }

        // Navigation
        const nav = $('.main-nav');
        if (nav && !nav.id) {
            nav.id = 'main-nav';
        }

        // Footer
        const footer = $('.footer');
        if (footer && !footer.id) {
            footer.id = 'footer';
        }
    }

    enhanceFormAccessibility() {
        // Robux selector
        const robuxOptions = $$('input[name="robux"]');
        robuxOptions.forEach((input, index) => {
            const label = input.closest('.robux-option');
            if (label && !label.getAttribute('aria-describedby')) {
                const describerId = `robux-option-desc-${index}`;
                const description = document.createElement('span');
                description.id = describerId;
                description.className = 'sr-only';
                description.textContent = `Opción ${index + 1} de ${robuxOptions.length}`;
                label.appendChild(description);
                input.setAttribute('aria-describedby', describerId);
            }
        });

        // Add fieldset for robux options
        const robuxContainer = $('.robux-options');
        if (robuxContainer && !robuxContainer.closest('fieldset')) {
            const fieldset = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = 'Selecciona la cantidad de Robux';
            legend.className = 'sr-only';
            
            fieldset.appendChild(legend);
            robuxContainer.parentNode.insertBefore(fieldset, robuxContainer);
            fieldset.appendChild(robuxContainer);
        }
    }

    setupFocusManagement() {
        // Save focus when opening modals
        document.addEventListener('focusin', (e) => {
            if (!e.target.closest('.search-modal, .article-modal')) {
                this.focusedElement = e.target;
            }
        });

        // Trap focus in modals
        this.setupModalFocusTrap();
    }

    setupModalFocusTrap() {
        const trapFocus = (modal) => {
            const focusableElements = modal.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });

            // Focus first element
            firstElement.focus();
        };

        // Observer for new modals
        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const modal = node.classList?.contains('search-modal') || 
                                     node.classList?.contains('article-modal') ? node : 
                                     node.querySelector?.('.search-modal, .article-modal');
                        
                        if (modal) {
                            setTimeout(() => trapFocus(modal), 100);
                        }
                    }
                });
            });
        });

        modalObserver.observe(document.body, { childList: true, subtree: true });
    }

    setupARIALiveRegions() {
        // Create live region for notifications
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Create urgent live region
        const urgentLiveRegion = document.createElement('div');
        urgentLiveRegion.id = 'aria-live-region-urgent';
        urgentLiveRegion.setAttribute('aria-live', 'assertive');
        urgentLiveRegion.setAttribute('aria-atomic', 'true');
        urgentLiveRegion.className = 'sr-only';
        document.body.appendChild(urgentLiveRegion);
    }

    handleEscapeKey() {
        // Close any open modals
        const modal = $('.search-modal, .article-modal');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close, .search-close');
            if (closeBtn) {
                closeBtn.click();
            }
            
            // Return focus to previously focused element
            if (this.focusedElement) {
                this.focusedElement.focus();
            }
        }
    }

    handleArrowKeys(e) {
        // Handle grid navigation for cards
        if (e.target.classList.contains('post-card')) {
            // This is handled in setupCardNavigation
            return;
        }

        // Handle other arrow key navigation as needed
    }

    setupColorContrastDetection() {
        // Detect if user prefers high contrast
        const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        if (highContrast) {
            document.body.classList.add('high-contrast');
        }

        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            document.body.classList.toggle('high-contrast', e.matches);
        });
    }

    announceToScreenReader(message, urgent = false) {
        const liveRegion = urgent ? 
            $('#aria-live-region-urgent') : 
            $('#aria-live-region');
        
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    addAccessibilityStyles() {
        const styles = `
            /* Screen reader only content */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            /* Skip links */
            .skip-links {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10000;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-color);
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: var(--border-radius);
                font-weight: 600;
                transition: var(--transition);
                z-index: 10001;
            }
            
            .skip-link:focus {
                top: 6px;
                outline: 2px solid var(--primary-light);
                outline-offset: 2px;
            }
            
            /* Keyboard navigation */
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary-color) !important;
                outline-offset: 2px;
                border-radius: var(--border-radius);
            }
            
            .keyboard-navigation button:focus,
            .keyboard-navigation a:focus,
            .keyboard-navigation input:focus,
            .keyboard-navigation textarea:focus,
            .keyboard-navigation select:focus {
                outline: 2px solid var(--primary-color) !important;
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
            }
            
            /* High contrast mode */
            .high-contrast {
                --text-primary: #000000;
                --text-secondary: #000000;
                --bg-primary: #ffffff;
                --bg-secondary: #f0f0f0;
                --border-color: #000000;
                --primary-color: #0000ff;
            }
            
            .high-contrast * {
                border-color: #000000 !important;
            }
            
            .high-contrast button,
            .high-contrast .post-card {
                border: 2px solid #000000 !important;
            }
            
            /* Reduced motion */
            .reduced-motion *,
            .reduced-motion *::before,
            .reduced-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            /* Focus visible only when needed */
            :focus:not(:focus-visible) {
                outline: none;
            }
            
            :focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
            
            /* Enhanced focus for interactive elements */
            .post-card:focus-visible {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
                outline: 2px solid var(--primary-color);
                outline-offset: 4px;
            }
            
            .robux-option:focus-within {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
                border-radius: var(--border-radius);
            }
            
            /* Better contrast for disabled elements */
            button:disabled,
            input:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            /* Live regions */
            #aria-live-region,
            #aria-live-region-urgent {
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }
            
            /* Improve text readability */
            @media (prefers-reduced-motion: no-preference) {
                .smooth-focus {
                    transition: outline 0.2s ease;
                }
            }
            
            /* Print accessibility */
            @media print {
                .skip-links,
                .search-modal,
                .article-modal {
                    display: none !important;
                }
                
                .post-card {
                    break-inside: avoid;
                }
            }
        `;

        if (!document.querySelector('#accessibility-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'accessibility-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    // Public API
    announce(message, urgent = false) {
        this.announceToScreenReader(message, urgent);
    }

    focusElement(selector) {
        const element = $(selector);
        if (element) {
            element.focus();
            return true;
        }
        return false;
    }

    getCurrentFocus() {
        return document.activeElement;
    }

    isKeyboardUser() {
        return this.isKeyboardNavigating;
    }
}

// Initialize and export
const accessibilityManager = new AccessibilityManager();
export default accessibilityManager;
