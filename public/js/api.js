/**
 * API Client Module
 * Handles API calls, Bearer token authentication, and standardized response handling
 */
const API = {
  TOKEN_KEY: 'manage_user_auth_token',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  },

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // If 401 Unauthorized, token might be invalid or expired
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          console.warn('Session expired or unauthorized. Re-authenticating...');
        }
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.errors = data.errors || null;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const netError = new Error('Network error. Unable to reach server. Please check your connection.');
        netError.status = 0;
        throw netError;
      }
      throw err;
    }
  },

  // Auth & Session
  async getSession() {
    const data = await this.request('/auth/session');
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async getUsersList() {
    return await this.request('/auth/users-list');
  },

  async switchUser(userId) {
    const data = await this.request('/auth/switch', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  // Profile Endpoints
  async getProfile() {
    return await this.request('/profile');
  },

  async updateProfile(profileData) {
    return await this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async updateAvatar(avatarUrl) {
    return await this.request('/profile/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_url: avatarUrl })
    });
  },

  // Security & Authentication Endpoints
  async changePassword(passwordData) {
    return await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  async toggle2FA(enabled) {
    return await this.request('/auth/2fa/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
  },

  async revokeOtherSessions() {
    return await this.request('/auth/sessions/revoke-others', {
      method: 'POST'
    });
  },

  async getActivities() {
    return await this.request('/auth/activities');
  },

  async updatePreferences(prefData) {
    return await this.request('/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefData)
    });
  },

  logout() {
    this.setToken(null);
    window.location.reload();
  }
};

window.API = API;
