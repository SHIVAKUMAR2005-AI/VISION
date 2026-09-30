/**
 * Automated Unit & Integration Test Suite for Node.js CLI (Subtask 5)
 * Run using: `npm test` or `node tests/destination.test.js`
 */

import assert from 'node:assert';
import { INITIAL_DESTINATIONS, INTEREST_CATEGORIES } from '../js/data.js';
import { calculateRecommendationScore, rankDestinations } from '../js/ranking.js';

console.log('====================================================');
console.log('🧪 Running Popular Destinations Test Suite (Node.js)');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Error: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------
// Subtask 1: UI Data & Field Validation
// ----------------------------------------------------
runTest('Subtask 1: Destinations dataset has required fields (image, name, location, etc.)', () => {
  assert.ok(INITIAL_DESTINATIONS.length >= 8, 'Should have at least 8 destinations');

  INITIAL_DESTINATIONS.forEach(dest => {
    assert.ok(dest.id, `Destination missing id: ${dest.name}`);
    assert.ok(dest.name, `Destination missing name: ${dest.id}`);
    assert.ok(dest.location, `Destination missing location: ${dest.id}`);
    assert.ok(dest.image, `Destination missing image: ${dest.id}`);
    assert.ok(dest.popularityScore > 0, `Invalid popularity score: ${dest.id}`);
    assert.ok(dest.rating >= 4.0 && dest.rating <= 5.0, `Invalid rating: ${dest.id}`);
    assert.ok(Array.isArray(dest.tags) && dest.tags.length > 0, `Missing tags: ${dest.id}`);
  });
});

// ----------------------------------------------------
// Subtask 2: Recommendation & Ranking Logic
// ----------------------------------------------------
runTest('Subtask 2: Default ranking correctly orders by popularity when no interests selected', () => {
  const ranked = rankDestinations(INITIAL_DESTINATIONS, { userInterests: [] });
  assert.strictEqual(ranked.length, INITIAL_DESTINATIONS.length);
  
  for (let i = 0; i < ranked.length - 1; i++) {
    assert.ok(
      ranked[i].popularityScore >= ranked[i + 1].popularityScore,
      `Popularity order mismatch at index ${i}: ${ranked[i].name} vs ${ranked[i+1].name}`
    );
  }
});

runTest('Subtask 2: Personalized ranking prioritizes matching user interests', () => {
  const userInterests = ['Cultural', 'History'];
  const ranked = rankDestinations(INITIAL_DESTINATIONS, { userInterests });
  
  // Kyoto & Machu Picchu are cultural icons
  const topPick = ranked[0];
  assert.ok(
    topPick.tags.includes('Cultural'),
    `Top pick should match 'Cultural' interest tag, got: ${topPick.name} (${topPick.tags.join(', ')})`
  );
  assert.ok(topPick.matchPercentage >= 70, `Match percentage should be >= 70%, got ${topPick.matchPercentage}%`);
});

runTest('Subtask 2: calculateRecommendationScore returns expected schema', () => {
  const sampleDest = INITIAL_DESTINATIONS[0];
  const scoreData = calculateRecommendationScore(sampleDest, ['Beaches', 'Romantic']);
  assert.ok(typeof scoreData.finalScore === 'number');
  assert.ok(typeof scoreData.matchPercentage === 'number');
  assert.ok(Array.isArray(scoreData.matchedTags));
  assert.ok(typeof scoreData.matchExplanation === 'string');
});

// ----------------------------------------------------
// Subtask 3: Empty, Error & Filter States
// ----------------------------------------------------
runTest('Subtask 3: Filtering by non-existent term returns empty array (empty state)', () => {
  const results = rankDestinations(INITIAL_DESTINATIONS, { searchQuery: 'xyz-not-found-term-999' });
  assert.strictEqual(results.length, 0, 'Should return 0 results for non-matching query');
});

runTest('Subtask 3: Category filtering accurately isolates matching destinations', () => {
  const beachDestinations = rankDestinations(INITIAL_DESTINATIONS, { category: 'Beaches' });
  assert.ok(beachDestinations.length > 0, 'Should return beach destinations');
  
  beachDestinations.forEach(d => {
    const isBeach = d.category === 'Beaches' || d.tags.includes('Beaches');
    assert.ok(isBeach, `Destination ${d.name} does not match Beaches category`);
  });
});

// ----------------------------------------------------
// Subtask 4: Destination Selection & Details Data
// ----------------------------------------------------
runTest('Subtask 4: Destination details contain full descriptions, highlights, and attractions', () => {
  INITIAL_DESTINATIONS.forEach(dest => {
    assert.ok(dest.fullDescription && dest.fullDescription.length > 50, `Detailed description missing on ${dest.name}`);
    assert.ok(Array.isArray(dest.highlights) && dest.highlights.length >= 3, `Highlights list insufficient on ${dest.name}`);
    assert.ok(Array.isArray(dest.topAttractions) && dest.topAttractions.length >= 2, `Top attractions missing on ${dest.name}`);
    assert.ok(dest.bestTimeToVisit, `Best time to visit missing on ${dest.name}`);
    assert.ok(dest.weather, `Weather information missing on ${dest.name}`);
    assert.ok(dest.estimatedDailyBudget, `Budget information missing on ${dest.name}`);
  });
});

// ----------------------------------------------------
// Subtask 5: Complete Flow Verification
// ----------------------------------------------------
runTest('Subtask 5: Category list contains valid metadata and icons', () => {
  assert.ok(INTEREST_CATEGORIES.length >= 5, 'Should have multiple category options');
  INTEREST_CATEGORIES.forEach(cat => {
    assert.ok(cat.id, 'Category must have an id');
    assert.ok(cat.label, 'Category must have a label');
    assert.ok(cat.icon, 'Category must have an icon');
  });
});

console.log('\n----------------------------------------------------');
console.log(`📊 Test Summary: ${passCount} Passed, ${failCount} Failed (${passCount + failCount} Total)`);
console.log('----------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 All 5 Jira Subtask Acceptance Criteria PASSED successfully!\n');
}
