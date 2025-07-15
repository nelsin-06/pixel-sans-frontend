/**
 * Search Module
 * @fileoverview Handles search functionality including modal, input handling, and results display
 */

import { $, $$ } from '../utils/dom-helpers.js';
import { debounce } from '../utils/helpers.js';
import notificationManager from './notifications.js';

class SearchManager {
    constructor() {
        this.searchBtn = $('.search-btn');
        this.searchModal = null;
        this.searchInput = null;
        this.searchResults = null;
        this.isSearchOpen = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.addStyles();
    }

    bindEvents() {
        // Search button click
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.toggleSearch());
        }

        // Keyboard shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }
        });
    }

    toggleSearch() {
        if (this.isSearchOpen) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }

    openSearch() {
        this.createSearchModal();
        this.isSearchOpen = true;
        
        // Focus the search input
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.focus();
            }
        }, 100);
    }

    closeSearch() {
        if (this.searchModal) {
            this.searchModal.remove();
            this.searchModal = null;
            this.searchInput = null;
            this.searchResults = null;
        }
        this.isSearchOpen = false;
    }

    createSearchModal() {
        this.searchModal = document.createElement('div');
        this.searchModal.className = 'search-modal';
        this.searchModal.innerHTML = `
            <div class="search-container">
                <input type="text" placeholder="Buscar artículos..." class="search-input" autofocus>
                <button class="search-close" aria-label="Cerrar búsqueda">&times;</button>
            </div>
            <div class="search-results"></div>
        `;

        document.body.appendChild(this.searchModal);

        // Get references
        this.searchInput = this.searchModal.querySelector('.search-input');
        this.searchResults = this.searchModal.querySelector('.search-results');
        const searchClose = this.searchModal.querySelector('.search-close');

        // Bind modal events
        searchClose.addEventListener('click', () => this.closeSearch());
        this.searchModal.addEventListener('click', (e) => {
            if (e.target === this.searchModal) {
                this.closeSearch();
            }
        });

        // Bind search input
        this.searchInput.addEventListener('input', debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    async handleSearch(query) {
        if (query.length < 2) {
            this.searchResults.innerHTML = '';
            return;
        }

        this.showSearchLoading();

        try {
            const results = await this.performSearch(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        }
    }

    async performSearch(query) {
        // Mock search for now - replace with actual API call
        const mockResults = [
            { 
                title: 'Guía Definitiva: ¿Qué son los Robux y Cómo se Utilizan en Roblox?', 
                url: '#article-1',
                category: 'Roblox',
                excerpt: 'Los Robux son la moneda virtual oficial utilizada en la plataforma de juegos Roblox...'
            },
            { 
                title: 'Métodos Infalibles para Ganar Más Robux', 
                url: '#article-2',
                category: 'Roblox',
                excerpt: 'Descubre los mejores métodos legítimos para obtener Robux en Roblox...'
            },
            { 
                title: 'Códigos de Free Fire Actualizados Enero 2025', 
                url: '#article-3',
                category: 'Free Fire',
                excerpt: 'Los códigos más recientes para Free Fire que te permitirán obtener diamantes...'
            },
            { 
                title: 'Guía Completa de Diamantes en Free Fire', 
                url: '#article-4',
                category: 'Free Fire',
                excerpt: 'Todo lo que necesitas saber sobre los diamantes en Free Fire...'
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return mockResults.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    displaySearchResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No se encontraron resultados</p>
                    <small>Intenta con otros términos de búsqueda</small>
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = results.map(item => `
            <a href="${item.url}" class="search-result" data-category="${item.category}">
                <div class="search-result-category">${item.category}</div>
                <div class="search-result-title">${this.highlightQuery(item.title)}</div>
                <div class="search-result-excerpt">${this.highlightQuery(item.excerpt)}</div>
            </a>
        `).join('');

        // Add click handlers
        $$('.search-result', this.searchResults).forEach(result => {
            result.addEventListener('click', () => {
                this.closeSearch();
                // Handle navigation to result
            });
        });
    }

    highlightQuery(text) {
        if (!this.searchInput) return text;
        
        const query = this.searchInput.value.trim();
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showSearchLoading() {
        this.searchResults.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <p>Buscando...</p>
            </div>
        `;
    }

    showSearchError() {
        this.searchResults.innerHTML = `
            <div class="search-error">
                <p>❌ Error en la búsqueda</p>
                <small>Inténtalo de nuevo más tarde</small>
            </div>
        `;
    }

    addStyles() {
        const styles = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                z-index: 1000;
                backdrop-filter: blur(5px);
            }
            
            .search-container {
                background: var(--bg-primary);
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .search-input {
                flex: 1;
                padding: 0.75rem;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius);
                font-size: 1rem;
                background: var(--bg-primary);
                color: var(--text-primary);
            }
            
            .search-input:focus {
                border-color: var(--primary-color);
                outline: none;
            }
            
            .search-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0.5rem;
                border-radius: var(--border-radius);
            }
            
            .search-close:hover {
                background: var(--bg-secondary);
            }
            
            .search-results {
                background: var(--bg-primary);
                max-height: 400px;
                overflow-y: auto;
                padding: 1rem;
            }
            
            .search-result {
                display: block;
                padding: 1rem;
                color: var(--text-primary);
                text-decoration: none;
                border-radius: var(--border-radius);
                margin-bottom: 0.5rem;
                border: 1px solid var(--border-color);
                transition: var(--transition);
            }
            
            .search-result:hover {
                background: var(--bg-secondary);
                border-color: var(--primary-color);
            }
            
            .search-result-category {
                font-size: 0.75rem;
                color: var(--primary-color);
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 0.25rem;
            }
            
            .search-result-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .search-result-excerpt {
                font-size: 0.875rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }
            
            .search-no-results,
            .search-loading,
            .search-error {
                text-align: center;
                padding: 2rem;
                color: var(--text-secondary);
            }
            
            .search-loading .loading-spinner {
                width: 2rem;
                height: 2rem;
                border: 2px solid var(--border-color);
                border-top: 2px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .search-result mark {
                background: var(--primary-color);
                color: white;
                padding: 0.1em 0.2em;
                border-radius: 0.2em;
            }
        `;

        if (!document.querySelector('#search-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'search-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Initialize and export
const searchManager = new SearchManager();
export default searchManager;
