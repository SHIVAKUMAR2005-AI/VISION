/**
 * Global Application Initializer & Navigation Manager
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Dark/Light mode)
  initTheme();

  // 2. Initialize Mobile Navigation
  initMobileNav();

  // 3. Initialize Demo User Switcher
  initUserSwitcher();

  // 4. Initialize Profile Controller
  if (window.ProfileController) {
    window.ProfileController.init();
  }

  // 5. Initialize Security Controller
  if (window.SecurityController) {
    window.SecurityController.init();
  }

  // 6. Initialize Multi-Tab Navigation
  initTabNavigation();
});

/**
 * Tab Navigation Manager
 * Handles switching between Personal Info, Security, Preferences, and Dashboard
 */
function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.profile-tab-button');
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

  function switchTab(targetTabId) {
    // 1. Update Tab Panes
    const allPanes = document.querySelectorAll('.tab-pane');
    allPanes.forEach(pane => {
      if (pane.id === `pane-${targetTabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // 2. Update Profile Tab Buttons
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 3. Update Sidebar Nav Items
    navItems.forEach(item => {
      if (item.getAttribute('data-tab-target') === targetTabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 4. Update Header Title and Breadcrumbs dynamically
    const pageTitleElem = document.querySelector('.profile-page-title span');
    const pageSubtitleElem = document.querySelector('.profile-page-subtitle');
    const breadcrumbCurrentElem = document.querySelector('.breadcrumb-current');

    const heroCard = document.querySelector('.profile-hero-card');

    if (targetTabId === 'personal') {
      if (pageTitleElem) pageTitleElem.textContent = 'My Profile';
      if (pageSubtitleElem) pageSubtitleElem.textContent = 'Manage your personal information, contact numbers, and workspace identity.';
      if (breadcrumbCurrentElem) breadcrumbCurrentElem.textContent = 'Manage Profile';
      if (heroCard) heroCard.style.display = 'block';
    } else if (targetTabId === 'security') {
      if (pageTitleElem) pageTitleElem.textContent = 'Security & Authentication';
      if (pageSubtitleElem) pageSubtitleElem.textContent = 'Manage account passwords, two-factor authentication, and connected device sessions.';
      if (breadcrumbCurrentElem) breadcrumbCurrentElem.textContent = 'Security & Authentication';
      if (heroCard) heroCard.style.display = 'block';
    } else if (targetTabId === 'preferences') {
      if (pageTitleElem) pageTitleElem.textContent = 'Preferences & Regional Settings';
      if (pageSubtitleElem) pageSubtitleElem.textContent = 'Configure your interface language, timezone, date formats, and notifications.';
      if (breadcrumbCurrentElem) breadcrumbCurrentElem.textContent = 'Preferences';
      if (heroCard) heroCard.style.display = 'block';
    } else if (targetTabId === 'dashboard') {
      if (pageTitleElem) pageTitleElem.textContent = 'Workspace Dashboard';
      if (pageSubtitleElem) pageSubtitleElem.textContent = 'Real-time overview of identity metrics, security score, and account health.';
      if (breadcrumbCurrentElem) breadcrumbCurrentElem.textContent = 'Dashboard';
      if (heroCard) heroCard.style.display = 'block';
    }

    // Scroll smoothly to top of main area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind Top Tab Buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (target) {
        window.location.hash = target;
        switchTab(target);
      }
    });
  });

  // Bind Sidebar Nav Links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = item.getAttribute('data-tab-target');
      if (target) {
        e.preventDefault();
        window.location.hash = target;
        switchTab(target);

        // Close mobile drawer if open
        const sidebar = document.querySelector('.app-sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
      }
    });
  });

  // Handle URL hash on load or back/forward navigation
  const handleHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['personal', 'security', 'preferences', 'dashboard'];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    } else {
      switchTab('personal');
    }
  };

  window.addEventListener('hashchange', handleHash);
  handleHash();
}

/**
 * Dark/Light Mode Theme Manager
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('app_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('app_theme', newTheme);
      Toast.info('Theme Changed', `Switched to ${newTheme} mode.`);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-toggle-icon');
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      themeIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  };

  if (menuBtn && sidebar && backdrop) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('open');
    });

    backdrop.addEventListener('click', closeSidebar);
  }
}

/**
 * Multi-User Switcher for testing profile isolation
 */
async function initUserSwitcher() {
  const switchBtn = document.getElementById('btn-switch-account');
  if (!switchBtn) return;

  switchBtn.addEventListener('click', async () => {
    try {
      const data = await API.getUsersList();
      if (!data || !data.users || data.users.length < 2) return;

      const currentEmail = ProfileController.currentUser?.email;
      const otherUser = data.users.find(u => u.email !== currentEmail) || data.users[0];

      if (confirm(`Switch authenticated session to "${otherUser.full_name}" (${otherUser.email})?`)) {
        const result = await API.switchUser(otherUser.id);
        Toast.success('Session Switched', `Logged in as ${result.user.full_name}`);
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (e) {
      console.error(e);
      Toast.error('Could not switch account', e.message);
    }
  });
}
