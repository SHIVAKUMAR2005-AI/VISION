const express = require('express');
const router = express.Router();
const { dbGet, dbRun } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Validation helpers
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 standard compliant basic regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

function validateIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Strip spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Supports:
  // 10 digits starting with 6,7,8,9
  // +91 followed by 10 digits starting with 6,7,8,9
  // 0 followed by 10 digits starting with 6,7,8,9
  // 91 followed by 10 digits
  const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  return indianPhoneRegex.test(cleaned);
}

function formatIndianPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const match = cleaned.match(/(?:(?:\+91|91|0)?)([6-9]\d{9})$/);
  if (match && match[1]) {
    const tenDigits = match[1];
    return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
  }
  return phone.trim();
}

function validateDateOfBirth(dob) {
  if (!dob) return true; // Optional or validate if provided
  const date = new Date(dob);
  if (isNaN(date.getTime())) return false;
  
  const today = new Date();
  // Cannot be in future
  if (date > today) return false;
  
  // Reasonable age check (e.g. at least 5 years old and not over 120)
  const age = (today - date) / (1000 * 60 * 60 * 24 * 365.25);
  if (age < 10 || age > 120) return false;
  
  return true;
}

// GET /api/profile - Fetch current authenticated user's profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, two_factor_enabled, notification_email,
             notification_security, date_format, created_at, updated_at
      FROM users WHERE id = ?
    `, [userId]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data from server.'
    });
  }
});

// PUT /api/profile - Update current authenticated user's profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      email,
      phone,
      date_of_birth,
      gender,
      location,
      bio,
      role,
      department,
      timezone,
      language,
      avatar_url
    } = req.body;

    const errors = {};

    // 1. Full Name Validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length === 0) {
      errors.full_name = 'Full name is required.';
    } else if (full_name.trim().length < 3) {
      errors.full_name = 'Full name must contain at least 3 characters.';
    } else if (full_name.trim().length > 70) {
      errors.full_name = 'Full name cannot exceed 70 characters.';
    } else if (!/^[a-zA-Z\s\.\'\-]+$/.test(full_name.trim())) {
      errors.full_name = 'Full name contains invalid characters.';
    }

    // 2. Email Validation
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      errors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please provide a valid email address (e.g., name@company.com).';
    } else {
      // Check if email already used by another user
      const existingUser = await dbGet(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email.toLowerCase().trim(), userId]
      );
      if (existingUser) {
        errors.email = 'This email address is already in use by another account.';
      }
    }

    // 3. Phone Number Validation
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      errors.phone = 'Phone number is required.';
    } else if (!validateIndianPhone(phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number (e.g., 9876543210 or +91 98765 43210).';
    }

    // 4. Date of Birth Validation
    if (date_of_birth && !validateDateOfBirth(date_of_birth)) {
      errors.date_of_birth = 'Please enter a valid date of birth (cannot be in the future).';
    }

    // 5. Gender Validation
    const allowedGenders = ['Male', 'Female', 'Non-Binary', 'Prefer not to say', 'Other'];
    if (gender && !allowedGenders.includes(gender)) {
      errors.gender = 'Please select a valid gender option.';
    }

    // 6. Bio length validation
    if (bio && typeof bio === 'string' && bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters.';
    }

    // 7. Location length validation
    if (location && typeof location === 'string' && location.length > 120) {
      errors.location = 'Location cannot exceed 120 characters.';
    }

    // Return 400 if validation failed
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please resolve the highlighted validation errors.',
        errors
      });
    }

    const cleanFullName = full_name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const formattedPhone = formatIndianPhone(phone);
    const cleanDob = date_of_birth ? date_of_birth.trim() : null;
    const cleanGender = gender ? gender.trim() : null;
    const cleanLocation = location ? location.trim() : '';
    const cleanBio = bio ? bio.trim() : '';
    const cleanRole = role ? role.trim() : req.user.role;
    const cleanDepartment = department ? department.trim() : req.user.department;
    const cleanTimezone = timezone ? timezone.trim() : 'Asia/Kolkata (IST)';
    const cleanLanguage = language ? language.trim() : 'English (India)';
    const cleanAvatar = avatar_url !== undefined ? avatar_url : req.user.avatar_url;

    // Execute SQLite update
    await dbRun(`
      UPDATE users SET
        full_name = ?,
        email = ?,
        phone = ?,
        date_of_birth = ?,
        gender = ?,
        location = ?,
        bio = ?,
        role = ?,
        department = ?,
        timezone = ?,
        language = ?,
        avatar_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      cleanFullName,
      cleanEmail,
      formattedPhone,
      cleanDob,
      cleanGender,
      cleanLocation,
      cleanBio,
      cleanRole,
      cleanDepartment,
      cleanTimezone,
      cleanLanguage,
      cleanAvatar,
      userId
    ]);

    // Retrieve freshly updated user record (safe fields only)
    const updatedUser = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, created_at, updated_at
      FROM users WHERE id = ?
    `, [userId]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'A database error occurred while updating your profile. Please try again.'
    });
  }
});

// POST /api/profile/avatar - Update avatar URL or choose preset
router.post('/avatar', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar_url } = req.body;

    if (!avatar_url || typeof avatar_url !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid avatar URL is required.'
      });
    }

    await dbRun(`
      UPDATE users SET
        avatar_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [avatar_url.trim(), userId]);

    const updatedUser = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, created_at, updated_at
      FROM users WHERE id = ?
    `, [userId]);

    res.json({
      success: true,
      message: 'Profile avatar updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update avatar.'
    });
  }
});

// PUT /api/profile/preferences - Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timezone, language, date_format, notification_email, notification_security } = req.body;

    await dbRun(`
      UPDATE users SET
        timezone = COALESCE(?, timezone),
        language = COALESCE(?, language),
        date_format = COALESCE(?, date_format),
        notification_email = COALESCE(?, notification_email),
        notification_security = COALESCE(?, notification_security),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      timezone || null,
      language || null,
      date_format || null,
      notification_email !== undefined ? (notification_email ? 1 : 0) : null,
      notification_security !== undefined ? (notification_security ? 1 : 0) : null,
      userId
    ]);

    const updatedUser = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, two_factor_enabled, notification_email,
             notification_security, date_format, created_at, updated_at
      FROM users WHERE id = ?
    `, [userId]);

    res.json({
      success: true,
      message: 'Preferences updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences.'
    });
  }
});

module.exports = router;
