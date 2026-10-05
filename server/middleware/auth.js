const jwt = require('jsonwebtoken');
const { dbGet } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity-user-profile-secret-key-2026';

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session.'
      });
    }

    // Retrieve user from database (never select password_hash)
    const user = await dbGet(`
      SELECT id, email, full_name, phone, date_of_birth, gender,
             location, bio, role, department, timezone, language,
             avatar_url, created_at, updated_at
      FROM users WHERE id = ?
    `, [decoded.id]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this session no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
}

module.exports = {
  authenticateToken,
  JWT_SECRET
};
