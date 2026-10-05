const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Promise wrappers for database operations
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// Initialize database schema and initial seed data
async function initializeDatabase() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      date_of_birth TEXT,
      gender TEXT,
      location TEXT,
      bio TEXT,
      role TEXT DEFAULT 'Lead Product Designer',
      department TEXT DEFAULT 'Product & Design Experience',
      timezone TEXT DEFAULT 'Asia/Kolkata (IST)',
      language TEXT DEFAULT 'English (India)',
      avatar_url TEXT DEFAULT '/assets/images/avatar.jpg',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate columns if table already exists
  const columns = await dbAll("PRAGMA table_info(users)");
  const colNames = columns.map(c => c.name);

  if (!colNames.includes('two_factor_enabled')) {
    await dbRun("ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER DEFAULT 0");
  }
  if (!colNames.includes('notification_email')) {
    await dbRun("ALTER TABLE users ADD COLUMN notification_email INTEGER DEFAULT 1");
  }
  if (!colNames.includes('notification_security')) {
    await dbRun("ALTER TABLE users ADD COLUMN notification_security INTEGER DEFAULT 1");
  }
  if (!colNames.includes('date_format')) {
    await dbRun("ALTER TABLE users ADD COLUMN date_format TEXT DEFAULT 'DD/MM/YYYY'");
  }

  // Activity Logs Table for security audit trail
  await dbRun(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      device TEXT DEFAULT 'Chrome on Windows',
      location TEXT DEFAULT 'Bangalore, India',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if default user exists
  const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', ['ananya.sharma@example.com']);
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('SecurePass@123', salt);

    await dbRun(`
      INSERT INTO users (
        email, password_hash, full_name, phone, date_of_birth,
        gender, location, bio, role, department, timezone, language, avatar_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'ananya.sharma@example.com',
      passwordHash,
      'Ananya Sharma',
      '+91 98765 43210',
      '1995-08-14',
      'Female',
      'Bangalore, Karnataka, India',
      'Lead Product Designer and design systems lead. Passionate about crafting accessible digital experiences, design tokens, and human-centered user workflows.',
      'Lead Product Designer',
      'Product & Design Experience',
      'Asia/Kolkata (IST)',
      'English (India)',
      '/assets/images/avatar.jpg'
    ]);
    console.log('Seed user created: ananya.sharma@example.com');
  }

  // Also check if a secondary demo user exists (for switching & testing multi-user isolation)
  const secondaryUser = await dbGet('SELECT id FROM users WHERE email = ?', ['rahul.verma@example.com']);
  if (!secondaryUser) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('RahulPass@123', salt);

    await dbRun(`
      INSERT INTO users (
        email, password_hash, full_name, phone, date_of_birth,
        gender, location, bio, role, department, timezone, language, avatar_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'rahul.verma@example.com',
      passwordHash,
      'Rahul Verma',
      '+91 91234 56789',
      '1992-11-20',
      'Male',
      'Mumbai, Maharashtra, India',
      'Principal Systems Architect building scalable microservices and resilient cloud infrastructure. Coffee enthusiast and open-source contributor.',
      'Principal Systems Architect',
      'Cloud & Platform Engineering',
      'Asia/Kolkata (IST)',
      'English (India)',
      ''
    ]);
    console.log('Seed user created: rahul.verma@example.com');
  }
}

module.exports = {
  db,
  dbGet,
  dbAll,
  dbRun,
  initializeDatabase
};
