/**
 * Main Application Bootstrap
 * Orchestrates data fetching, ranking, routing, UI rendering, and test runner.
 */

import { INITIAL_DESTINATIONS } from './data.js';
import { rankDestinations } from './ranking.js';
import { AppRouter } from './router.js';
import { UIRenderer } from './ui.js';
import { QATestSuite } from './tests.js';

class PopularDestinationsApp {
  constructor() {
    // State management
    this.destinations = [...INITIAL_DESTINATIONS];
    this.state = {
      selectedCategory: 'all',
      selectedInterests: ['Adventure', 'Nature'], // Sensible default interest to showcase recommendation algorithm
      searchQuery: '',
      sortBy: 'recommended',
      viewMode: 'grid', // 'grid' | 'list'
      isLoading: false,
      hasError: false,
      errorMessage: ''
    };

    // DOM References
    this.elements = {
      // Views
      mainListView: document.getElementById('main-list-view'),
      detailsView: document.getElementById('details-view'),
      destinationsContainer: document.getElementById('destinations-container'),
      
      // Filter & Controls
      categoryTabs: document.getElementById('category-tabs'),
      interestChips: document.getElementById('interest-chips'),
      searchInput: document.getElementById('search-destinations'),
      searchClear: document.getElementById('search-clear'),
      sortSelect: document.getElementById('sort-destinations'),
      viewGridBtn: document.getElementById('btn-view-grid'),
      viewListBtn: document.getElementById('btn-view-list'),
      resultsCount: document.getElementById('results-count'),

      // QA Modal
      btnOpenQa: document.getElementById('btn-open-qa'),
      qaModalOverlay: document.getElementById('qa-modal-overlay'),
      qaCloseBtn: document.getElementById('qa-close-btn'),
      btnRunAllTests: document.getElementById('btn-run-all-tests'),
      qaTestsList: document.getElementById('qa-tests-list'),
      qaStatPassed: document.getElementById('qa-stat-passed'),
      qaStatFailed: document.getElementById('qa-stat-failed'),
      qaStatTotal: document.getElementById('qa-stat-total'),
      qaStatCoverage: document.getElementById('qa-stat-coverage'),

      // State Simulation Buttons
      btnSimLoading: document.getElementById('btn-sim-loading'),
      btnSimError: document.getElementById('btn-sim-error'),
      btnSimReset: document.getElementById('btn-sim-reset')
    };

    this.ui = new UIRenderer(this.elements);
    this.router = new AppRouter({
      onRouteChanged: (route) => this.handleRoute(route)
    });
    this.qaRunner = new QATestSuite(this);
  }

  /**
   * Initialize Application
   */
  init() {
    this.ui.renderCategoryTabs(this.state.selectedCategory);
    this.ui.renderInterestChips(this.state.selectedInterests);
    this.bindEvents();
    this.router.init();
    this.updateDestinationCatalog();
  }

  /**
   * Route Handler (Switching between List and Details view)
   */
  handleRoute(route) {
    if (route.view === 'details' && route.destinationId) {
      const destination = this.destinations.find(d => d.id === route.destinationId);
      this.elements.mainListView.style.display = 'none';
      this.elements.detailsView.classList.add('active');
      this.ui.renderDetailsView(destination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.elements.detailsView.classList.remove('active');
      this.elements.mainListView.style.display = 'block';
    }
  }

  /**
   * Updates and renders the destinations list based on current filters and ranking
   */
  updateDestinationCatalog() {
    if (this.state.hasError) {
      this.ui.renderErrorState(this.state.errorMessage);
      this.elements.resultsCount.textContent = '0 destinations';
      return;
    }

    if (this.state.isLoading) {
      this.ui.renderLoadingState(6);
      this.elements.resultsCount.textContent = 'Loading destinations...';
      return;
    }

    const ranked = rankDestinations(this.destinations, {
      userInterests: this.state.selectedInterests,
      category: this.state.selectedCategory,
      searchQuery: this.state.searchQuery,
      sortBy: this.state.sortBy
    });

    if (ranked.length === 0) {
      this.ui.renderEmptyState();
      this.elements.resultsCount.textContent = '0 destinations';
    } else {
      this.ui.renderDestinationsList(ranked, this.state.selectedInterests);
      this.elements.resultsCount.textContent = `${ranked.length} destination${ranked.length > 1 ? 's' : ''} available`;
    }
  }

  /**
   * Bind DOM Events & Interactions
   */
  bindEvents() {
    // 1. Search Input
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        if (this.elements.searchClear) {
          this.elements.searchClear.classList.toggle('visible', !!e.target.value);
        }
        this.updateDestinationCatalog();
      });
    }

    if (this.elements.searchClear) {
      this.elements.searchClear.addEventListener('click', () => {
        this.elements.searchInput.value = '';
        this.state.searchQuery = '';
        this.elements.searchClear.classList.remove('visible');
        this.updateDestinationCatalog();
      });
    }

    // 2. Category Tab Selection
    if (this.elements.categoryTabs) {
      this.elements.categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-tab');
        if (!btn) return;
        const cat = btn.getAttribute('data-category');
        this.state.selectedCategory = cat;
        this.ui.renderCategoryTabs(cat);
        this.updateDestinationCatalog();
      });
    }

    // 3. User Interest Toggle Chips (Subtask 2 Trigger)
    if (this.elements.interestChips) {
      this.elements.interestChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.interest-chip');
        if (!chip) return;
        const interest = chip.getAttribute('data-interest');
        
        if (this.state.selectedInterests.includes(interest)) {
          this.state.selectedInterests = this.state.selectedInterests.filter(i => i !== interest);
        } else {
          this.state.selectedInterests.push(interest);
        }

        this.ui.renderInterestChips(this.state.selectedInterests);
        this.updateDestinationCatalog();
        
        const count = this.state.selectedInterests.length;
        this.ui.showToast(count > 0 ? `Recommendations updated for ${count} selected interests!` : 'Reset to Global Popularity ranking.');
      });
    }

    // 4. Sort Dropdown Change
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', (e) => {
        this.state.sortBy = e.target.value;
        this.updateDestinationCatalog();
      });
    }

    // 5. Grid / List View Toggle (Subtask 1)
    if (this.elements.viewGridBtn && this.elements.viewListBtn) {
      this.elements.viewGridBtn.addEventListener('click', () => {
        this.state.viewMode = 'grid';
        this.elements.viewGridBtn.classList.add('active');
        this.elements.viewListBtn.classList.remove('active');
        this.elements.destinationsContainer.classList.remove('list-view');
      });

      this.elements.viewListBtn.addEventListener('click', () => {
        this.state.viewMode = 'list';
        this.elements.viewListBtn.classList.add('active');
        this.elements.viewGridBtn.classList.remove('active');
        this.elements.destinationsContainer.classList.add('list-view');
      });
    }

    // 6. Destination Card Click (Subtask 4 Selection)
    if (this.elements.destinationsContainer) {
      this.elements.destinationsContainer.addEventListener('click', (e) => {
        // Handle reset filters click inside empty state
        if (e.target.closest('#btn-reset-filters')) {
          this.resetAllFilters();
          return;
        }

        // Handle retry click inside error state
        if (e.target.closest('#btn-retry-fetch')) {
          this.retryFetch();
          return;
        }

        const card = e.target.closest('.destination-card');
        if (!card) return;
        const destId = card.getAttribute('data-id');
        if (destId) {
          this.router.navigateToDetails(destId);
        }
      });

      // Accessibility: Enter / Space key on card
      this.elements.destinationsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.destination-card');
          if (card) {
            e.preventDefault();
            const destId = card.getAttribute('data-id');
            if (destId) this.router.navigateToDetails(destId);
          }
        }
      });
    }

    // 7. Details View Actions (Back button, breadcrumbs, sharing, wishlist)
    if (this.elements.detailsView) {
      this.elements.detailsView.addEventListener('click', (e) => {
        if (e.target.closest('#btn-details-back') || e.target.closest('#btn-details-back-fallback') || e.target.closest('#breadcrumb-home')) {
          this.router.navigateToList();
          return;
        }

        if (e.target.closest('#btn-share-dest')) {
          navigator.clipboard?.writeText(window.location.href);
          this.ui.showToast('Link copied to clipboard!');
          return;
        }

        if (e.target.closest('#btn-save-itinerary')) {
          this.ui.showToast('Added to your travel wishlist! ❤️');
          return;
        }

        if (e.target.closest('#btn-book-tour')) {
          this.ui.showToast('Tour booking inquiry submitted!');
          return;
        }
      });
    }

    // 8. State Simulation Toolbar (Subtask 3 Verification)
    if (this.elements.btnSimLoading) {
      this.elements.btnSimLoading.addEventListener('click', () => {
        this.state.hasError = false;
        this.state.isLoading = true;
        this.updateDestinationCatalog();
        setTimeout(() => {
          this.state.isLoading = false;
          this.updateDestinationCatalog();
          this.ui.showToast('Catalog data loaded successfully.');
        }, 1200);
      });
    }

    if (this.elements.btnSimError) {
      this.elements.btnSimError.addEventListener('click', () => {
        this.state.isLoading = false;
        this.state.hasError = true;
        this.state.errorMessage = 'Simulated connection timeout (504 Gateway Error).';
        this.updateDestinationCatalog();
      });
    }

    if (this.elements.btnSimReset) {
      this.elements.btnSimReset.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }

    // 9. QA Modal Controls (Subtask 5)
    if (this.elements.btnOpenQa && this.elements.qaModalOverlay) {
      this.elements.btnOpenQa.addEventListener('click', () => {
        this.elements.qaModalOverlay.classList.add('active');
        this.runTestSuite();
      });

      this.elements.qaCloseBtn?.addEventListener('click', () => {
        this.elements.qaModalOverlay.classList.remove('active');
      });

      this.elements.qaModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.qaModalOverlay) {
          this.elements.qaModalOverlay.classList.remove('active');
        }
      });

      this.elements.btnRunAllTests?.addEventListener('click', () => {
        this.runTestSuite();
      });
    }
  }

  /**
   * Reset all filters to default state
   */
  resetAllFilters() {
    this.state.hasError = false;
    this.state.isLoading = false;
    this.state.searchQuery = '';
    this.state.selectedCategory = 'all';
    this.state.selectedInterests = ['Adventure', 'Nature'];
    this.state.sortBy = 'recommended';

    if (this.elements.searchInput) this.elements.searchInput.value = '';
    if (this.elements.searchClear) this.elements.searchClear.classList.remove('visible');
    if (this.elements.sortSelect) this.elements.sortSelect.value = 'recommended';

    this.ui.renderCategoryTabs('all');
    this.ui.renderInterestChips(this.state.selectedInterests);
    this.updateDestinationCatalog();
    this.ui.showToast('All filters and states reset.');
  }

  /**
   * Retry fetching destinations after error
   */
  retryFetch() {
    this.state.hasError = false;
    this.state.isLoading = true;
    this.updateDestinationCatalog();
    
    setTimeout(() => {
      this.state.isLoading = false;
      this.updateDestinationCatalog();
      this.ui.showToast('Destination catalog reconnected successfully!');
    }, 800);
  }

  /**
   * Run Subtask 5 Test Suite and update QA Modal UI
   */
  async runTestSuite() {
    if (!this.elements.qaTestsList) return;

    this.elements.qaTestsList.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);">Running automated QA validation suite...</div>';

    this.elements.btnRunAllTests.disabled = true;
    this.elements.btnRunAllTests.innerHTML = '<span>⏳</span> Running Tests...';

    const renderedItems = [];

    const summary = await this.qaRunner.runAllTests((result, current, total) => {
      renderedItems.push(`
        <div class="qa-test-item ${result.passed ? 'pass' : 'fail'}">
          <div class="test-info">
            <div class="test-name">${result.name}</div>
            <div class="test-desc">${result.desc}</div>
            ${result.error ? `<div style="color: var(--accent-rose); font-size: 0.8rem; margin-top: 0.25rem;">❌ ${result.error}</div>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap: 0.75rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">${result.duration}ms</span>
            <span class="test-status-badge ${result.passed ? 'pass' : 'fail'}">
              ${result.passed ? '✓ PASSED' : '✕ FAILED'}
            </span>
          </div>
        </div>
      `);
      this.elements.qaTestsList.innerHTML = renderedItems.join('');
    });

    // Update summary stats
    this.elements.qaStatPassed.textContent = summary.passed;
    this.elements.qaStatFailed.textContent = summary.failed;
    this.elements.qaStatTotal.textContent = summary.total;
    this.elements.qaStatCoverage.textContent = `${summary.passRate}%`;

    this.elements.btnRunAllTests.disabled = false;
    this.elements.btnRunAllTests.innerHTML = '<span>▶️</span> Re-Run QA Tests';
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PopularDestinationsApp();
  app.init();
});
