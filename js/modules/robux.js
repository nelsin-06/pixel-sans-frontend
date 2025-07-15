/**
 * Robux Module
 * @fileoverview Handles Robux selector functionality and interactions
 */

import { $, $$ } from '../utils/dom-helpers.js';
import notificationManager from './notifications.js';

class RobuxManager {
    constructor() {
        this.robuxBtn = $('.robux-btn');
        this.robuxOptions = $$('input[name="robux"]');
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateInitialState();
    }

    bindEvents() {
        // Robux button click
        if (this.robuxBtn) {
            this.robuxBtn.addEventListener('click', () => this.handleRobuxSelection());
        }

        // Radio button changes
        this.robuxOptions.forEach(option => {
            option.addEventListener('change', () => this.updateRobuxDisplay());
        });

        // Add hover effects
        this.robuxOptions.forEach(option => {
            const label = option.closest('.robux-option');
            if (label) {
                label.addEventListener('mouseenter', () => this.previewSelection(option.value));
                label.addEventListener('mouseleave', () => this.resetPreview());
            }
        });
    }

    updateInitialState() {
        this.updateRobuxDisplay();
        this.addRobuxStyles();
    }

    async handleRobuxSelection() {
        if (this.isProcessing) {
            return;
        }

        const selectedRobux = $('input[name="robux"]:checked');
        
        if (!selectedRobux) {
            notificationManager.warning('Por favor selecciona una cantidad de Robux');
            this.highlightOptions();
            return;
        }

        const amount = this.formatRobuxAmount(selectedRobux.value);
        
        try {
            this.isProcessing = true;
            await this.processRobuxRequest(selectedRobux.value);
            
            notificationManager.success(`¡Solicitud enviada para ${amount} Robux!`);
            this.resetSelection();
            
        } catch (error) {
            console.error('Robux processing error:', error);
            notificationManager.error('Error al procesar la solicitud. Inténtalo de nuevo.');
        } finally {
            this.isProcessing = false;
        }
    }

    async processRobuxRequest(amount) {
        // Update button state
        this.setButtonState('processing', amount);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate API call
        const success = await this.submitRobuxRequest(amount);
        if (!success) {
            throw new Error('Request failed');
        }
        
        // Reset button state
        this.setButtonState('default');
    }

    async submitRobuxRequest(amount) {
        // Mock API call - replace with actual endpoint
        try {
            const response = await fetch('/api/robux/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseInt(amount),
                    timestamp: Date.now(),
                    user_agent: navigator.userAgent
                })
            });

            return response.ok;
        } catch (error) {
            // For demo purposes, simulate 80% success rate
            return Math.random() > 0.2;
        }
    }

    setButtonState(state, amount = null) {
        if (!this.robuxBtn) return;

        switch (state) {
            case 'processing':
                this.robuxBtn.disabled = true;
                this.robuxBtn.innerHTML = `
                    <span class="robux-btn-spinner"></span>
                    Procesando...
                `;
                this.robuxBtn.classList.add('processing');
                break;
                
            case 'success':
                this.robuxBtn.disabled = false;
                this.robuxBtn.textContent = '¡Completado!';
                this.robuxBtn.classList.remove('processing');
                this.robuxBtn.classList.add('success');
                
                setTimeout(() => {
                    this.setButtonState('default');
                }, 2000);
                break;
                
            case 'default':
            default:
                this.robuxBtn.disabled = false;
                this.robuxBtn.textContent = 'Robux Gratis!';
                this.robuxBtn.classList.remove('processing', 'success');
                break;
        }
    }

    updateRobuxDisplay() {
        const selectedRobux = $('input[name="robux"]:checked');
        
        if (selectedRobux && !this.isProcessing) {
            const amount = this.formatRobuxAmount(selectedRobux.value);
            this.robuxBtn.textContent = `Obtener ${amount} Robux`;
            this.robuxBtn.classList.add('selected');
        } else if (!this.isProcessing) {
            this.robuxBtn.textContent = 'Robux Gratis!';
            this.robuxBtn.classList.remove('selected');
        }
    }

    previewSelection(value) {
        if (this.isProcessing) return;
        
        const amount = this.formatRobuxAmount(value);
        this.robuxBtn.textContent = `Obtener ${amount} Robux`;
        this.robuxBtn.classList.add('preview');
    }

    resetPreview() {
        if (this.isProcessing) return;
        
        this.robuxBtn.classList.remove('preview');
        this.updateRobuxDisplay();
    }

    highlightOptions() {
        const container = $('.robux-options');
        if (container) {
            container.classList.add('highlight');
            setTimeout(() => {
                container.classList.remove('highlight');
            }, 2000);
        }
    }

    resetSelection() {
        const selectedRobux = $('input[name="robux"]:checked');
        if (selectedRobux) {
            selectedRobux.checked = false;
        }
        this.updateRobuxDisplay();
    }

    formatRobuxAmount(value) {
        const num = parseInt(value);
        return num.toLocaleString('es-ES');
    }

    addRobuxStyles() {
        const styles = `
            .robux-btn {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .robux-btn.processing {
                background: var(--text-secondary);
                cursor: not-allowed;
            }
            
            .robux-btn.success {
                background: #10b981;
            }
            
            .robux-btn.selected {
                background: var(--primary-color);
                transform: scale(1.05);
            }
            
            .robux-btn.preview {
                background: var(--primary-light);
                transform: scale(1.02);
            }
            
            .robux-btn-spinner {
                display: inline-block;
                width: 1rem;
                height: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 0.5rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .robux-options.highlight {
                animation: highlightPulse 2s ease-in-out;
            }
            
            @keyframes highlightPulse {
                0%, 100% { 
                    border-color: var(--border-color);
                    box-shadow: none;
                }
                50% { 
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
            }
            
            .robux-option {
                transition: all 0.2s ease;
                cursor: pointer;
            }
            
            .robux-option:hover {
                background: var(--bg-secondary);
                border-color: var(--primary-color);
                transform: translateY(-1px);
            }
            
            .robux-option input:checked + span {
                background: var(--primary-color);
                color: white;
                font-weight: 600;
            }
            
            .robux-selector {
                position: relative;
            }
            
            .robux-selector::before {
                content: '';
                position: absolute;
                top: -10px;
                right: -10px;
                width: 20px;
                height: 20px;
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                border-radius: 50%;
                animation: shine 2s ease-in-out infinite;
            }
            
            @keyframes shine {
                0%, 100% { opacity: 0.7; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;

        if (!document.querySelector('#robux-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'robux-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Initialize and export
const robuxManager = new RobuxManager();
export default robuxManager;
