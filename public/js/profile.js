/**
 * User Profile Management Logic & State Controller
 * Manages view/edit mode lifecycle, API persistence, and reactive updates
 */

const ProfileController = {
  currentUser: null,
  originalProfile: null,
  isEditing: false,
  isSaving: false,

  // DOM Elements Cache
  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadProfile();
  },

  cacheElements() {
    this.elements = {
      // Containers & Banners
      editBanner: document.getElementById('edit-mode-banner'),
      personalInfoView: document.getElementById('personal-info-view'),
      personalInfoEdit: document.getElementById('personal-info-edit'),
      additionalInfoView: document.getElementById('additional-info-view'),
      additionalInfoEdit: document.getElementById('additional-info-edit'),
      profileForm: document.getElementById('profile-edit-form'),

      // Buttons
      btnEditProfile: document.getElementById('btn-edit-profile'),
      btnSaveTop: document.getElementById('btn-save-top'),
      btnCancelTop: document.getElementById('btn-cancel-top'),
      btnSaveBottom: document.getElementById('btn-save-bottom'),
      btnCancelBottom: document.getElementById('btn-cancel-bottom'),
      btnChangeAvatar: document.getElementById('btn-change-avatar'),

      // Header UI
      profileAvatarImg: document.getElementById('profile-avatar-img'),
      profileAvatarFallback: document.getElementById('profile-avatar-fallback'),
      profileFullNameHeader: document.getElementById('profile-full-name-header'),
      profileEmailHeader: document.getElementById('profile-email-header'),
      profileRoleHeader: document.getElementById('profile-role-header'),
      profileDeptHeader: document.getElementById('profile-dept-header'),

      // View Mode Fields
      viewFullName: document.getElementById('view-full-name'),
      viewEmail: document.getElementById('view-email'),
      viewPhone: document.getElementById('view-phone'),
      viewDob: document.getElementById('view-dob'),
      viewGender: document.getElementById('view-gender'),
      viewLocation: document.getElementById('view-location'),
      viewBio: document.getElementById('view-bio'),
      viewDepartment: document.getElementById('view-department'),
      viewRole: document.getElementById('view-role'),
      viewTimezone: document.getElementById('view-timezone'),
      viewLanguage: document.getElementById('view-language'),

      // Edit Mode Form Inputs
      inputFullName: document.getElementById('input-full-name'),
      inputEmail: document.getElementById('input-email'),
      inputPhone: document.getElementById('input-phone'),
      inputDob: document.getElementById('input-dob'),
      inputGender: document.getElementById('input-gender'),
      inputLocation: document.getElementById('input-location'),
      inputBio: document.getElementById('input-bio'),
      inputRole: document.getElementById('input-role'),
      inputDepartment: document.getElementById('input-department'),
      inputTimezone: document.getElementById('input-timezone'),
      inputLanguage: document.getElementById('input-language'),
      bioCharCounter: document.getElementById('bio-char-counter'),

      // Sidebar & Side stats
      statCreatedAt: document.getElementById('stat-created-at'),
      statUpdatedAt: document.getElementById('stat-updated-at'),
      completionPercent: document.getElementById('profile-completion-percent'),
      completionProgressBar: document.getElementById('completion-progress-bar'),

      // Skeleton loaders
      skeletonContainers: document.querySelectorAll('.skeleton-wrapper')
    };
  },

  bindEvents() {
    // Edit Button
    if (this.elements.btnEditProfile) {
      this.elements.btnEditProfile.addEventListener('click', () => this.enterEditMode());
    }

    // Top Save/Cancel
    if (this.elements.btnSaveTop) {
      this.elements.btnSaveTop.addEventListener('click', () => this.handleSave());
    }
    if (this.elements.btnCancelTop) {
      this.elements.btnCancelTop.addEventListener('click', () => this.cancelEdit());
    }

    // Bottom Save/Cancel
    if (this.elements.btnSaveBottom) {
      this.elements.btnSaveBottom.addEventListener('click', () => this.handleSave());
    }
    if (this.elements.btnCancelBottom) {
      this.elements.btnCancelBottom.addEventListener('click', () => this.cancelEdit());
    }

    // Form Submit
    if (this.elements.profileForm) {
      this.elements.profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSave();
      });
    }

    // Real-time input validation & counter updates
    const inputsToValidate = [
      this.elements.inputFullName,
      this.elements.inputEmail,
      this.elements.inputPhone,
      this.elements.inputDob,
      this.elements.inputLocation
    ];

    inputsToValidate.forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        const error = Validation.validateField(input.name, input.value);
        if (error) {
          Validation.showError(input, error);
        } else {
          Validation.clearError(input);
        }
      });
      input.addEventListener('blur', () => {
        const error = Validation.validateField(input.name, input.value);
        if (error) {
          Validation.showError(input, error);
        } else {
          Validation.clearError(input);
        }
      });
    });

    // Bio character counter
    if (this.elements.inputBio) {
      this.elements.inputBio.addEventListener('input', (e) => {
        const length = e.target.value.length;
        if (this.elements.bioCharCounter) {
          this.elements.bioCharCounter.textContent = `${length} / 500 characters`;
          if (length > 500) {
            this.elements.bioCharCounter.style.color = 'var(--error-solid)';
          } else {
            this.elements.bioCharCounter.style.color = 'var(--text-muted)';
          }
        }
      });
    }

    // Copy to clipboard triggers
    document.querySelectorAll('.copy-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-copy-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const textToCopy = targetElement.textContent.trim();
          navigator.clipboard.writeText(textToCopy).then(() => {
            Toast.info('Copied to clipboard', textToCopy);
          });
        }
      });
    });

    // Avatar upload/change prompt
    if (this.elements.btnChangeAvatar) {
      this.elements.btnChangeAvatar.addEventListener('click', () => {
        const newUrl = prompt(
          'Update Profile Avatar\nEnter the image URL (or leave blank to use default photo):',
          this.currentUser?.avatar_url || ''
        );
        if (newUrl !== null) {
          this.updateAvatar(newUrl.trim() || '/assets/images/avatar.jpg');
        }
      });
    }

    // Keyboard Shortcuts (Esc to cancel edit, Ctrl+S to save)
    window.addEventListener('keydown', (e) => {
      if (this.isEditing) {
        if (e.key === 'Escape') {
          this.cancelEdit();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          this.handleSave();
        }
      }
    });
  },

  /**
   * Load profile from backend
   */
  async loadProfile() {
    this.showSkeletons(true);

    try {
      // First ensure session is loaded
      await API.getSession();
      
      const response = await API.getProfile();
      if (response && response.user) {
        this.currentUser = response.user;
        this.originalProfile = { ...response.user };
        this.renderProfileData(this.currentUser);
        this.updateProfileCompletion(this.currentUser);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      Toast.error('Failed to load profile', error.message || 'Please refresh the page to retry.');
    } finally {
      this.showSkeletons(false);
    }
  },

  /**
   * Render profile data into View Mode elements
   */
  renderProfileData(user) {
    if (!user) return;

    // Header Info
    if (this.elements.profileFullNameHeader) {
      this.elements.profileFullNameHeader.textContent = user.full_name || 'Anonymous User';
    }
    if (this.elements.profileEmailHeader) {
      this.elements.profileEmailHeader.textContent = user.email || 'No email specified';
    }
    if (this.elements.profileRoleHeader) {
      this.elements.profileRoleHeader.textContent = user.role || 'Member';
    }
    if (this.elements.profileDeptHeader) {
      this.elements.profileDeptHeader.textContent = user.department || 'General';
    }

    // Avatar
    this.renderAvatar(user);

    // Personal Info View Fields
    this.setFieldText(this.elements.viewFullName, user.full_name);
    this.setFieldText(this.elements.viewEmail, user.email);
    this.setFieldText(this.elements.viewPhone, user.phone);
    this.setFieldText(this.elements.viewDob, this.formatDate(user.date_of_birth));
    this.setFieldText(this.elements.viewGender, user.gender);
    this.setFieldText(this.elements.viewLocation, user.location);

    // Additional Info View Fields
    this.setFieldText(this.elements.viewBio, user.bio, 'No personal bio added yet.');
    this.setFieldText(this.elements.viewDepartment, user.department);
    this.setFieldText(this.elements.viewRole, user.role);
    this.setFieldText(this.elements.viewTimezone, user.timezone);
    this.setFieldText(this.elements.viewLanguage, user.language);

    // Metadata stats
    if (this.elements.statCreatedAt && user.created_at) {
      this.elements.statCreatedAt.textContent = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (this.elements.statUpdatedAt && user.updated_at) {
      this.elements.statUpdatedAt.textContent = new Date(user.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Forward to Security & Preferences Controller
    if (window.SecurityController) {
      window.SecurityController.populateUserData(user);
    }

    // Topbar quick profile
    const topbarName = document.getElementById('topbar-user-name');
    if (topbarName) topbarName.textContent = user.full_name;

    const topbarAvatar = document.getElementById('topbar-avatar');
    if (topbarAvatar && user.avatar_url) {
      topbarAvatar.src = user.avatar_url;
      topbarAvatar.style.display = 'block';
    }
  },

  renderAvatar(user) {
    const initials = this.getInitials(user.full_name);

    if (user.avatar_url) {
      this.elements.profileAvatarImg.src = user.avatar_url;
      this.elements.profileAvatarImg.alt = `${user.full_name}'s avatar`;
      this.elements.profileAvatarImg.style.display = 'block';
      this.elements.profileAvatarFallback.style.display = 'none';

      // Fallback on error
      this.elements.profileAvatarImg.onerror = () => {
        this.elements.profileAvatarImg.style.display = 'none';
        this.elements.profileAvatarFallback.style.display = 'flex';
        this.elements.profileAvatarFallback.textContent = initials;
      };
    } else {
      this.elements.profileAvatarImg.style.display = 'none';
      this.elements.profileAvatarFallback.style.display = 'flex';
      this.elements.profileAvatarFallback.textContent = initials;
    }
  },

  getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  },

  setFieldText(element, value, emptyPlaceholder = 'Not provided') {
    if (!element) return;
    if (value && String(value).trim()) {
      element.textContent = value;
      element.classList.remove('view-field-empty');
    } else {
      element.textContent = emptyPlaceholder;
      element.classList.add('view-field-empty');
    }
  },

  formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Switch into Edit Mode
   */
  enterEditMode() {
    if (this.isEditing) return;

    this.isEditing = true;
    Validation.clearAll(this.elements.profileForm);

    // Populate Edit Mode inputs with current values
    if (this.currentUser) {
      this.elements.inputFullName.value = this.currentUser.full_name || '';
      this.elements.inputEmail.value = this.currentUser.email || '';
      this.elements.inputPhone.value = this.currentUser.phone || '';
      this.elements.inputDob.value = this.currentUser.date_of_birth || '';
      this.elements.inputGender.value = this.currentUser.gender || 'Prefer not to say';
      this.elements.inputLocation.value = this.currentUser.location || '';
      this.elements.inputBio.value = this.currentUser.bio || '';
      this.elements.inputRole.value = this.currentUser.role || '';
      this.elements.inputDepartment.value = this.currentUser.department || '';
      this.elements.inputTimezone.value = this.currentUser.timezone || 'Asia/Kolkata (IST)';
      this.elements.inputLanguage.value = this.currentUser.language || 'English (India)';

      // Trigger bio counter
      if (this.elements.bioCharCounter) {
        const length = (this.currentUser.bio || '').length;
        this.elements.bioCharCounter.textContent = `${length} / 500 characters`;
      }
    }

    // Toggle views
    this.elements.personalInfoView.style.display = 'none';
    this.elements.personalInfoEdit.style.display = 'block';
    this.elements.additionalInfoView.style.display = 'none';
    this.elements.additionalInfoEdit.style.display = 'block';

    // Show banners & styling
    this.elements.editBanner.classList.add('active');
    document.querySelectorAll('.profile-card').forEach(card => card.classList.add('card-editing'));
    this.elements.btnEditProfile.style.display = 'none';

    // Focus first input
    setTimeout(() => {
      this.elements.inputFullName.focus();
    }, 50);

    Toast.info('Editing Mode Enabled', 'You can now update your personal information.');
  },

  /**
   * Discard unsaved changes and return to View Mode
   */
  cancelEdit() {
    if (!this.isEditing) return;

    Validation.clearAll(this.elements.profileForm);

    // Toggle views back
    this.elements.personalInfoView.style.display = 'block';
    this.elements.personalInfoEdit.style.display = 'none';
    this.elements.additionalInfoView.style.display = 'block';
    this.elements.additionalInfoEdit.style.display = 'none';

    // Remove banners & editing highlights
    this.elements.editBanner.classList.remove('active');
    document.querySelectorAll('.profile-card').forEach(card => card.classList.remove('card-editing'));
    this.elements.btnEditProfile.style.display = 'inline-flex';

    this.isEditing = false;
    Toast.info('Changes discarded', 'Your profile details were restored.');
  },

  /**
   * Validate and Submit updated profile
   */
  async handleSave() {
    if (this.isSaving) return;

    // Collect Form Data
    const formData = {
      full_name: this.elements.inputFullName.value,
      email: this.elements.inputEmail.value,
      phone: this.elements.inputPhone.value,
      date_of_birth: this.elements.inputDob.value || null,
      gender: this.elements.inputGender.value,
      location: this.elements.inputLocation.value,
      bio: this.elements.inputBio.value,
      role: this.elements.inputRole.value,
      department: this.elements.inputDepartment.value,
      timezone: this.elements.inputTimezone.value,
      language: this.elements.inputLanguage.value
    };

    // Client-side validation
    const { isValid, errors } = Validation.validateAll(formData);

    if (!isValid) {
      let firstErrorInput = null;

      for (const [fieldName, errorMsg] of Object.entries(errors)) {
        const inputElem = this.elements.profileForm.querySelector(`[name="${fieldName}"]`);
        if (inputElem) {
          Validation.showError(inputElem, errorMsg);
          if (!firstErrorInput) firstErrorInput = inputElem;
        }
      }

      if (firstErrorInput) {
        firstErrorInput.focus();
      }

      Toast.error('Validation Failed', 'Please fix the highlighted errors before saving.');
      return;
    }

    // Set Saving State
    this.setSavingState(true);

    try {
      const response = await API.updateProfile(formData);

      if (response && response.success) {
        this.currentUser = response.user;
        this.originalProfile = { ...response.user };

        // Re-render view mode with freshly updated profile
        this.renderProfileData(this.currentUser);
        this.updateProfileCompletion(this.currentUser);

        // Return to View Mode
        this.elements.personalInfoView.style.display = 'block';
        this.elements.personalInfoEdit.style.display = 'none';
        this.elements.additionalInfoView.style.display = 'block';
        this.elements.additionalInfoEdit.style.display = 'none';

        this.elements.editBanner.classList.remove('active');
        document.querySelectorAll('.profile-card').forEach(card => card.classList.remove('card-editing'));
        this.elements.btnEditProfile.style.display = 'inline-flex';

        this.isEditing = false;

        Toast.success('Profile updated successfully.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);

      // Handle backend validation errors
      if (error.errors) {
        for (const [field, message] of Object.entries(error.errors)) {
          const input = this.elements.profileForm.querySelector(`[name="${field}"]`);
          if (input) Validation.showError(input, message);
        }
      }

      Toast.error('Could not save changes', error.message || 'An unexpected error occurred while saving.');
    } finally {
      this.setSavingState(false);
    }
  },

  setSavingState(saving) {
    this.isSaving = saving;
    const saveButtons = [this.elements.btnSaveTop, this.elements.btnSaveBottom];
    const cancelButtons = [this.elements.btnCancelTop, this.elements.btnCancelBottom];

    saveButtons.forEach(btn => {
      if (!btn) return;
      btn.disabled = saving;
      if (saving) {
        btn.innerHTML = `<span class="spinner"></span> <span>Saving...</span>`;
      } else {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Save Changes</span>
        `;
      }
    });

    cancelButtons.forEach(btn => {
      if (btn) btn.disabled = saving;
    });

    // Disable inputs while saving
    const inputs = this.elements.profileForm.querySelectorAll('input, select, textarea');
    inputs.forEach(i => i.disabled = saving);
  },

  async updateAvatar(avatarUrl) {
    try {
      const response = await API.updateAvatar(avatarUrl);
      if (response && response.user) {
        this.currentUser = response.user;
        this.renderAvatar(this.currentUser);
        Toast.success('Avatar updated', 'Your profile picture was successfully updated.');
      }
    } catch (err) {
      Toast.error('Avatar update failed', err.message);
    }
  },

  updateProfileCompletion(user) {
    if (!user) return;
    const fields = [
      user.full_name,
      user.email,
      user.phone,
      user.date_of_birth,
      user.gender,
      user.location,
      user.bio,
      user.role,
      user.department
    ];

    const filledCount = fields.filter(f => f && String(f).trim().length > 0).length;
    const percentage = Math.round((filledCount / fields.length) * 100);

    if (this.elements.completionPercent) {
      this.elements.completionPercent.textContent = `${percentage}%`;
    }
    if (this.elements.completionProgressBar) {
      this.elements.completionProgressBar.style.width = `${percentage}%`;
    }
  },

  showSkeletons(show) {
    const mainSections = document.querySelectorAll('.profile-content-container');
    mainSections.forEach(section => {
      section.style.opacity = show ? '0.4' : '1';
      section.style.pointerEvents = show ? 'none' : 'auto';
    });
  }
};

window.ProfileController = ProfileController;
