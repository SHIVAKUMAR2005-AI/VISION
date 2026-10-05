# User Profile Management Enterprise Platform

A production-grade, secure, modern **User Profile Management** web application built according to the Jira requirement (**Epic:** User Management | **Story:** Manage User Profile).

---

## 🌟 Key Features

### 1. Modern SaaS UI & Responsive Experience
- **Hero Profile Header**: High-resolution avatar with live fallback initials, active presence indicator, verified badge, and quick avatar updater.
- **View Mode**: Clean, read-only display with copyable chips for email and phone numbers, structured personal and professional data.
- **Edit Mode**:
  - Global floating alert banner ("Editing Profile Information").
  - Form validation with inline indicators, field hints, and accessible ARIA attributes.
  - Live character counter for Bio (500-char limit).
  - Cancel functionality restoring original values and clearing error highlights.
  - "Save Changes" button with loading spinner (`Saving...`) preventing duplicate submissions.
- **Enterprise Design System**:
  - Pure Vanilla CSS design tokens with custom HSL color palette.
  - Dark Mode and Light Mode with persistence in `localStorage` and system theme auto-detection.
  - Responsive layouts optimized for Desktop, Laptop, Tablet, and Mobile devices.
  - Professional floating Toast notification system with auto-dismiss timers and progress bars.

### 2. Backend & SQLite Persistence
- **Persistent Database**: Real SQLite database stored at `server/data/users.db` with parameterized queries.
- **Authentication & Security**:
  - Industry-standard JWT Bearer token authentication.
  - User isolation: authenticated users can **only update their own profile**.
  - Password hashes (`bcryptjs`) are never exposed through API responses.
- **Multi-User Isolation Demonstration**:
  - Comes with pre-seeded test accounts: `ananya.sharma@example.com` and `rahul.verma@example.com`.
  - Built-in "Switch User" control in sidebar to demonstrate data isolation between different authenticated sessions.

### 3. Comprehensive Validation
- **Full Name**: Required, minimum 3 characters, maximum 70 characters, no whitespace-only input.
- **Email**: Required, RFC-compliant format, duplicate email prevention across accounts.
- **Phone Number**: Required, supports standard 10-digit Indian phone numbers (`+91 98765 43210` or `9876543210`).
- **Date of Birth**: Valid date, prevents future dates, realistic age validation.
- **Bio**: Enforced 500-character maximum with live character counter.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Structure** | Semantic HTML5, ARIA Landmarks |
| **Styling & Theming** | Vanilla CSS3 (Design Tokens, Dark/Light mode, Glassmorphism) |
| **Frontend Logic** | Vanilla JavaScript (ES Modules, Controller/View pattern) |
| **Backend Framework** | Node.js & Express 5 REST API |
| **Database** | SQLite3 (`server/data/users.db`) |
| **Authentication** | JSON Web Tokens (JWT) & bcryptjs password hashing |

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
*The server will initialize the SQLite database, seed default accounts if not present, and serve the application on port **5000**.*

- **Application URL**: [http://localhost:5000](http://localhost:5000)
- **Profile API**: [http://localhost:5000/api/profile](http://localhost:5000/api/profile)

---

## 🧪 How to Run Automated Tests

To execute the test suite (validating API endpoints, JWT authentication, validation error handling, SQLite persistence, and static assets):
```bash
npm test
```

---

## 📋 Step-by-Step Manual Testing Guide

1. **View Profile**:
   - Open [http://localhost:5000](http://localhost:5000) in your browser.
   - Observe default authenticated user (**Ananya Sharma**) with verified badge, avatar, phone, email, and 100% profile completion meter.
2. **Edit Profile**:
   - Click the **Edit Profile** button.
   - Observe the fields transform into editable inputs and the top notification banner activate.
3. **Test Validation**:
   - Change the name to a single character (e.g., `A`) and click **Save Changes**.
   - Notice the inline error: *"Full name must contain at least 3 characters."*
   - Change the phone to `12345` and notice the Indian phone number error.
4. **Save Valid Updates**:
   - Enter valid details (e.g., Location: `Indiranagar, Bangalore`, updated Bio).
   - Click **Save Changes**.
   - Observe the button state switch to `Saving...`, the success toast appear: *"Profile updated successfully."*, and the UI return to View Mode with freshly saved values.
5. **Verify Persistence**:
   - Refresh the browser (F5).
   - Confirm that all updated values remain intact from the SQLite database.
6. **Toggle Theme**:
   - Click the sun/moon icon in the top header to toggle between Dark and Light themes.
