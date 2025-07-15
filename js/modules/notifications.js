/**
 * Notification System
 * @fileoverview Handles all application notifications and alerts
 */

import { APP_CONFIG, NOTIFICATION_TYPES } from '../config/constants.js';
import { createElement } from '../utils/dom-helpers.js';

class NotificationManager {
    constructor() {
        this.notifications = new Set();
        this.container = null;
        this.init();
    }

    /**
     * Initialize notification system
     */
    init() {
        this.createContainer();
    }

    /**
     * Create notification container
     */
    createContainer() {
        this.container = createElement('div', {
            className: 'notification-container',
            'aria-live': 'polite',
            'aria-atomic': 'true'
        });
        
        document.body.appendChild(this.container);
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {Object} options - Additional options
     */
    show(message, type = NOTIFICATION_TYPES.INFO, options = {}) {
        const {
            duration = APP_CONFIG.UI.NOTIFICATION_DURATION,
            persistent = false,
            actions = [],
            icon = null
        } = options;

        const notification = this.createNotification(message, type, { icon, actions });
        
        this.container.appendChild(notification);
        this.notifications.add(notification);

        // Trigger entrance animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto-remove notification if not persistent
        if (!persistent) {
            setTimeout(() => this.remove(notification), duration);
        }

        return notification;
    }

    /**
     * Create notification element
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     * @param {Object} options - Additional options
     * @returns {Element} Notification element
     */
    createNotification(message, type, options = {}) {
        const { icon, actions } = options;

        const notification = createElement('div', {
            className: `notification notification-${type}`,
            role: 'alert',
            'aria-live': 'assertive'
        });

        // Create content wrapper
        const content = createElement('div', { className: 'notification-content' });

        // Add icon if provided
        if (icon) {
            const iconElement = createElement('div', { className: 'notification-icon' });
            iconElement.innerHTML = icon;
            content.appendChild(iconElement);
        }

        // Add message
        const messageElement = createElement('div', { 
            className: 'notification-message' 
        }, message);
        content.appendChild(messageElement);

        // Add actions if provided
        if (actions && actions.length > 0) {
            const actionsContainer = createElement('div', { className: 'notification-actions' });
            actions.forEach(action => {
                const button = createElement('button', {
                    className: 'notification-action',
                    'aria-label': action.label
                }, action.label);
                
                button.addEventListener('click', () => {
                    if (action.handler) action.handler();
                    this.remove(notification);
                });
                
                actionsContainer.appendChild(button);
            });
            content.appendChild(actionsContainer);
        }

        // Add close button
        const closeButton = createElement('button', {
            className: 'notification-close',
            'aria-label': 'Cerrar notificación'
        }, '×');

        closeButton.addEventListener('click', () => this.remove(notification));

        notification.appendChild(content);
        notification.appendChild(closeButton);

        return notification;
    }

    /**
     * Remove notification
     * @param {Element} notification - Notification element to remove
     */
    remove(notification) {
        if (!notification || !this.notifications.has(notification)) return;

        notification.classList.remove('show');
        this.notifications.delete(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications.forEach(notification => this.remove(notification));
    }

    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {Object} options - Additional options
     */
    success(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.SUCCESS, {
            icon: '✓',
            ...options
        });
    }

    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {Object} options - Additional options
     */
    error(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.ERROR, {
            icon: '⚠',
            persistent: true,
            ...options
        });
    }

    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {Object} options - Additional options
     */
    warning(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.WARNING, {
            icon: '⚠',
            ...options
        });
    }

    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {Object} options - Additional options
     */
    info(message, options = {}) {
        return this.show(message, NOTIFICATION_TYPES.INFO, {
            icon: 'ℹ',
            ...options
        });
    }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Export convenience functions
export const showNotification = (message, type, options) => 
    notificationManager.show(message, type, options);

export const showSuccess = (message, options) => 
    notificationManager.success(message, options);

export const showError = (message, options) => 
    notificationManager.error(message, options);

export const showWarning = (message, options) => 
    notificationManager.warning(message, options);

export const showInfo = (message, options) => 
    notificationManager.info(message, options);

export const clearNotifications = () => 
    notificationManager.clearAll();

export default notificationManager;
