/**
 * Scroll Effects Module
 * @fileoverview Handles scroll-based animations and effects
 */

import { $, $$ } from '../utils/dom-helpers.js';
import { throttle } from '../utils/helpers.js';

class ScrollEffectsManager {
    constructor() {
        this.scrollToTopBtn = null;
        this.observer = null;
        this.scrollProgress = null;
        
        this.config = {
            showScrollTopAt: 300,
            animationThreshold: 0.1,
            animationRootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        this.createScrollToTopButton();
        this.createScrollProgress();
        this.initializeIntersectionObserver();
        this.bindScrollEvents();
        this.addScrollStyles();
    }

    createScrollToTopButton() {
        this.scrollToTopBtn = document.createElement('button');
        this.scrollToTopBtn.className = 'scroll-to-top';
        this.scrollToTopBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        this.scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        this.scrollToTopBtn.setAttribute('title', 'Volver arriba');
        
        document.body.appendChild(this.scrollToTopBtn);

        this.scrollToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    createScrollProgress() {
        this.scrollProgress = document.createElement('div');
        this.scrollProgress.className = 'scroll-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        this.scrollProgress.appendChild(progressBar);
        
        document.body.appendChild(this.scrollProgress);
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
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show/hide scroll to top button
        this.toggleScrollToTopButton(scrollY);
        
        // Update scroll progress
        this.updateScrollProgress(scrollY, documentHeight, windowHeight);
        
        // Parallax effects
        this.handleParallaxEffects(scrollY);
    }

    toggleScrollToTopButton(scrollY) {
        if (scrollY > this.config.showScrollTopAt) {
            this.scrollToTopBtn.classList.add('visible');
        } else {
            this.scrollToTopBtn.classList.remove('visible');
        }
    }

    updateScrollProgress(scrollY, documentHeight, windowHeight) {
        const scrollProgress = (scrollY / (documentHeight - windowHeight)) * 100;
        const progressBar = this.scrollProgress.querySelector('.scroll-progress-bar');
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
        }
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

    scrollToTop() {
        const startPosition = window.scrollY;
        const duration = Math.min(startPosition / 3, 1000); // Max 1 second
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);
            
            window.scrollTo(0, startPosition * (1 - easeProgress));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
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
            .scroll-to-top {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--primary-color);
                color: white;
                border: none;
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 100;
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .scroll-to-top:hover {
                background: var(--primary-dark);
                transform: translateY(-4px) scale(1.1);
                box-shadow: var(--shadow-xl);
            }
            
            .scroll-to-top:active {
                transform: translateY(-2px) scale(1.05);
            }
            
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
                transition: width 0.1s ease-out;
                border-radius: 0 2px 2px 0;
            }
            
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
            
            /* Hide elements during scroll */
            .scrolling-down .scroll-to-top {
                transform: translateY(100%) scale(0.8);
            }
            
            .scrolling-up .scroll-to-top.visible {
                transform: translateY(0) scale(1);
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
                .scroll-to-top,
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
        
        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.remove();
        }
        
        if (this.scrollProgress) {
            this.scrollProgress.remove();
        }
    }
}

// Initialize and export
const scrollEffectsManager = new ScrollEffectsManager();
export default scrollEffectsManager;
