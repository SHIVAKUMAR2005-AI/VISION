# View Popular Destinations

A modern, responsive web application implementing the Jira User Story: **"View Popular Destinations"** across all 5 defined subtasks.

---

## 🎯 Jira User Story & Subtask Alignment

| Jira Subtask | Description | Implementation Details |
| :--- | :--- | :--- |
| **Subtask 1: Create Popular Destinations List UI** | Responsive cards/list display with image, name, location, and basic details across all devices. | [cards.css](file:///d:/View%20Popular%20Destinations/css/cards.css), [ui.js](file:///d:/View%20Popular%20Destinations/js/ui.js) |
| **Subtask 2: Implement Destination Recommendation & Ranking** | Dynamic ranking combining destination popularity scores with user-selected interest profiles. | [ranking.js](file:///d:/View%20Popular%20Destinations/js/ranking.js) |
| **Subtask 3: Handle Empty, Loading, and Error States** | Shimmer skeleton loaders, illustrated zero-results empty state with reset, and error state with retry button. | [states.css](file:///d:/View%20Popular%20Destinations/css/states.css), [ui.js](file:///d:/View%20Popular%20Destinations/js/ui.js) |
| **Subtask 4: Implement Destination Selection & Details View** | Seamless routing to dedicated destination details with gallery, highlights, budget stats, and back navigation. | [details.css](file:///d:/View%20Popular%20Destinations/css/details.css), [router.js](file:///d:/View%20Popular%20Destinations/js/router.js) |
| **Subtask 5: Test Popular Destinations Flow** | Automated Node.js test suite (`npm test`) and interactive in-browser QA Test Modal. | [tests.js](file:///d:/View%20Popular%20Destinations/js/tests.js), [destination.test.js](file:///d:/View%20Popular%20Destinations/tests/destination.test.js) |

---

## 🚀 How to Run the Project

### Option A: Open directly in your browser
Simply double-click or open [index.html](file:///d:/View%20Popular%20Destinations/index.html) using any modern web browser.

### Option B: Run via local web server (Node.js)
```bash
# Start local server on port 3000
npm start
```
Then visit `http://localhost:3000` in your browser.

### Option C: Run Automated Tests
```bash
npm test
```

---

## 📁 Project Architecture

```
d:/View Popular Destinations/
├── index.html                  # Main application structure & semantic layout
├── package.json                # Project scripts & configuration
├── README.md                   # Documentation and Jira traceability
├── css/
│   ├── main.css                # Design system tokens, typography, header, hero
│   ├── cards.css               # Card grid, list view, badges, hover effects
│   ├── details.css             # Dedicated destination details view
│   └── states.css              # Loading skeleton, empty state, error & QA modal
├── js/
│   ├── data.js                 # Curated travel destination database
│   ├── ranking.js              # Recommendation & ranking algorithm (Subtask 2)
│   ├── router.js               # Hash routing & back navigation (Subtask 4)
│   ├── ui.js                   # DOM rendering for cards, states, details
│   ├── tests.js                # In-browser QA Test Suite runner (Subtask 5)
│   └── app.js                  # Application controller and event bus
└── tests/
    └── destination.test.js     # Automated CLI test suite
```

---

## ✨ Features Highlight

1. **Personalized Recommendation Algorithm**:
   - Computes weighted score: `55% User Interest Match + 45% Base Popularity`.
   - Explains why a destination is ranked (e.g. `98% Match for Adventure & Nature`).
   - Graceful fallback to global popularity ranking.

2. **Responsive Visual Experience**:
   - Dark luxury aesthetic with cyan and indigo glowing gradients.
   - Grid and List layout switcher.
   - Mobile and tablet optimized touch controls.

3. **Interactive QA & State Simulator**:
   - Test toolbar to instantly preview Loading Skeletons and API Error + Retry behavior.
   - Dedicated "QA Test Suite" modal running live assertions with pass rate analytics.
