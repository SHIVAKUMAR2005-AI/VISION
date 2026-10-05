/**
 * Form Validation Module
 * Enforces production-grade validation rules and accessible error rendering
 */
const Validation = {
  // Regex rules
  rules: {
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
    // Accepts 10 digits starting with 6,7,8,9, optionally prefixed with +91, 91, or 0, with optional spaces/hyphens
    indianPhone: /^(?:\+91|91|0)?[6-9]\d{9}$/,
    nameChars: /^[a-zA-Z\s\.\'\-]+$/
  },

  /**
   * Validate individual fields
   */
  validateField(fieldName, value) {
    const trimmed = (value !== null && value !== undefined) ? String(value).trim() : '';

    switch (fieldName) {
      case 'full_name':
        if (!trimmed) {
          return 'Full name is required.';
        }
        if (trimmed.length < 3) {
          return 'Full name must contain at least 3 characters.';
        }
        if (trimmed.length > 70) {
          return 'Full name cannot exceed 70 characters.';
        }
        if (!this.rules.nameChars.test(trimmed)) {
          return 'Full name can only contain letters, spaces, hyphens, and periods.';
        }
        return null;

      case 'email':
        if (!trimmed) {
          return 'Email address is required.';
        }
        if (!this.rules.email.test(trimmed)) {
          return 'Please enter a valid email address (e.g. name@domain.com).';
        }
        return null;

      case 'phone':
        if (!trimmed) {
          return 'Phone number is required.';
        }
        const cleanedPhone = trimmed.replace(/[\s\-\(\)]/g, '');
        if (!this.rules.indianPhone.test(cleanedPhone)) {
          return 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 98765 43210).';
        }
        return null;

      case 'date_of_birth':
        if (!trimmed) {
          return null; // Optional, or if user leaves it as is
        }
        const date = new Date(trimmed);
        if (isNaN(date.getTime())) {
          return 'Please select a valid calendar date.';
        }
        const today = new Date();
        if (date > today) {
          return 'Date of birth cannot be a future date.';
        }
        const age = (today - date) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 5) {
          return 'Date of birth indicates age under 5 years.';
        }
        if (age > 120) {
          return 'Please enter a valid realistic date of birth.';
        }
        return null;

      case 'bio':
        if (value && value.length > 500) {
          return `Bio cannot exceed 500 characters (currently ${value.length}).`;
        }
        return null;

      case 'location':
        if (trimmed && trimmed.length > 120) {
          return 'Location cannot exceed 120 characters.';
        }
        return null;

      default:
        return null;
    }
  },

  /**
   * Validate entire form data object
   */
  validateAll(formData) {
    const errors = {};

    for (const [key, value] of Object.entries(formData)) {
      const error = this.validateField(key, value);
      if (error) {
        errors[key] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Render error in the DOM for a given input element
   */
  showError(inputElement, errorMessage) {
    if (!inputElement) return;

    inputElement.classList.add('has-error');
    inputElement.setAttribute('aria-invalid', 'true');

    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      let errorContainer = formGroup.querySelector('.field-error-message');
      if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'field-error-message';
        formGroup.appendChild(errorContainer);
      }

      errorContainer.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${errorMessage}</span>
      `;
      errorContainer.classList.add('show');
    }
  },

  /**
   * Clear error state for a single input
   */
  clearError(inputElement) {
    if (!inputElement) return;

    inputElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');

    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      const errorContainer = formGroup.querySelector('.field-error-message');
      if (errorContainer) {
        errorContainer.classList.remove('show');
        errorContainer.innerHTML = '';
      }
    }
  },

  /**
   * Clear all errors across a form
   */
  clearAll(formElement) {
    if (!formElement) return;

    const errorInputs = formElement.querySelectorAll('.has-error');
    errorInputs.forEach(input => {
      input.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    });

    const errorContainers = formElement.querySelectorAll('.field-error-message');
    errorContainers.forEach(container => {
      container.classList.remove('show');
      container.innerHTML = '';
    });
  }
};

window.Validation = Validation;
