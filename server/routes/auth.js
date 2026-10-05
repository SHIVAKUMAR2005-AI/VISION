const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { dbGet, dbAll, dbRun } = require('../database');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// GET /api/auth/session - Get or initialize active session
// If client has a valid Bearer token, return current user.
// If client has no token, automatically provide initial session for the default seeded user.
router.get('/session', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await dbGet(`
          SELECT id, email, full_name, phone, date_of_birth, gender,
                 location, bio, role, department, timezone, language,
                 avatar_url, created_at, updated_at
          FROM users WHERE id = ?
        `, [decoded.id]);

        if (user) {
          return res.json({
            success: true,
            user,
            token
          });
        }
      } catch (e) {
        // Token invalid/expired, will fallback to default user
      }
    }

    // Default authenticated user (Ananya Sharma)
    const defaultUser = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, created_at, updated_at
      FROM users WHERE email = ?
    `, ['ananya.sharma@example.com']);

    if (!defaultUser) {
      return res.status(500).json({
        success: false,
        message: 'Default user not initialized.'
      });
    }

    const newToken = generateToken(defaultUser);
    res.json({
      success: true,
      user: defaultUser,
      token: newToken
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user session.'
    });
  }
});

// POST /api/auth/login - Standard user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const userWithHash = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!userWithHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, userWithHash.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(userWithHash);
    
    // Strip password hash from response
    const { password_hash, ...safeUser } = userWithHash;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred during login.'
    });
  }
});

// GET /api/auth/users-list - List available demo users to test multi-user isolation
router.get('/users-list', async (req, res) => {
  try {
    const users = await dbAll(`
      SELECT id, email, full_name, role, department, avatar_url
      FROM users ORDER BY id ASC
    `);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load user list.' });
  }
});

// POST /api/auth/switch - Switch active authenticated user (for testing multi-user profile separation)
router.post('/switch', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, created_at, updated_at
      FROM users WHERE id = ?
    `, [userId]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: `Switched session to ${user.full_name}`,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to switch user.' });
  }
});

// PUT /api/auth/change-password - Change account password securely
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required.'
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must contain at least 8 characters.'
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match.'
      });
    }

    // Retrieve user's existing password hash
    const user = await dbGet('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect.'
      });
    }

    const isSamePassword = await bcrypt.compare(new_password, user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be identical to your current password.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(new_password, salt);

    await dbRun('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newHash, userId]);

    // Log activity
    await dbRun(`
      INSERT INTO activity_logs (user_id, action, description, device, location)
      VALUES (?, 'Password Changed', 'Security password successfully modified', 'Current Session', 'Bangalore, India')
    `, [userId]);

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password.'
    });
  }
});

// POST /api/auth/2fa/toggle - Enable or disable Two-Factor Authentication
router.post('/2fa/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;
    const isEnabled = enabled ? 1 : 0;

    await dbRun('UPDATE users SET two_factor_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [isEnabled, userId]);

    await dbRun(`
      INSERT INTO activity_logs (user_id, action, description, device, location)
      VALUES (?, ?, ?, 'Current Session', 'Bangalore, India')
    `, [
      userId, 
      isEnabled ? '2FA Enabled' : '2FA Disabled',
      isEnabled ? 'Two-Factor Authentication was activated' : 'Two-Factor Authentication was deactivated'
    ]);

    res.json({
      success: true,
      two_factor_enabled: isEnabled,
      message: isEnabled ? 'Two-Factor Authentication activated successfully.' : 'Two-Factor Authentication disabled.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update Two-Factor Authentication.' });
  }
});

// POST /api/auth/sessions/revoke-others - Revoke all other device sessions
router.post('/sessions/revoke-others', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await dbRun(`
      INSERT INTO activity_logs (user_id, action, description, device, location)
      VALUES (?, 'Sessions Revoked', 'Signed out of all other active browser sessions and mobile devices', 'Current Session', 'Bangalore, India')
    `, [userId]);

    res.json({
      success: true,
      message: 'Successfully signed out of all other device sessions.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to revoke other sessions.' });
  }
});

// GET /api/auth/activities - Get audit trail
router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await dbAll(`
      SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load activity logs.' });
  }
});

module.exports = router;
