/**
 * Router Module for handling deep links, view toggling, and browser history.
 * Subtask 4: Destination Selection & Details Navigation
 */

export class AppRouter {
  constructor({ onRouteChanged }) {
    this.onRouteChanged = onRouteChanged;
    this.savedScrollPosition = 0;
    this.currentRoute = { view: 'list', destinationId: null };

    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  init() {
    this.handleHashChange();
  }

  /**
   * Parses the current URL hash into route information.
   * e.g. "" or "#" -> { view: 'list', destinationId: null }
   * e.g. "#destination-santorini-greece" -> { view: 'details', destinationId: 'santorini-greece' }
   */
  handleHashChange() {
    const hash = window.location.hash.slice(1); // remove '#'

    if (hash.startsWith('destination-')) {
      const destinationId = hash.replace('destination-', '');
      this.currentRoute = { view: 'details', destinationId };
    } else {
      this.currentRoute = { view: 'list', destinationId: null };
    }

    if (typeof this.onRouteChanged === 'function') {
      this.onRouteChanged(this.currentRoute);
    }
  }

  /**
   * Navigates to a specific destination details view.
   * @param {string} destinationId
   */
  navigateToDetails(destinationId) {
    this.savedScrollPosition = window.scrollY;
    window.location.hash = `destination-${destinationId}`;
  }

  /**
   * Navigates back to the destination list view and restores scroll position.
   */
  navigateToList() {
    window.location.hash = '';
    // Restore scroll after DOM updates
    setTimeout(() => {
      window.scrollTo({
        top: this.savedScrollPosition || 0,
        behavior: 'smooth'
      });
    }, 50);
  }
}
