/**
 * Subtask 2: Destination Recommendation and Ranking Engine
 * Computes recommendation scores based on destination popularity and user interests,
 * ranks destinations accordingly, and applies search & category filtering.
 */

/**
 * Calculates the match score for a destination against a set of user interests.
 * @param {Object} destination - Destination object with tags and popularityScore
 * @param {Array<string>} userInterests - Array of user-selected interest tag strings
 * @returns {Object} Score breakdown including matchPercentage, matchScore, and matchTags
 */
export function calculateRecommendationScore(destination, userInterests = []) {
  const basePopularity = destination.popularityScore || 0;

  if (!userInterests || userInterests.length === 0) {
    return {
      finalScore: basePopularity,
      matchPercentage: Math.min(100, Math.round(basePopularity)),
      matchedTags: [],
      matchExplanation: `Ranked #${Math.max(1, 100 - basePopularity)} in Global Popularity`
    };
  }

  // Find overlapping tags between destination tags and user selected interests
  const destTagsLower = destination.tags.map(t => t.toLowerCase());
  const matchedTags = userInterests.filter(interest => 
    destTagsLower.includes(interest.toLowerCase())
  );

  // Interest match ratio: matches / total user selected interests
  const interestMatchRatio = matchedTags.length / userInterests.length;
  const interestMatchScore = interestMatchRatio * 100;

  // Weighted formula: 55% User Interest Match + 45% Destination Popularity
  const finalScore = (interestMatchScore * 0.55) + (basePopularity * 0.45);
  const matchPercentage = Math.min(100, Math.round(finalScore));

  let matchExplanation = '';
  if (matchedTags.length > 0) {
    matchExplanation = `${matchPercentage}% Match (${matchedTags.join(', ')})`;
  } else {
    matchExplanation = `${matchPercentage}% Match (Based on general popularity)`;
  }

  return {
    finalScore: Number(finalScore.toFixed(2)),
    matchPercentage,
    matchedTags,
    matchExplanation
  };
}

/**
 * Ranks and filters destination list according to recommendation logic, search, category, and sort criteria.
 * @param {Array<Object>} destinations - Raw list of destination objects
 * @param {Object} options - Filter and sort options
 * @param {Array<string>} options.userInterests - Selected user interests
 * @param {string} options.category - Category filter ('all' or specific category)
 * @param {string} options.searchQuery - Search text
 * @param {string} options.sortBy - Sort strategy ('recommended', 'popularity', 'rating', 'name')
 * @returns {Array<Object>} Ranked and filtered destinations with recommendation metadata
 */
export function rankDestinations(destinations, {
  userInterests = [],
  category = 'all',
  searchQuery = '',
  sortBy = 'recommended'
} = {}) {
  if (!Array.isArray(destinations)) {
    return [];
  }

  // 1. Calculate recommendation metadata for every destination
  const scoredDestinations = destinations.map(dest => {
    const scoreData = calculateRecommendationScore(dest, userInterests);
    return {
      ...dest,
      ...scoreData
    };
  });

  // 2. Filter by Category
  let filtered = scoredDestinations.filter(dest => {
    if (!category || category === 'all') return true;
    const destCategory = (dest.category || '').toLowerCase();
    const destTags = (dest.tags || []).map(t => t.toLowerCase());
    const filterCat = category.toLowerCase();
    return destCategory === filterCat || destTags.includes(filterCat);
  });

  // 3. Filter by Search Query (Name, Location, Country, Tags, Highlights)
  if (searchQuery && searchQuery.trim().length > 0) {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(dest => {
      const matchName = (dest.name || '').toLowerCase().includes(query);
      const matchLocation = (dest.location || '').toLowerCase().includes(query);
      const matchCountry = (dest.country || '').toLowerCase().includes(query);
      const matchTags = (dest.tags || []).some(t => t.toLowerCase().includes(query));
      const matchShortDesc = (dest.shortDescription || '').toLowerCase().includes(query);
      return matchName || matchLocation || matchCountry || matchTags || matchShortDesc;
    });
  }

  // 4. Sort based on the selected sorting strategy
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'recommended':
        // Primary: highest final recommendation score; Secondary: highest rating
        if (b.finalScore !== a.finalScore) {
          return b.finalScore - a.finalScore;
        }
        return b.rating - a.rating;

      case 'popularity':
        return (b.popularityScore || 0) - (a.popularityScore || 0);

      case 'rating':
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return (b.reviewCount || 0) - (a.reviewCount || 0);

      case 'name':
        return a.name.localeCompare(b.name);

      default:
        return b.finalScore - a.finalScore;
    }
  });

  return filtered;
}
