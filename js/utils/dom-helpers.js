/**
 * DOM Manipulation Utilities
 * @fileoverview Helper functions for DOM operations
 */

/**
 * Safe querySelector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {Element|null} Found element or null
 */
export function $(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
    }
}

/**
 * Safe querySelectorAll with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {NodeList} Found elements
 */
export function $$(selector, context = document) {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return [];
    }
}

/**
 * Create element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Element|Array} content - Element content
 * @returns {Element} Created element
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className' || key === 'class') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('aria-') || key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    // Set content
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (content instanceof Element) {
        element.appendChild(content);
    } else if (Array.isArray(content)) {
        content.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
export function addEventListener(element, event, handler, options = {}) {
    if (!element || typeof handler !== 'function') {
        console.warn('Invalid element or handler for event listener');
        return () => {};
    }
    
    element.addEventListener(event, handler, options);
    
    // Return cleanup function
    return () => element.removeEventListener(event, handler, options);
}

/**
 * Add multiple event listeners to an element
 * @param {Element} element - Target element
 * @param {Object} events - Object with event types as keys and handlers as values
 * @returns {Function} Cleanup function for all listeners
 */
export function addEventListeners(element, events) {
    const cleanupFunctions = [];
    
    Object.entries(events).forEach(([event, handler]) => {
        const cleanup = addEventListener(element, event, handler);
        cleanupFunctions.push(cleanup);
    });
    
    // Return function to cleanup all listeners
    return () => cleanupFunctions.forEach(cleanup => cleanup());
}

/**
 * Wait for element to exist in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Element>} Promise that resolves with the element
 */
export function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = $(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver(() => {
            const element = $(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Smooth scroll to element
 * @param {Element|string} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export function scrollToElement(target, options = {}) {
    const element = typeof target === 'string' ? $(target) : target;
    if (!element) return;
    
    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };
    
    element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Intersection threshold (0-1)
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const verticalVisible = rect.top < windowHeight && rect.bottom > 0;
    const horizontalVisible = rect.left < windowWidth && rect.right > 0;
    
    if (threshold === 0) {
        return verticalVisible && horizontalVisible;
    }
    
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;
    
    return (visibleArea / totalArea) >= threshold;
}

/**
 * Remove element with optional animation
 * @param {Element} element - Element to remove
 * @param {string} animation - CSS class for exit animation
 * @param {number} delay - Delay before removal
 */
export function removeElement(element, animation = '', delay = 0) {
    if (!element) return;
    
    if (animation) {
        element.classList.add(animation);
    }
    
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, delay);
}
