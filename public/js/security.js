/**
 * Security, Authentication & Preferences Controller
 * Handles Password Changes, 2FA toggle, Session management, and Preferences
 */

const SecurityController = {
  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadActivities();
  },

  cacheElements() {
    this.elements = {
      // Password form elements
      formPassword: document.getElementById('form-change-password'),
      inputCurrentPassword: document.getElementById('input-current-password'),
      inputNewPassword: document.getElementById('input-new-password'),
      inputConfirmPassword: document.getElementById('input-confirm-password'),
      btnUpdatePassword: document.getElementById('btn-update-password'),
      strengthBars: document.querySelectorAll('.strength-bar-segment'),
      strengthLabel: document.getElementById('strength-label'),

      // 2FA elements
      toggle2FA: document.getElementById('toggle-2fa-input'),
      badge2FA: document.getElementById('badge-2fa-status'),

      // Sessions elements
      btnRevokeSessions: document.getElementById('btn-revoke-sessions'),

      // Preferences elements
      formPreferences: document.getElementById('form-preferences'),
      prefTimezone: document.getElementById('pref-timezone'),
      prefLanguage: document.getElementById('pref-language'),
      prefDateFormat: document.getElementById('pref-date-format'),
      prefEmailNotifs: document.getElementById('pref-email-notifs'),
      prefSecurityNotifs: document.getElementById('pref-security-notifs'),
      btnSavePreferences: document.getElementById('btn-save-preferences'),

      // Activity list
      activityContainer: document.getElementById('security-activity-list')
    };
  },

  bindEvents() {
    // 1. Password Visibility Eye Toggles
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (!targetInput) return;

        const isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';

        // Toggle icon
        btn.innerHTML = isPassword
          ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
          : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      });
    });

    // 2. Real-time Password Strength Meter
    if (this.elements.inputNewPassword) {
      this.elements.inputNewPassword.addEventListener('input', (e) => {
        this.updateStrengthMeter(e.target.value);
      });
    }

    // 3. Password Change Form Submission
    if (this.elements.formPassword) {
      this.elements.formPassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handlePasswordChange();
      });
    }

    // 4. Two-Factor Authentication Toggle
    if (this.elements.toggle2FA) {
      this.elements.toggle2FA.addEventListener('change', async (e) => {
        const isEnabled = e.target.checked;
        await this.handle2FAToggle(isEnabled);
      });
    }

    // 5. Revoke Other Sessions
    if (this.elements.btnRevokeSessions) {
      this.elements.btnRevokeSessions.addEventListener('click', async () => {
        if (confirm('Sign out of all other devices and browser sessions?')) {
          await this.handleRevokeSessions();
        }
      });
    }

    // 6. Preferences Form Submission
    if (this.elements.formPreferences) {
      this.elements.formPreferences.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handlePreferencesSave();
      });
    }
  },

  updateStrengthMeter(password) {
    if (!this.elements.strengthBars || !this.elements.strengthLabel) return;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const colors = ['var(--border-subtle)', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
    const labels = ['None', 'Weak (min 8 chars)', 'Fair (add numbers)', 'Good (add special chars)', 'Strong Password'];

    this.elements.strengthBars.forEach((bar, index) => {
      if (index < score) {
        bar.style.backgroundColor = colors[score];
      } else {
        bar.style.backgroundColor = 'var(--border-subtle)';
      }
    });

    this.elements.strengthLabel.textContent = `Strength: ${labels[score]}`;
    this.elements.strengthLabel.style.color = colors[score] === 'var(--border-subtle)' ? 'var(--text-muted)' : colors[score];
  },

  async handlePasswordChange() {
    const current_password = this.elements.inputCurrentPassword.value.trim();
    const new_password = this.elements.inputNewPassword.value.trim();
    const confirm_password = this.elements.inputConfirmPassword.value.trim();

    if (!current_password) {
      Toast.error('Current password is required.');
      this.elements.inputCurrentPassword.focus();
      return;
    }

    if (new_password.length < 8) {
      Toast.error('Password length', 'New password must contain at least 8 characters.');
      this.elements.inputNewPassword.focus();
      return;
    }

    if (new_password !== confirm_password) {
      Toast.error('Mismatch', 'New password and confirmation password do not match.');
      this.elements.inputConfirmPassword.focus();
      return;
    }

    this.elements.btnUpdatePassword.disabled = true;
    this.elements.btnUpdatePassword.innerHTML = `<span class="spinner"></span> <span>Updating Password...</span>`;

    try {
      const response = await API.changePassword({
        current_password,
        new_password,
        confirm_password
      });

      if (response && response.success) {
        Toast.success('Password Updated', 'Your security password has been successfully updated.');
        this.elements.formPassword.reset();
        this.updateStrengthMeter('');
        await this.loadActivities();
      }
    } catch (err) {
      Toast.error('Password Update Failed', err.message || 'Please check your current password.');
    } finally {
      this.elements.btnUpdatePassword.disabled = false;
      this.elements.btnUpdatePassword.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Update Password</span>
      `;
    }
  },

  async handle2FAToggle(enabled) {
    try {
      const response = await API.toggle2FA(enabled);
      if (response && response.success) {
        if (this.elements.badge2FA) {
          if (enabled) {
            this.elements.badge2FA.textContent = 'Active & Protected';
            this.elements.badge2FA.className = 'badge-current-device';
          } else {
            this.elements.badge2FA.textContent = 'Disabled';
            this.elements.badge2FA.className = 'nav-badge-pill';
          }
        }
        Toast.success('2FA Updated', response.message);
        await this.loadActivities();
      }
    } catch (err) {
      Toast.error('2FA Update Error', err.message);
      // Revert toggle
      this.elements.toggle2FA.checked = !enabled;
    }
  },

  async handleRevokeSessions() {
    this.elements.btnRevokeSessions.disabled = true;
    try {
      const response = await API.revokeOtherSessions();
      Toast.success('Sessions Revoked', response.message);
      const otherDeviceCard = document.getElementById('device-card-mobile');
      if (otherDeviceCard) {
        otherDeviceCard.style.opacity = '0.5';
        const statusSpan = otherDeviceCard.querySelector('.device-meta');
        if (statusSpan) statusSpan.textContent = 'Signed out';
      }
      await this.loadActivities();
    } catch (err) {
      Toast.error('Revocation Error', err.message);
    } finally {
      this.elements.btnRevokeSessions.disabled = false;
    }
  },

  async handlePreferencesSave() {
    const prefData = {
      timezone: this.elements.prefTimezone.value,
      language: this.elements.prefLanguage.value,
      date_format: this.elements.prefDateFormat.value,
      notification_email: this.elements.prefEmailNotifs.checked ? 1 : 0,
      notification_security: this.elements.prefSecurityNotifs.checked ? 1 : 0
    };

    this.elements.btnSavePreferences.disabled = true;
    this.elements.btnSavePreferences.innerHTML = `<span class="spinner"></span> <span>Saving...</span>`;

    try {
      const response = await API.updatePreferences(prefData);
      if (response && response.success) {
        Toast.success('Preferences Saved', 'Your regional and notification preferences were updated.');
        // Also update view fields in Profile controller if active
        if (window.ProfileController && ProfileController.elements.viewTimezone) {
          ProfileController.elements.viewTimezone.textContent = prefData.timezone;
          ProfileController.elements.viewLanguage.textContent = prefData.language;
        }
      }
    } catch (err) {
      Toast.error('Preferences Error', err.message);
    } finally {
      this.elements.btnSavePreferences.disabled = false;
      this.elements.btnSavePreferences.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Save Preferences</span>
      `;
    }
  },

  async loadActivities() {
    if (!this.elements.activityContainer) return;

    try {
      const data = await API.getActivities();
      if (data && data.activities && data.activities.length > 0) {
        this.elements.activityContainer.innerHTML = data.activities.map(act => `
          <div class="activity-item">
            <div class="activity-bullet"></div>
            <div class="activity-content">
              <div class="activity-title">${act.action}</div>
              <div class="activity-desc">${act.description} • ${act.device}</div>
              <div class="activity-time">${new Date(act.created_at).toLocaleString()}</div>
            </div>
          </div>
        `).join('');
      } else {
        this.elements.activityContainer.innerHTML = `
          <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.75rem 0;">
            No recent security alerts recorded.
          </div>
        `;
      }
    } catch (err) {
      console.warn('Could not load activity log:', err);
    }
  },

  populateUserData(user) {
    if (!user) return;
    if (this.elements.toggle2FA) {
      this.elements.toggle2FA.checked = !!user.two_factor_enabled;
    }
    if (this.elements.badge2FA) {
      if (user.two_factor_enabled) {
        this.elements.badge2FA.textContent = 'Active & Protected';
        this.elements.badge2FA.className = 'badge-current-device';
      } else {
        this.elements.badge2FA.textContent = 'Disabled';
        this.elements.badge2FA.className = 'nav-badge-pill';
      }
    }
    if (this.elements.prefTimezone) {
      this.elements.prefTimezone.value = user.timezone || 'Asia/Kolkata (IST)';
    }
    if (this.elements.prefLanguage) {
      this.elements.prefLanguage.value = user.language || 'English (India)';
    }
    if (this.elements.prefDateFormat) {
      this.elements.prefDateFormat.value = user.date_format || 'DD/MM/YYYY';
    }
    if (this.elements.prefEmailNotifs) {
      this.elements.prefEmailNotifs.checked = user.notification_email !== 0;
    }
    if (this.elements.prefSecurityNotifs) {
      this.elements.prefSecurityNotifs.checked = user.notification_security !== 0;
    }
  }
};

window.SecurityController = SecurityController;
