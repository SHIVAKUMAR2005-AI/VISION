/**
 * Data store containing destinations dataset, interest categories,
 * and user state for the Popular Destinations Application.
 */

export const INTEREST_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: '🌍' },
  { id: 'Nature', label: 'Nature & Parks', icon: '🌲' },
  { id: 'Cultural', label: 'History & Culture', icon: '🏛️' },
  { id: 'Beaches', label: 'Beaches & Coastal', icon: '🏖️' },
  { id: 'Adventure', label: 'Adventure & Thrills', icon: '🧗' },
  { id: 'Romantic', label: 'Romantic Getaways', icon: '✨' },
  { id: 'Culinary', label: 'Food & Culinary', icon: '🍷' },
  { id: 'Luxury', label: 'Luxury & Wellness', icon: '💎' },
  { id: 'Photography', label: 'Scenic Photography', icon: '📷' }
];

export const INITIAL_DESTINATIONS = [
  {
    id: 'santorini-greece',
    name: 'Santorini Island',
    location: 'Cyclades, Greece',
    country: 'Greece',
    countryCode: 'GR',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Romantic',
    tags: ['Romantic', 'Beaches', 'Photography', 'Culinary', 'Luxury'],
    popularityScore: 98,
    rating: 4.95,
    reviewCount: 4820,
    priceRange: '$$$$',
    shortDescription: 'Iconic whitewashed cliffside villages overlooking the azure Aegean Sea with world-famous caldera sunsets.',
    fullDescription: 'Santorini is renowned for its dramatic caldera vistas, cubic whitewashed architecture draped in bougainvillea, and legendary sunset viewpoints in Oia. Carved by a historic volcanic eruption, the island offers distinct black and red volcanic beaches, exquisite cliffside fine dining, boutique wineries showcasing crisp Assyrtiko wines, and warm Aegean hospitality.',
    highlights: [
      'Breathtaking Oia sunset vantage points',
      'Volcanic black sand beaches of Kamari & Perissa',
      'Catamaran sailing tours through the Caldera',
      'Cliffside infinity pools with panoramic sea views',
      'Ancient Akrotiri archaeological site'
    ],
    bestTimeToVisit: 'April to November (Peak: June - September)',
    weather: 'Sunny, 26°C avg in summer',
    estimatedDailyBudget: '$250 - $550 / day',
    topAttractions: [
      { name: 'Oia Castle Sunset Point', type: 'Viewpoint' },
      { name: 'Red Beach (Kokkini Paralia)', type: 'Beach' },
      { name: 'Venetsanos Winery', type: 'Wine Tasting' },
      { name: 'Fira to Oia Caldera Trail', type: 'Hiking' }
    ]
  },
  {
    id: 'kyoto-japan',
    name: 'Kyoto Historic City',
    location: 'Kansai, Japan',
    country: 'Japan',
    countryCode: 'JP',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Photography', 'Culinary', 'Nature', 'Romantic'],
    popularityScore: 96,
    rating: 4.92,
    reviewCount: 5610,
    priceRange: '$$$',
    shortDescription: 'Ancient imperial capital of Japan celebrated for centuries-old temples, bamboo groves, and traditional tea ceremonies.',
    fullDescription: 'Kyoto represents the cultural heartbeat of Japan, boasting thousands of classical Buddhist temples, Shinto shrines, serene Zen rock gardens, and traditional wooden machiya townhouses. Walk beneath thousands of vermilion torii gates at Fushimi Inari, wander the towering Arashiyama Bamboo Grove, and taste authentic Kaiseki seasonal cuisine in historic Gion.',
    highlights: [
      '10,000+ Vermilion gates at Fushimi Inari Taisha',
      'Towering Arashiyama Bamboo Forest',
      'Golden Pavilion (Kinkaku-ji) reflection pond',
      'Traditional tea ceremony experiences in Gion',
      'World-renowned Kaiseki dining & Nishiki Market'
    ],
    bestTimeToVisit: 'March to May (Cherry Blossom) & Oct to Nov (Autumn Foliage)',
    weather: 'Mild & crisp, 18°C avg in Spring',
    estimatedDailyBudget: '$160 - $350 / day',
    topAttractions: [
      { name: 'Fushimi Inari Shrine', type: 'Historical Shrine' },
      { name: 'Kinkaku-ji (Golden Pavilion)', type: 'Zen Temple' },
      { name: 'Arashiyama Bamboo Grove', type: 'Nature Reserve' },
      { name: 'Kiyomizu-dera Temple', type: 'UNESCO Heritage' }
    ]
  },
  {
    id: 'banff-canada',
    name: 'Banff National Park',
    location: 'Alberta, Canada',
    country: 'Canada',
    countryCode: 'CA',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Nature',
    tags: ['Nature', 'Adventure', 'Photography', 'Romantic'],
    popularityScore: 94,
    rating: 4.89,
    reviewCount: 3940,
    priceRange: '$$$',
    shortDescription: 'Glacial turquoise alpine lakes framed by towering Canadian Rocky Mountain peaks and untamed wilderness.',
    fullDescription: 'Banff National Park is Canada’s premier national park, home to the hypnotic turquoise waters of Lake Louise and Moraine Lake fed by surrounding glaciers. From scenic gondola ascents and wildlife encounters to world-class alpine hiking trails and natural hot springs, Banff offers an unmatched wilderness retreat.',
    highlights: [
      'Glacial turquoise hues of Moraine Lake and Lake Louise',
      'Scenic Icefields Parkway mountain drive',
      'Banff Gondola panoramic summit views',
      'Relaxing mineral soaks at Banff Upper Hot Springs',
      'Winter skiing across the Big3 ski resorts'
    ],
    bestTimeToVisit: 'June to September (Hiking) or Dec to March (Skiing)',
    weather: 'Alpine cool, 22°C avg in summer',
    estimatedDailyBudget: '$180 - $400 / day',
    topAttractions: [
      { name: 'Moraine Lake & Valley of the Ten Peaks', type: 'Alpine Lake' },
      { name: 'Lake Louise Shoreline Trail', type: 'Scenic Hike' },
      { name: 'Sulphur Mountain Gondola', type: 'Mountain Viewpoint' },
      { name: 'Johnston Canyon Waterfalls', type: 'Canyon Trail' }
    ]
  },
  {
    id: 'bali-indonesia',
    name: 'Bali Tropical Island',
    location: 'Bali Province, Indonesia',
    country: 'Indonesia',
    countryCode: 'ID',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Beaches',
    tags: ['Beaches', 'Nature', 'Cultural', 'Adventure', 'Luxury', 'Culinary'],
    popularityScore: 95,
    rating: 4.88,
    reviewCount: 6180,
    priceRange: '$$',
    shortDescription: 'Island of the Gods known for emerald rice terraces, cliffside sea temples, world-class surfing, and wellness resorts.',
    fullDescription: 'Bali enchants travelers with its deeply rooted spiritual culture, lush jungle waterfalls in Ubud, dramatic oceanfront cliffs in Uluwatu, and vibrant coastal beach clubs in Seminyak and Canggu. Whether you seek serene yoga retreats, world-class coral reef diving, or spicy Balinese culinary delights, Bali delivers unforgettable experiences.',
    highlights: [
      'Tegalalang emerald tiered rice terraces',
      'Cliff-hanging Uluwatu Temple & Kecak fire dance',
      'Mount Batur sunrise volcano trekking',
      'Nusa Penida coastal viewpoint adventures',
      'Holistic wellness, yoga retreats, and spa therapies'
    ],
    bestTimeToVisit: 'April to October (Dry season)',
    weather: 'Tropical warm, 28°C avg year-round',
    estimatedDailyBudget: '$70 - $220 / day',
    topAttractions: [
      { name: 'Tegallalang Rice Terrace', type: 'Cultural Landscape' },
      { name: 'Uluwatu Cliff Temple', type: 'Historic Temple' },
      { name: 'Nusa Penida Kelingking Beach', type: 'Coastal Landmark' },
      { name: 'Sacred Monkey Forest Sanctuary', type: 'Wildlife Sanctuary' }
    ]
  },
  {
    id: 'swiss-alps-zermatt',
    name: 'Zermatt & The Matterhorn',
    location: 'Valais, Switzerland',
    country: 'Switzerland',
    countryCode: 'CH',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Adventure',
    tags: ['Adventure', 'Nature', 'Luxury', 'Photography', 'Romantic'],
    popularityScore: 93,
    rating: 4.93,
    reviewCount: 3100,
    priceRange: '$$$$',
    shortDescription: 'Car-free alpine jewel at the foot of the iconic pyramid-shaped Matterhorn peak offering pristine skiing and trails.',
    fullDescription: 'Zermatt is a world-class mountain destination nestled in the Swiss Alps beneath the dramatic Matterhorn. Known for its car-free eco-friendly streets, prestigious fondue dining, Gornergrat cogwheel railway, and year-round glacier skiing, Zermatt offers refined Swiss elegance and majestic mountain scenery.',
    highlights: [
      'Unobstructed views of the legendary Matterhorn peak',
      'Gornergrat Cogwheel Railway to 3,089m summit',
      'Glacier Paradise with ice palace exhibitions',
      'Charming car-free village with traditional chalets',
      'Five Lakes Walk (5-Seenweg) reflecting mountain peaks'
    ],
    bestTimeToVisit: 'December to April (Skiing) & July to September (Hiking)',
    weather: 'Crisp mountain air, 18°C summer / -5°C winter',
    estimatedDailyBudget: '$280 - $600 / day',
    topAttractions: [
      { name: 'Matterhorn Glacier Paradise', type: 'Glacier & Cableway' },
      { name: 'Gornergrat Railway & Observatory', type: 'Scenic Railway' },
      { name: 'Stellisee Alpine Lake', type: 'Photography Hotspot' },
      { name: 'Zermatt Old Village (Hinterdorf)', type: 'Historic Architecture' }
    ]
  },
  {
    id: 'amalfi-coast-italy',
    name: 'Amalfi Coast & Positano',
    location: 'Campania, Italy',
    country: 'Italy',
    countryCode: 'IT',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Romantic',
    tags: ['Romantic', 'Beaches', 'Culinary', 'Photography', 'Luxury'],
    popularityScore: 97,
    rating: 4.91,
    reviewCount: 4210,
    priceRange: '$$$$',
    shortDescription: 'Pastel cliffside villages tumbling toward the cobalt Mediterranean Sea amid fragrant lemon groves and coastal glamor.',
    fullDescription: 'The Amalfi Coast is a UNESCO-listed Mediterranean marvel characterized by pastel-hued cliffside towns, terraced lemon orchards, winding coastal roads, and glamorous seaside lifestyle. From Positano’s chic boutique cafes to Ravello’s high-altitude cliffside gardens, it represents Italian coastal romance at its peak.',
    highlights: [
      'Spectacular vertical pastel village of Positano',
      'Villa Cimbrone & Villa Rufolo infinity cliff gardens in Ravello',
      'Path of the Gods (Sentiero degli Dei) hiking trail',
      'Limoncello tastings and fresh coastal seafood pasta',
      'Private wooden boat charters to the island of Capri'
    ],
    bestTimeToVisit: 'May to October',
    weather: 'Mediterranean warmth, 27°C avg in summer',
    estimatedDailyBudget: '$240 - $580 / day',
    topAttractions: [
      { name: 'Positano Spiaggia Grande', type: 'Seaside Beach' },
      { name: 'Villa Cimbrone Infinity Terrace', type: 'Historic Gardens' },
      { name: 'Path of the Gods Trail', type: 'Scenic Hike' },
      { name: 'Amalfi Cathedral (Duomo di Amalfi)', type: 'Historic Cathedral' }
    ]
  },
  {
    id: 'cappadocia-turkey',
    name: 'Cappadocia Fairy Chimneys',
    location: 'Central Anatolia, Turkey',
    country: 'Turkey',
    countryCode: 'TR',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Adventure',
    tags: ['Adventure', 'Cultural', 'Photography', 'Romantic'],
    popularityScore: 91,
    rating: 4.87,
    reviewCount: 2950,
    priceRange: '$$',
    shortDescription: 'Otherworldly lunar valleys filled with cave dwellings, fairy chimneys, and hundred-balloon sunrise flights.',
    fullDescription: 'Cappadocia feels like a fantasy landscape sculpted by ancient volcanic eruptions and wind erosion over millennia. Known for its surreal fairy chimneys, underground multi-level cities carved into bedrock, boutique cave hotels, and hundreds of hot air balloons rising in unison at sunrise.',
    highlights: [
      'Sunrise hot air balloon flight over Love Valley',
      'Staying inside a luxury historic cave hotel suite',
      'Exploring the multi-story Derinkuyu underground city',
      'Goreme Open-Air Museum Byzantine frescoed cave churches',
      'Horseback riding at sunset through the Red and Rose Valleys'
    ],
    bestTimeToVisit: 'April to June & September to November',
    weather: 'Pleasant continental climate, 22°C avg',
    estimatedDailyBudget: '$110 - $260 / day',
    topAttractions: [
      { name: 'Goreme Open Air Museum', type: 'UNESCO Cave Complex' },
      { name: 'Love Valley & Fairy Chimneys', type: 'Geological Wonder' },
      { name: 'Kaymakli Underground City', type: 'Ancient Subterranean City' },
      { name: 'Uchisar Rock Castle', type: 'Fortress Viewpoint' }
    ]
  },
  {
    id: 'machu-picchu-peru',
    name: 'Machu Picchu Inca Citadel',
    location: 'Cusco Region, Peru',
    country: 'Peru',
    countryCode: 'PE',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Adventure', 'Nature', 'Photography'],
    popularityScore: 96,
    rating: 4.96,
    reviewCount: 4790,
    priceRange: '$$$',
    shortDescription: '15th-century Inca sanctuary perched 2,430 meters high on a mountain ridge shrouded in cloud forest mist.',
    fullDescription: 'Machu Picchu is one of the New Seven Wonders of the World. Set high in the Andes mountains above the Urubamba River valley, this masterfully engineered stone citadel features dry-stone walls that fuse huge blocks without mortar, astronomical temples, and agricultural terraces overlooking cloud-veiled peaks.',
    highlights: [
      'Iconic Sun Gate (Inti Punku) sunrise overlook',
      'Classic 4-day Inca Trail hiking pilgrimage',
      'Temple of the Sun and Intihuatana sundial stone',
      'Climbing Huayna Picchu for dramatic bird-eye views',
      'Exploring Sacred Valley Inca ruins and vibrant markets'
    ],
    bestTimeToVisit: 'May to October (Dry Andean winter)',
    weather: 'Subtropical highland, 19°C day / 7°C night',
    estimatedDailyBudget: '$150 - $350 / day',
    topAttractions: [
      { name: 'Huayna Picchu Summit', type: 'Mountain Hike' },
      { name: 'Temple of the Sun', type: 'Inca Monument' },
      { name: 'Intihuatana Stone', type: 'Astronomical Clock' },
      { name: 'Inca Bridge Trail', type: 'Ancient Trail' }
    ]
  },
  {
    id: 'reykjavik-iceland',
    name: 'Iceland South Coast & Aurora',
    location: 'Reykjavik & Vik, Iceland',
    country: 'Iceland',
    countryCode: 'IS',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Nature',
    tags: ['Nature', 'Adventure', 'Photography'],
    popularityScore: 92,
    rating: 4.88,
    reviewCount: 3680,
    priceRange: '$$$$',
    shortDescription: 'Land of fire and ice featuring dancing Northern Lights, cascading waterfalls, black sand beaches, and geothermal lagoons.',
    fullDescription: 'Iceland offers raw volcanic majesty with thundering waterfalls like Skogafoss and Seljalandsfoss, diamond iceberg beaches at Jokulsarlon, steaming geothermal lagoons like the Blue Lagoon, and winter Northern Lights dancing across dark Arctic skies.',
    highlights: [
      'Northern Lights (Aurora Borealis) night expeditions',
      'Geothermal soak at the world-famous Blue Lagoon & Sky Lagoon',
      'Reynisfjara volcanic black sand beach and basalt columns',
      'Glacier ice caving inside Vatnajökull ice cap',
      'Golden Circle route: Gullfoss waterfall and Geysir'
    ],
    bestTimeToVisit: 'Sep to March (Aurora) or June to Aug (Midnight Sun)',
    weather: 'Subpolar maritime, 14°C summer / 0°C winter',
    estimatedDailyBudget: '$220 - $500 / day',
    topAttractions: [
      { name: 'Blue Lagoon Geothermal Spa', type: 'Thermal Springs' },
      { name: 'Jökulsárlón Glacier Lagoon', type: 'Glacier & Icebergs' },
      { name: 'Skógafoss Waterfall', type: 'Iconic Waterfall' },
      { name: 'Reynisfjara Black Sand Beach', type: 'Volcanic Coast' }
    ]
  },
  {
    id: 'queenstown-new-zealand',
    name: 'Queenstown Adventure Capital',
    location: 'Otago, New Zealand',
    country: 'New Zealand',
    countryCode: 'NZ',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Adventure',
    tags: ['Adventure', 'Nature', 'Photography', 'Culinary'],
    popularityScore: 90,
    rating: 4.89,
    reviewCount: 2840,
    priceRange: '$$$',
    shortDescription: 'World capital of adventure sports situated alongside crystal Lake Wakatipu and the dramatic Remarkables mountain range.',
    fullDescription: 'Queenstown is the world-renowned epicenter of adventure tourism, perched on the shores of Lake Wakatipu with the dramatic backdrop of The Remarkables mountain range. From bungy jumping at Kawarau Bridge and jet boating through canyons to Pinot Noir wine tours in Central Otago.',
    highlights: [
      'World-famous Kawarau Bridge bungy jump',
      'Shotover River canyon jet boat ride',
      'Scenic flight and cruise across Milford Sound fjord',
      'Skyline Gondola with panoramic lake and alpine views',
      'Central Otago wine tours tasting premium Pinot Noir'
    ],
    bestTimeToVisit: 'Dec to Feb (Summer sports) or June to Aug (Skiing)',
    weather: 'Moderate alpine, 22°C summer / 8°C winter',
    estimatedDailyBudget: '$170 - $380 / day',
    topAttractions: [
      { name: 'Milford Sound Day Tour', type: 'Fiordland Wonder' },
      { name: 'Skyline Queenstown & Luge', type: 'Gondola & Skyline' },
      { name: 'Shotover Jet Canyon', type: 'Adrenaline Activity' },
      { name: 'Lake Wakatipu TSS Earnslaw Cruise', type: 'Steamer Cruise' }
    ]
  },
  {
    id: 'maui-hawaii',
    name: 'Maui Tropical Paradise',
    location: 'Hawaii, United States',
    country: 'United States',
    countryCode: 'US',
    image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Beaches',
    tags: ['Beaches', 'Nature', 'Romantic', 'Adventure', 'Luxury'],
    popularityScore: 94,
    rating: 4.90,
    reviewCount: 3910,
    priceRange: '$$$$',
    shortDescription: 'Hawaiian island paradise offering the legendary Road to Hana, volcanic sunrises atop Haleakala, and golden beaches.',
    fullDescription: 'Maui delivers tropical magic with the winding 64-mile Road to Hana through rainforests and waterfalls, sunrise over the clouds at Haleakala summit volcano crater, world-class humpback whale watching in winter, and snorkeling with green sea turtles at Molokini crater.',
    highlights: [
      'Sunrise above the clouds at Haleakala Volcano Summit',
      'Scenic 620-curve Road to Hana rainforest drive',
      'Snorkeling crystal waters of Molokini Volcanic Crater',
      'Sunsets and whale watching along Kaanapali Beach',
      'Traditional Hawaiian Luau with oceanfront dining'
    ],
    bestTimeToVisit: 'April to May & September to November',
    weather: 'Tropical trade winds, 27°C avg year-round',
    estimatedDailyBudget: '$260 - $550 / day',
    topAttractions: [
      { name: 'Haleakala National Park', type: 'Volcanic Crater' },
      { name: 'Road to Hana', type: 'Scenic Highway' },
      { name: 'Molokini Crater Marine Sanctuary', type: 'Snorkel Reef' },
      { name: 'Wailea & Kaanapali Beaches', type: 'Golden Sand Coast' }
    ]
  },
  {
    id: 'dubai-uae',
    name: 'Dubai Modern Metropolis',
    location: 'Emirate of Dubai, UAE',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Luxury',
    tags: ['Luxury', 'Culinary', 'Adventure', 'Photography'],
    popularityScore: 93,
    rating: 4.86,
    reviewCount: 5120,
    priceRange: '$$$$',
    shortDescription: 'Futuristic desert metropolis featuring world-record architecture, luxury shopping, desert safaris, and artificial islands.',
    fullDescription: 'Dubai stands as a futuristic oasis of innovation and ultra-luxury, anchored by the towering Burj Khalifa, the sail-shaped Burj Al Arab, and the Palm Jumeirah archipelago. Experience sunset 4x4 dune bashing in the Arabian Desert, Michelin-starred fine dining, and gold souk heritage.',
    highlights: [
      'Burj Khalifa observation deck at Level 148',
      'Desert Safari with dune bashing & Arabian camp dinner',
      'The Palm Jumeirah & Atlantis Aquaventure',
      'Dubai Fountain choreographed water show',
      'Historic Al Fahidi Fort and abra boat rides across Dubai Creek'
    ],
    bestTimeToVisit: 'November to March (Pleasant desert winter)',
    weather: 'Warm desert sunshine, 25°C in winter',
    estimatedDailyBudget: '$230 - $650 / day',
    topAttractions: [
      { name: 'Burj Khalifa', type: 'World Tallest Building' },
      { name: 'The Dubai Mall & Fountain', type: 'Shopping & Entertainment' },
      { name: 'Palm Jumeirah & Atlantis', type: 'Iconic Archipelago' },
      { name: 'Dubai Miracle Garden', type: 'Floral Exhibition' }
    ]
  },
  {
    id: 'mumbai-india',
    name: 'Mumbai (City of Dreams)',
    location: 'Maharashtra, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Culinary', 'Luxury', 'Photography', 'Beaches'],
    popularityScore: 97,
    rating: 4.92,
    reviewCount: 6840,
    priceRange: '$$$',
    shortDescription: 'The bustling financial and entertainment capital featuring the iconic Gateway of India, Marine Drive, and Bollywood.',
    fullDescription: 'Mumbai, the financial and entertainment powerhouse of India, captivates travelers with its vibrant spirit, Victorian Gothic and Art Deco heritage architecture, lively Arabian Sea coastline along Marine Drive, and legendary street food culture ranging from vada pav to coastal seafood.',
    highlights: [
      'Iconic Gateway of India & Taj Mahal Palace',
      'Marine Drive sunset along the Queen\'s Necklace promenade',
      'Elephanta Caves UNESCO island excursion',
      'Chhatrapati Shivaji Maharaj Terminus Victorian Gothic architecture',
      'Vibrant street culinary trails at Chowpatty & Colaba'
    ],
    bestTimeToVisit: 'October to March (Pleasant coastal winter)',
    weather: 'Warm tropical coastal, 28°C avg',
    estimatedDailyBudget: '₹3,500 - ₹8,000 / day ($45 - $100)',
    topAttractions: [
      { name: 'Gateway of India', type: 'Colonial Monument' },
      { name: 'Marine Drive & Promenade', type: 'Coastal Promenade' },
      { name: 'Elephanta Caves', type: 'UNESCO Cave Temples' },
      { name: 'Chhatrapati Shivaji Terminus', type: 'Gothic Landmark' }
    ]
  },
  {
    id: 'delhi-india',
    name: 'New Delhi & NCR',
    location: 'Delhi NCR, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Culinary', 'Photography'],
    popularityScore: 96,
    rating: 4.90,
    reviewCount: 7120,
    priceRange: '$$',
    shortDescription: 'India\'s historic capital blending Mughal grandeur, UNESCO World Heritage monuments, and legendary Chandni Chowk street food.',
    fullDescription: 'Delhi bridges thousands of years of imperial history with bustling 21st-century energy. Discover magnificent Mughal wonders like Humayun\'s Tomb and the Red Fort, towering Qutub Minar, ceremonial boulevards of Rajpath leading to India Gate, and the aromatic spice markets of Old Delhi.',
    highlights: [
      'UNESCO marvels: Qutub Minar & Humayun\'s Tomb',
      'Historic Red Fort and Jama Masjid in Old Delhi',
      'Ceremonial India Gate & Kartavya Path',
      'Aromatic culinary trails through Chandni Chowk',
      'Peaceful gardens of Lotus Temple & Lodhi Garden'
    ],
    bestTimeToVisit: 'October to March (Crisp pleasant autumn/winter)',
    weather: 'Continental, 20°C in winter',
    estimatedDailyBudget: '₹2,800 - ₹6,500 / day ($35 - $80)',
    topAttractions: [
      { name: 'India Gate & Kartavya Path', type: 'National Memorial' },
      { name: 'Qutub Minar Complex', type: 'UNESCO Minaret' },
      { name: 'Humayun\'s Tomb', type: 'Mughal Architecture' },
      { name: 'Red Fort (Lal Qila)', type: 'Historic Fortress' }
    ]
  },
  {
    id: 'bengaluru-india',
    name: 'Bengaluru (Garden City)',
    location: 'Karnataka, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Nature',
    tags: ['Nature', 'Culinary', 'Luxury', 'Adventure', 'Cultural'],
    popularityScore: 94,
    rating: 4.88,
    reviewCount: 5410,
    priceRange: '$$$',
    shortDescription: 'India\'s Silicon Valley and Garden City, renowned for sprawling botanical gardens, Tudor palaces, and craft breweries.',
    fullDescription: 'Bengaluru blends technological innovation with lush botanical serenity. Known for its year-round temperate climate, iconic Lalbagh Botanical Garden glasshouse, royal Bangalore Palace, monumental Vidhana Soudha, and vibrant craft brewery and cafe culture in Indiranagar and Koramangala.',
    highlights: [
      'Sprawling 240-acre Lalbagh Botanical Garden & Glass House',
      'Tudor-inspired Bangalore Palace architecture',
      'Monumental Dravidian-style Vidhana Soudha',
      'Sunrise trek to scenic Nandi Hills',
      'Vibrant microbrewery trails and specialty coffee culture'
    ],
    bestTimeToVisit: 'September to March (Year-round pleasant climate)',
    weather: 'Pleasant tropical savanna, 24°C avg',
    estimatedDailyBudget: '₹3,000 - ₹7,000 / day ($40 - $85)',
    topAttractions: [
      { name: 'Lalbagh Botanical Garden', type: 'Botanical Sanctuary' },
      { name: 'Bangalore Palace', type: 'Royal Palace' },
      { name: 'Nandi Hills', type: 'Sunrise Hilltop' },
      { name: 'Vidhana Soudha', type: 'Civic Landmark' }
    ]
  },
  {
    id: 'hyderabad-india',
    name: 'Hyderabad (City of Pearls)',
    location: 'Telangana, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626014303757-64662261947a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Culinary',
    tags: ['Culinary', 'Cultural', 'Photography', 'Luxury'],
    popularityScore: 95,
    rating: 4.91,
    reviewCount: 5890,
    priceRange: '$$',
    shortDescription: 'Historic City of Pearls famous for the 16th-century Charminar, Golconda Fort, Nizam palaces, and authentic Dum Biryani.',
    fullDescription: 'Hyderabad is a fascinating blend of Nizami royal heritage and thriving IT advancement. Stroll around the four grand minarets of Charminar, experience the acoustic wonder of Golconda Fort, marvel at the opulent Italian-marble interiors of Taj Falaknuma Palace, and indulge in world-renowned Dum Biryani and Irani Chai.',
    highlights: [
      'Iconic 1591 Charminar & bustling Laad Bazaar',
      'Acoustic marvels of Golconda Fort sound & light show',
      'Opulent Taj Falaknuma Palace heritage tour',
      'World-famous authentic Hyderabadi Dum Biryani & Irani Chai',
      'Ramoji Film City - world\'s largest film studio complex'
    ],
    bestTimeToVisit: 'October to March',
    weather: 'Warm & dry, 25°C in winter',
    estimatedDailyBudget: '₹2,500 - ₹5,800 / day ($30 - $70)',
    topAttractions: [
      { name: 'Charminar', type: 'Historic Monument' },
      { name: 'Golconda Fort', type: 'Medieval Fortress' },
      { name: 'Chowmahalla Palace', type: 'Nizam Royal Palace' },
      { name: 'Ramoji Film City', type: 'Themed Studio' }
    ]
  },
  {
    id: 'chennai-india',
    name: 'Chennai (Gateway of South India)',
    location: 'Tamil Nadu, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Beaches', 'Culinary', 'Photography'],
    popularityScore: 92,
    rating: 4.87,
    reviewCount: 4620,
    priceRange: '$$',
    shortDescription: 'Cultural capital of South India featuring Dravidian temple towers, Marina Beach, and Carnatic music traditions.',
    fullDescription: 'Chennai is steeped in ancient Dravidian heritage, classical arts, and coastal charm. Home to the towering rainbow gopurams of Kapaleeshwarar Temple in Mylapore, the expansive sands of Marina Beach along the Bay of Bengal, aromatic South Indian filter coffee, and UNESCO stone-carved shore temples at nearby Mahabalipuram.',
    highlights: [
      'Sunset strolls on Marina Beach, world\'s 2nd longest urban beach',
      'Towering Dravidian Gopuram of Kapaleeshwarar Temple',
      'UNESCO Shore Temples and monolithic Rathas in Mahabalipuram',
      'Authentic South Indian Chettinad feasts & filter coffee',
      'San Thome Basilica built over the tomb of St. Thomas'
    ],
    bestTimeToVisit: 'November to February (Cool coastal breeze)',
    weather: 'Tropical coastal, 27°C in winter',
    estimatedDailyBudget: '₹2,200 - ₹5,200 / day ($28 - $65)',
    topAttractions: [
      { name: 'Kapaleeshwarar Temple', type: 'Dravidian Temple' },
      { name: 'Marina Beach Promenade', type: 'Urban Beach' },
      { name: 'San Thome Basilica', type: 'Historic Cathedral' },
      { name: 'Mahabalipuram Shore Temple', type: 'UNESCO Heritage' }
    ]
  },
  {
    id: 'kolkata-india',
    name: 'Kolkata (City of Joy)',
    location: 'West Bengal, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Culinary', 'Photography', 'Romantic'],
    popularityScore: 94,
    rating: 4.89,
    reviewCount: 5230,
    priceRange: '$$',
    shortDescription: 'India\'s intellectual and cultural hub known for the marble Victoria Memorial, Howrah Bridge, and Bengali sweets.',
    fullDescription: 'Kolkata, the City of Joy, is celebrated for its colonial-era grandeur, literary legacy, vintage yellow ambassador taxis, and magnificent Durga Puja celebrations. Marvel at the gleaming white marble Victoria Memorial, cross the cantilever Howrah Bridge over the Hooghly River, and taste melt-in-mouth Rosogollas and kathi rolls on Park Street.',
    highlights: [
      'White marble Victoria Memorial Hall and gardens',
      'Engineering marvel of the cantilever Howrah Bridge',
      'Artistic idol-making alleys of Kumartuli',
      'Iconic Indian Coffee House on College Street',
      'Legendary Bengali sweetmeats: Mishti Doi & Rosogolla'
    ],
    bestTimeToVisit: 'October to March (Durga Puja & Winter season)',
    weather: 'Pleasant winter, 21°C avg',
    estimatedDailyBudget: '₹2,000 - ₹4,800 / day ($25 - $60)',
    topAttractions: [
      { name: 'Victoria Memorial', type: 'Marble Monument' },
      { name: 'Howrah Bridge', type: 'Cantilever Bridge' },
      { name: 'Dakshineswar Kali Temple', type: 'Sacred Temple' },
      { name: 'Park Street', type: 'Culinary & Heritage Avenue' }
    ]
  },
  {
    id: 'ahmedabad-india',
    name: 'Ahmedabad (Heritage City)',
    location: 'Gujarat, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Cultural',
    tags: ['Cultural', 'Culinary', 'Photography'],
    popularityScore: 91,
    rating: 4.86,
    reviewCount: 4180,
    priceRange: '$$',
    shortDescription: 'India\'s first UNESCO World Heritage City, home to Gandhi\'s Sabarmati Ashram, intricate stepwells, and night food bazaars.',
    fullDescription: 'Ahmedabad is a living museum of architectural masterpieces, historic pols (gated neighborhoods), and peaceful spiritual heritage. Visit Mahatma Gandhi\'s serene Sabarmati Ashram on the banks of the Sabarmati River, admire the 5-story carved Adalaj Stepwell, and feast on unlimited traditional Gujarati Thali and Manek Chowk night street food.',
    highlights: [
      'Historic Sabarmati Ashram, epicenter of India\'s freedom movement',
      'Intricate subterranean architecture of Adalaj Stepwell',
      'UNESCO Walled City heritage walk through ancient Pols',
      'Sidi Saiyyed Mosque and the famous Tree of Life stone lattice',
      'Manek Chowk bustling midnight street food bazaar'
    ],
    bestTimeToVisit: 'November to February (International Kite Festival in January)',
    weather: 'Dry & warm, 23°C in winter',
    estimatedDailyBudget: '₹2,000 - ₹4,500 / day ($25 - $55)',
    topAttractions: [
      { name: 'Sabarmati Ashram', type: 'Historical Sanctuary' },
      { name: 'Adalaj Stepwell', type: 'Solanki Architecture' },
      { name: 'Sidi Saiyyed Mosque', type: 'Carved Stone Jali' },
      { name: 'Sabarmati Riverfront', type: 'Urban Waterfront' }
    ]
  },
  {
    id: 'pune-india',
    name: 'Pune (Oxford of the East)',
    location: 'Maharashtra, India',
    country: 'India',
    countryCode: 'IN',
    image: 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Adventure',
    tags: ['Adventure', 'Cultural', 'Nature', 'Culinary'],
    popularityScore: 90,
    rating: 4.85,
    reviewCount: 3820,
    priceRange: '$$',
    shortDescription: 'Cultural capital of Maharashtra and gateway to Western Ghats hill stations, Maratha forts, and trekking trails.',
    fullDescription: 'Pune balances rich Maratha imperial history, lush green hill retreats, premier educational institutions, and a thriving youth culture. Explore the legendary fort ruins of Shaniwar Wada, the Italian arches of the Aga Khan Palace where Mahatma Gandhi was interned, and embark on weekend treks to Sinhagad Fort in the Western Ghats.',
    highlights: [
      'Historical Aga Khan Palace with Gandhi memorial',
      '18th-century Peshwa seat at Shaniwar Wada',
      'Panoramic mountain hike up to Sinhagad Fort',
      'Gateway to Lonavala, Khandala, and Western Ghats waterfalls',
      'Spicy Misal Pav and authentic Maharashtrian cuisine'
    ],
    bestTimeToVisit: 'July to February (Lush Monsoon & pleasant winter)',
    weather: 'Temperate plateau, 23°C avg',
    estimatedDailyBudget: '₹2,200 - ₹5,000 / day ($28 - $65)',
    topAttractions: [
      { name: 'Aga Khan Palace', type: 'National Monument' },
      { name: 'Shaniwar Wada', type: 'Maratha Fort Palace' },
      { name: 'Sinhagad Fort', type: 'Mountain Fortress Trek' },
      { name: 'Osho International Meditation Resort', type: 'Wellness Center' }
    ]
  }
];

