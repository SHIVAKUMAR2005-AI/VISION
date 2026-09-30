/**
 * UI Renderer Module
 * Handles DOM generation for Destination Cards (Subtask 1),
 * State Views (Subtask 3), and Details View (Subtask 4).
 */

import { INTEREST_CATEGORIES } from './data.js';

export class UIRenderer {
  constructor(elements, callbacks) {
    this.elements = elements;
    this.callbacks = callbacks;
  }

  /**
   * Render Category Filter Tabs
   */
  renderCategoryTabs(selectedCategory = 'all') {
    if (!this.elements.categoryTabs) return;

    this.elements.categoryTabs.innerHTML = INTEREST_CATEGORIES.map(cat => `
      <button 
        class="category-tab ${cat.id === selectedCategory ? 'active' : ''}" 
        data-category="${cat.id}"
        id="cat-tab-${cat.id}"
        type="button"
      >
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
      </button>
    `).join('');
  }

  /**
   * Render User Interest Selector Chips (Subtask 2 UI Trigger)
   */
  renderInterestChips(selectedInterests = []) {
    if (!this.elements.interestChips) return;

    // Filter out 'all' category for the interests toggle
    const interestOptions = INTEREST_CATEGORIES.filter(c => c.id !== 'all');

    this.elements.interestChips.innerHTML = interestOptions.map(cat => {
      const isSelected = selectedInterests.includes(cat.id);
      return `
        <button 
          class="interest-chip ${isSelected ? 'active' : ''}" 
          data-interest="${cat.id}"
          id="chip-interest-${cat.id}"
          type="button"
          aria-pressed="${isSelected}"
        >
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
          ${isSelected ? '<span>✓</span>' : ''}
        </button>
      `;
    }).join('');
  }

  /**
   * Subtask 1: Render Destination Cards List / Grid
   */
  renderDestinationsList(destinations, selectedInterests = []) {
    if (!this.elements.destinationsContainer) return;

    this.elements.destinationsContainer.innerHTML = destinations.map((dest, index) => {
      const isTopRanked = index === 0;
      const hasInterests = selectedInterests.length > 0;

      return `
        <article 
          class="destination-card fade-in" 
          data-id="${dest.id}"
          id="dest-card-${dest.id}"
          tabindex="0"
          role="button"
          aria-label="View details for ${dest.name}, ${dest.location}"
        >
          <div class="card-image-wrap">
            <img 
              src="${dest.image}" 
              alt="${dest.name}" 
              class="card-img" 
              loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'"
            />
            <div class="card-overlay-top">
              <span class="badge-popularity">
                <span>🔥</span> ${dest.popularityScore}% Popularity
              </span>
              ${hasInterests ? `
                <span class="badge-match">
                  <span>✨</span> ${dest.matchPercentage}% Match
                </span>
              ` : (isTopRanked ? `
                <span class="badge-match" style="background: linear-gradient(135deg, #f59e0b, #f97316);">
                  <span>🏆</span> #1 Top Pick
                </span>
              ` : '')}
            </div>
            <div class="card-overlay-bottom"></div>
          </div>

          <div class="card-body">
            <div class="card-header-row">
              <h3 class="card-title">${dest.name}</h3>
              <div class="card-rating" title="${dest.rating} out of 5 stars (${dest.reviewCount.toLocaleString()} reviews)">
                <span class="rating-star">★</span>
                <span>${dest.rating.toFixed(2)}</span>
              </div>
            </div>

            <div class="card-location">
              <span>📍</span>
              <span>${dest.location}</span>
            </div>

            <p class="card-description">${dest.shortDescription}</p>

            <div class="card-tags">
              ${(dest.tags || []).slice(0, 4).map(tag => {
                const isMatched = selectedInterests.includes(tag);
                return `<span class="card-tag ${isMatched ? 'highlight' : ''}">${tag}</span>`;
              }).join('')}
            </div>

            <div class="card-footer">
              <div class="card-price-info">
                <span class="card-price-label">Daily Budget</span>
                <span class="card-price-val">${dest.priceRange} (${dest.estimatedDailyBudget.split('/')[0].trim()})</span>
              </div>
              <span class="btn-view-details">
                View Details <span>→</span>
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Subtask 3: Loading Skeletons State
   */
  renderLoadingState(count = 6) {
    if (!this.elements.destinationsContainer) return;

    const skeletons = Array(count).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line" style="width: 85%;"></div>
          <div class="skeleton-line tag"></div>
        </div>
      </div>
    `).join('');

    this.elements.destinationsContainer.innerHTML = skeletons;
  }

  /**
   * Subtask 3: Empty State
   */
  renderEmptyState() {
    if (!this.elements.destinationsContainer) return;

    this.elements.destinationsContainer.innerHTML = `
      <div class="state-container empty-state fade-in" style="grid-column: 1 / -1;" id="empty-state-view">
        <div class="state-icon-wrapper">🔍</div>
        <h3 class="state-title">No Destinations Found</h3>
        <p class="state-description">
          We couldn't find any travel destinations matching your search keywords or filter criteria. Try broadening your keywords or resetting filters.
        </p>
        <button class="btn btn-primary" id="btn-reset-filters" type="button">
          <span>🔄</span> Reset All Filters
        </button>
      </div>
    `;
  }

  /**
   * Subtask 3: Error State with Retry Action
   */
  renderErrorState(errorMessage = 'Unable to connect to the destination catalog.') {
    if (!this.elements.destinationsContainer) return;

    this.elements.destinationsContainer.innerHTML = `
      <div class="state-container error-state fade-in" style="grid-column: 1 / -1;" id="error-state-view">
        <div class="state-icon-wrapper">⚠️</div>
        <span class="error-badge">Catalog Load Error</span>
        <h3 class="state-title">Failed to Load Destinations</h3>
        <p class="state-description">
          ${errorMessage} Please check your network connection and try again.
        </p>
        <button class="btn btn-primary" id="btn-retry-fetch" type="button">
          <span>🔄</span> Retry Loading Destinations
        </button>
      </div>
    `;
  }

  /**
   * Subtask 4: Destination Details View
   */
  renderDetailsView(destination) {
    if (!this.elements.detailsView) return;

    if (!destination) {
      this.elements.detailsView.innerHTML = `
        <div class="state-container error-state">
          <h3 class="state-title">Destination Not Found</h3>
          <p class="state-description">The requested travel destination could not be located.</p>
          <button class="btn btn-primary" id="btn-details-back-fallback">← Back to Destinations</button>
        </div>
      `;
      return;
    }

    this.elements.detailsView.innerHTML = `
      <div class="details-nav-bar">
        <button class="btn-back" id="btn-details-back" type="button">
          <span>←</span> Back to Popular Destinations
        </button>
        <div class="details-breadcrumbs">
          <span class="breadcrumb-link" id="breadcrumb-home">Destinations</span>
          <span class="breadcrumb-separator">/</span>
          <span>${destination.category}</span>
          <span class="breadcrumb-separator">/</span>
          <span style="color: var(--text-primary); font-weight: 600;">${destination.name}</span>
        </div>
      </div>

      <div class="details-hero">
        <div class="details-hero-image-wrap">
          <img 
            src="${destination.image}" 
            alt="${destination.name}" 
            class="details-hero-img" 
            id="details-active-hero-img"
          />
          <div class="details-hero-gradient"></div>
        </div>

        <div class="details-hero-content">
          <div class="details-title-block">
            <div class="details-hero-badges">
              <span class="badge-popularity">🔥 ${destination.popularityScore}% Popularity</span>
              <span class="badge-match">⭐ ${destination.rating.toFixed(2)} (${destination.reviewCount.toLocaleString()} Reviews)</span>
              <span class="card-tag highlight">${destination.category}</span>
            </div>
            <h1 class="details-title">${destination.name}</h1>
            <div class="details-location">
              <span>📍</span> ${destination.location}
            </div>
          </div>

          <div class="details-hero-actions">
            <button class="btn btn-secondary" id="btn-share-dest" type="button">
              <span>🔗</span> Share
            </button>
            <button class="btn btn-primary" id="btn-book-tour" type="button">
              <span>✈️</span> Explore Trips
            </button>
          </div>
        </div>
      </div>

      <div class="details-gallery-strip" id="details-gallery-strip">
        ${(destination.gallery || [destination.image]).map((imgUrl, i) => `
          <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-url="${imgUrl}">
            <img src="${imgUrl}" alt="${destination.name} thumbnail ${i + 1}" />
          </div>
        `).join('')}
      </div>

      <div class="details-grid" style="margin-top: 2rem;">
        <div class="details-main-col">
          <section class="details-section-card">
            <h2 class="section-title"><span>📖</span> Overview</h2>
            <p class="details-paragraph">${destination.fullDescription}</p>
          </section>

          <section class="details-section-card">
            <h2 class="section-title"><span>✨</span> Experience Highlights</h2>
            <ul class="highlights-list">
              ${(destination.highlights || []).map(hl => `
                <li class="highlight-item">
                  <span class="highlight-bullet">✦</span>
                  <span>${hl}</span>
                </li>
              `).join('')}
            </ul>
          </section>

          <section class="details-section-card">
            <h2 class="section-title"><span>🗺️</span> Top Attractions & Landmarks</h2>
            <div class="attractions-grid">
              ${(destination.topAttractions || []).map(att => `
                <div class="attraction-card">
                  <span class="attraction-name">${att.name}</span>
                  <span class="attraction-type">${att.type}</span>
                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <aside class="details-side-col">
          <div class="quick-info-card">
            <h3 class="section-title" style="font-size: 1.15rem;"><span>🧭</span> Trip Planner Guide</h3>
            <div class="info-stat-group">
              <div class="info-stat">
                <div class="info-stat-icon">🗓️</div>
                <div>
                  <div class="info-stat-label">Best Time To Visit</div>
                  <div class="info-stat-value">${destination.bestTimeToVisit}</div>
                </div>
              </div>

              <div class="info-stat">
                <div class="info-stat-icon">🌤️</div>
                <div>
                  <div class="info-stat-label">Climate & Weather</div>
                  <div class="info-stat-value">${destination.weather}</div>
                </div>
              </div>

              <div class="info-stat">
                <div class="info-stat-icon">💰</div>
                <div>
                  <div class="info-stat-label">Estimated Daily Budget</div>
                  <div class="info-stat-value">${destination.estimatedDailyBudget}</div>
                </div>
              </div>

              <div class="info-stat">
                <div class="info-stat-icon">🏷️</div>
                <div>
                  <div class="info-stat-label">Interest Tags</div>
                  <div class="card-tags" style="margin-top: 0.4rem;">
                    ${(destination.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="cta-box">
              <button class="btn btn-primary btn-block" id="btn-save-itinerary" type="button">
                <span>❤️</span> Save to My Wishlist
              </button>
            </div>
          </div>
        </aside>
      </div>
    `;

    // Bind Gallery Thumbnails click
    const thumbs = this.elements.detailsView.querySelectorAll('.gallery-thumb');
    const heroImg = this.elements.detailsView.querySelector('#details-active-hero-img');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (heroImg) {
          heroImg.src = thumb.getAttribute('data-url');
        }
      });
    });
  }

  /**
   * Display temporary toast banner
   */
  showToast(message, duration = 3000) {
    const existing = document.querySelector('.toast-notice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
