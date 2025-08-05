/**
 * Scroll Effects Module
 * @fileoverview Handles scroll-based animations and effects
 */

import { $, $$ } from '../utils/dom-helpers.js';
import { throttle } from '../utils/helpers.js';

class ScrollEffectsManager {
    constructor() {
        this.observer = null;
        
        this.config = {
            animationThreshold: 0.1,
            animationRootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        this.initializeIntersectionObserver();
        this.bindScrollEvents();
        this.addScrollStyles();
    }

    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: this.config.animationThreshold,
            rootMargin: this.config.animationRootMargin
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementIn(entry.target);
                } else {
                    // Optionally animate out when scrolling up
                    // this.animateElementOut(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        this.observeElements();
    }

    observeElements() {
        // Observe post cards
        $$('.post-card').forEach(card => {
            this.prepareElementForAnimation(card, 'slide-up');
            this.observer.observe(card);
        });

        // Observe section titles
        $$('.section-title').forEach(title => {
            this.prepareElementForAnimation(title, 'fade-in');
            this.observer.observe(title);
        });

        // Observe footer sections
        $$('.footer-section').forEach(section => {
            this.prepareElementForAnimation(section, 'slide-up');
            this.observer.observe(section);
        });

        // Observe any elements with animation classes
        $$('[data-animate]').forEach(element => {
            const animationType = element.dataset.animate || 'fade-in';
            this.prepareElementForAnimation(element, animationType);
            this.observer.observe(element);
        });
    }

    prepareElementForAnimation(element, animationType = 'fade-in') {
        element.classList.add('scroll-animate', `animate-${animationType}`);
        element.style.visibility = 'hidden';
    }

    animateElementIn(element) {
        element.style.visibility = 'visible';
        element.classList.add('animate-in');
        
        // Add stagger delay for multiple elements
        const delay = Array.from(element.parentNode?.children || []).indexOf(element) * 100;
        element.style.animationDelay = `${delay}ms`;
    }

    animateElementOut(element) {
        element.classList.remove('animate-in');
    }

    bindScrollEvents() {
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 16)); // 60fps

        // Handle scroll direction
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', throttle(() => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            
            document.body.classList.toggle('scrolling-down', isScrollingDown);
            document.body.classList.toggle('scrolling-up', !isScrollingDown);
            
            lastScrollY = currentScrollY;
        }, 100));
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Parallax effects
        this.handleParallaxEffects(scrollY);
    }

    handleParallaxEffects(scrollY) {
        // Parallax for hero elements
        const heroElements = $$('[data-parallax]');
        heroElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Smooth scroll to element
    scrollToElement(selector, offset = 0) {
        const element = $(selector);
        if (!element) return;

        const elementTop = element.offsetTop - offset;
        window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
        });
    }

    // Add new elements to observer (for dynamically added content)
    observeNewElements() {
        // Re-observe all unobserved elements
        $$('.post-card:not(.scroll-animate)').forEach(card => {
            this.prepareElementForAnimation(card, 'slide-up');
            this.observer.observe(card);
        });
    }

    addScrollStyles() {
        const styles = `
            /* Scroll animations */
            .scroll-animate {
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-fade-in {
                opacity: 0;
            }
            
            .animate-fade-in.animate-in {
                opacity: 1;
            }
            
            .animate-slide-up {
                opacity: 0;
                transform: translateY(30px);
            }
            
            .animate-slide-up.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-slide-left {
                opacity: 0;
                transform: translateX(-30px);
            }
            
            .animate-slide-left.animate-in {
                opacity: 1;
                transform: translateX(0);
            }
            
            .animate-slide-right {
                opacity: 0;
                transform: translateX(30px);
            }
            
            .animate-slide-right.animate-in {
                opacity: 1;
                transform: translateX(0);
            }
            
            .animate-scale {
                opacity: 0;
                transform: scale(0.8);
            }
            
            .animate-scale.animate-in {
                opacity: 1;
                transform: scale(1);
            }
            
            /* Parallax elements */
            [data-parallax] {
                will-change: transform;
            }
            
            /* Smooth scrolling for the entire page */
            html {
                scroll-behavior: smooth;
            }
            
            @media (prefers-reduced-motion: reduce) {
                html {
                    scroll-behavior: auto;
                }
                
                .scroll-animate,
                [data-parallax] {
                    transition: none !important;
                    animation: none !important;
                    transform: none !important;
                }
            }
        `;

        if (!document.querySelector('#scroll-effects-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'scroll-effects-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    // Public API
    refresh() {
        this.observeNewElements();
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize and export
const scrollEffectsManager = new ScrollEffectsManager();
export default scrollEffectsManager;
