// Search functionality for the Food Recipes site
(function() {
    'use strict';

    // Configuration
    const MAX_SEARCH_RESULTS = 10;
    const DEFAULT_LANGUAGE = 'no';
    const DEBOUNCE_DELAY_MS = 300;

    let searchIndex = null;
    let searchIndexData = null;

    // Initialize search when DOM is ready
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const searchStatus = document.getElementById('search-status');
        
        if (!searchInput) return;

        // Load search index
        loadSearchIndex();

        // Debounce search to avoid excessive processing
        let debounceTimer;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                clearResults();
                return;
            }

            debounceTimer = setTimeout(() => {
                performSearch(query);
            }, DEBOUNCE_DELAY_MS);
        });

        // Handle keyboard navigation
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                clearResults();
            }
        });
    }

    // Load and initialize elasticlunr search index
    function loadSearchIndex() {
        // Determine the language-specific search index filename
        // Extract language code, handling cases like "nb-NO" -> "no"
        let lang = document.documentElement.lang || DEFAULT_LANGUAGE;
        // Take only the first part before any hyphen
        lang = lang.split('-')[0];
        
        // Get the base path from the current page URL
        // Try to get it from a data attribute first, then fallback to detection
        let basePath = document.documentElement.getAttribute('data-base-path');
        
        if (!basePath) {
            // Check if there's a base element in the HTML
            const baseElement = document.querySelector('base');
            
            if (baseElement && baseElement.href) {
                // Extract path from base href
                const baseUrl = new URL(baseElement.href);
                basePath = baseUrl.pathname;
            } else {
                // Fallback: try to detect from current pathname
                const pathname = window.location.pathname;
                
                // Check if we're on a subpath (production) or root (development)
                if (pathname.includes('/food-recipes/')) {
                    basePath = '/food-recipes/';
                } else {
                    // For development, always use root
                    basePath = '/';
                }
            }
        }
        
        const searchIndexUrl = `${basePath}search_index.${lang}.json`;
        
        fetch(searchIndexUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Search index not found');
                }
                return response.json();
            })
            .then(data => {
                searchIndexData = data;
                // Try to load the index, but if it fails due to missing language functions,
                // create a simple index without them
                try {
                    searchIndex = elasticlunr.Index.load(data);
                } catch (error) {
                    console.warn('Could not load index with language functions, creating basic index:', error);
                    // Create a basic index without language-specific functions
                    searchIndex = elasticlunr(function() {
                        this.addField('title');
                        this.addField('description');
                        this.addField('body');
                        this.setRef('id');
                    });
                    
                    // Add documents to the index
                    if (data.documentStore && data.documentStore.docs) {
                        Object.keys(data.documentStore.docs).forEach(key => {
                            try {
                                searchIndex.addDoc(data.documentStore.docs[key]);
                            } catch (e) {
                                console.warn('Could not add document:', key, e);
                            }
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Failed to load search index:', error);
                showStatus('Søkefunksjonen er ikke tilgjengelig', true);
            });
    }

    // Perform search and display results
    function performSearch(query) {
        const searchResults = document.getElementById('search-results');
        const searchStatus = document.getElementById('search-status');

        if (!searchIndex || !searchIndexData) {
            showStatus('Laster søkeindeks...', false);
            return;
        }

        // Perform the search
        const results = searchIndex.search(query, {
            fields: {
                title: { boost: 2 },
                description: { boost: 1 },
                body: { boost: 1 }
            },
            bool: "OR",
            expand: true
        });

        displayResults(results, query);
    }

    // Display search results
    function displayResults(results, query) {
        const searchResults = document.getElementById('search-results');
        const searchStatus = document.getElementById('search-status');

        if (results.length === 0) {
            showStatus(`Ingen resultater for "${query}"`, false);
            searchResults.innerHTML = '';
            return;
        }

        showStatus(`${results.length} resultat${results.length > 1 ? 'er' : ''} for "${query}"`, false);

        const resultsHTML = results.slice(0, MAX_SEARCH_RESULTS).map(result => {
            const doc = searchIndexData.documentStore.docs[result.ref];
            const title = doc.title || 'Uten tittel';
            const description = doc.description || '';
            const body = doc.body || '';
            
            // Create a snippet of the body text
            let snippet = description || body.substring(0, 150);
            if (snippet.length >= 150 && body.length > 150) {
                snippet += '...';
            }

            return `
                <div class="search-result">
                    <h3 class="search-result-title">
                        <a href="${result.ref}">${escapeHtml(title)}</a>
                    </h3>
                    ${snippet ? `<p class="search-result-snippet">${escapeHtml(snippet)}</p>` : ''}
                </div>
            `;
        }).join('');

        searchResults.innerHTML = resultsHTML;
    }

    // Show status message
    function showStatus(message, isError) {
        const searchStatus = document.getElementById('search-status');
        if (searchStatus) {
            searchStatus.textContent = message;
            searchStatus.className = 'search-status' + (isError ? ' search-error' : '');
        }
    }

    // Clear results
    function clearResults() {
        const searchResults = document.getElementById('search-results');
        const searchStatus = document.getElementById('search-status');
        
        if (searchResults) searchResults.innerHTML = '';
        if (searchStatus) searchStatus.textContent = '';
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
