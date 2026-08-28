import { TripPlan, TravelPreferences, TravelStyle, FoodPreference } from './types';

export function getEffectiveTravelStyles(prefs: TravelPreferences): TravelStyle[] {
  if (prefs.travelStyles && Array.isArray(prefs.travelStyles) && prefs.travelStyles.length > 0) {
    return prefs.travelStyles as TravelStyle[];
  }
  if (Array.isArray(prefs.travelStyle)) {
    return prefs.travelStyle as TravelStyle[];
  }
  if (typeof prefs.travelStyle === 'string' && prefs.travelStyle.trim().length > 0) {
    const parts = prefs.travelStyle.split(/[,&+]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts as TravelStyle[];
  }
  return ['Adventure'];
}

export function getEffectiveFoodPreferences(prefs: TravelPreferences): FoodPreference[] {
  if (prefs.foodPreferences && Array.isArray(prefs.foodPreferences) && prefs.foodPreferences.length > 0) {
    return prefs.foodPreferences as FoodPreference[];
  }
  if (Array.isArray(prefs.foodPreference)) {
    return prefs.foodPreference as FoodPreference[];
  }
  if (typeof prefs.foodPreference === 'string' && prefs.foodPreference.trim().length > 0) {
    const parts = prefs.foodPreference.split(/[,&+]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts as FoodPreference[];
  }
  return ['Vegetarian'];
}

export function generatePlan(prefs: TravelPreferences): TripPlan {
  const destination = (prefs.destination || 'Selected Destination').trim();
  const totalDays = Math.max(1, Math.min(prefs.duration || 3, 30));
  const budget = Math.max(100, prefs.budget || 15000);
  const currency = prefs.currency || '₹';
  const travelers = Math.max(1, prefs.travelers || 1);
  const stylesList = getEffectiveTravelStyles(prefs);
  const travelStyleDisplay = stylesList.join(' & ');
  const foodsList = getEffectiveFoodPreferences(prefs);
  const foodPreferenceDisplay = foodsList.join(' & ');
  const primaryFood = foodsList[0] || 'Vegetarian';

  // 5-Category Realistic Financial Balance
  const accomm = Math.round(budget * 0.38);
  const food = Math.round(budget * 0.27);
  const trans = Math.round(budget * 0.16);
  const act = Math.round(budget * 0.13);
  const misc = Math.max(0, budget - (accomm + food + trans + act));
  const estTotal = accomm + food + trans + act + misc;

  const destLower = destination.toLowerCase();
  const isGoa = destLower.includes('goa');
  const isManali = destLower.includes('manali') || destLower.includes('himachal');
  const isKerala = destLower.includes('kerala') || destLower.includes('munnar') || destLower.includes('kochi');
  const isParis = destLower.includes('paris');
  const isTokyo = destLower.includes('tokyo') || destLower.includes('japan');
  const isDubai = destLower.includes('dubai');
  const isBali = destLower.includes('bali');
  const isRajasthan = destLower.includes('rajasthan') || destLower.includes('jaipur') || destLower.includes('udaipur');
  const isNewYork = destLower.includes('new york') || destLower.includes('nyc');

  const days: TripPlan['itinerary'] = [];

  for (let i = 1; i <= totalDays; i++) {
    const currentStyle = stylesList[(i - 1) % stylesList.length];
    const theme = stylesList.length > 1 
      ? `${currentStyle} & ${stylesList[i % stylesList.length]} Blend` 
      : `${currentStyle} Experience`;

    let morningActivity = `Morning exploration of signature highlights in ${destination}`;
    let morningPlace = `Historic & Scenic Center of ${destination}`;
    let afternoonActivity = `Afternoon ${currentStyle.toLowerCase()} immersion & local dining`;
    let afternoonPlace = `Cultural & Leisure District`;
    let eveningActivity = `Sunset panoramic viewpoint & relaxed evening dining`;
    let eveningPlace = `Scenic Promenade in ${destination}`;
    let stayArea = `Central ${destination}`;

    if (isGoa) {
      if (i % 2 === 1) {
        stayArea = 'North Goa (Candolim / Anjuna)';
        morningPlace = 'Anjuna & Vagator Coastal Cliffs';
        morningActivity = 'Coastal trail walk, sea-breeze viewpoints, and beachside espresso';
        afternoonPlace = 'Calangute & Baga Activity Hub';
        afternoonActivity = 'Water sports orientation, flea market browsing, and fresh seaside lunch';
        eveningPlace = 'Chapora Fort & Sunset Deck';
        eveningActivity = 'Panoramic sunset overlooking the Arabian Sea followed by live acoustic music';
      } else {
        stayArea = 'South Goa (Panaji & Palolem)';
        morningPlace = 'Fontainhas Latin Quarter (Panaji)';
        morningActivity = 'Heritage photography walk through Portuguese villas and historic bakeries';
        afternoonPlace = 'Old Goa Historic Basilicas';
        afternoonActivity = 'Architectural exploration of UNESCO world heritage cathedrals and spice plantations';
        eveningPlace = 'Miramar Beach / Mandovi River Cruise';
        eveningActivity = 'Twilight river promenade and authentic regional coastal dinner';
      }
    } else if (isManali) {
      stayArea = i <= 2 ? 'Old Manali / Clubhouse Road' : 'Solang Valley / Vashisht';
      morningPlace = i % 2 === 1 ? 'Hadimba Temple & Cedar Woods' : 'Solang Valley Adventure Slopes';
      morningActivity = i % 2 === 1 ? 'Peaceful pine forest nature walk and heritage woodcrafts' : 'Cable car ride, paragliding, and mountain stream viewpoints';
      afternoonPlace = i % 2 === 1 ? 'Old Manali Artisan Cafes' : 'Jogini Waterfalls Trail';
      afternoonActivity = 'Warm cedar-roasted coffee, local trout or mountain thali, and stream crossing';
      eveningPlace = 'Mall Road & Tibetan Monastery Market';
      eveningActivity = 'Woolen handicraft shopping, warm steamed dumplings, and Himalayan sunset views';
    } else if (isKerala) {
      stayArea = i % 2 === 1 ? 'Fort Kochi / Mattancherry' : 'Munnar Tea Hills / Alleppey Backwaters';
      morningPlace = i % 2 === 1 ? 'Fort Kochi Chinese Fishing Nets' : 'Kolukkumalai Tea Plantation';
      morningActivity = 'Historic harbor walk, spice warehouse tours, and colonial street art';
      afternoonPlace = i % 2 === 1 ? 'Jew Town & Synagogue' : 'Backwater Houseboat Canal';
      afternoonActivity = 'Antiques browsing, authentic banana-leaf lunch, and coconut grove cruise';
      eveningPlace = 'Cherai Beach Sunset / Kathakali Center';
      eveningActivity = 'Traditional Kathakali performing arts recital and Ayurvedic dinner';
    } else if (isParis) {
      stayArea = i % 2 === 1 ? 'Le Marais / Latin Quarter' : 'Montmartre / 7th Arrondissement';
      morningPlace = i % 2 === 1 ? 'Montmartre & Sacré-Cœur' : 'Louvre Courtyard & Tuileries Garden';
      morningActivity = 'Cobblestone artist quarter walk, fresh pain au chocolat, and panoramic city views';
      afternoonPlace = i % 2 === 1 ? 'Musée d’Orsay & Saint-Germain' : 'Le Marais Boutique Alleyways';
      afternoonActivity = 'Impressionist masterpieces, courtyard bookstores, and French bistro lunch';
      eveningPlace = 'Seine River Footbridges & Eiffel Tower';
      eveningActivity = 'Illuminated twilight river cruise and sidewalk dinner with patisseries';
    } else if (isTokyo) {
      stayArea = i % 2 === 1 ? 'Shinjuku / Shibuya' : 'Asakusa / Ginza';
      morningPlace = i % 2 === 1 ? 'Meiji Jingu Shrine & Yoyogi Park' : 'Senso-ji Temple (Asakusa)';
      morningActivity = 'Serene cedar shrine walk, traditional incense rituals, and matcha tea';
      afternoonPlace = i % 2 === 1 ? 'Shibuya Crossing & Harajuku' : 'Akihabara & Ginza Promenades';
      afternoonActivity = 'Vibrant street fashion, artisan ramen/tempura tasting, and tech galleries';
      eveningPlace = 'Roppongi Hills / Shinjuku Omoide Yokocho';
      eveningActivity = 'Panoramic skyline observatory and lantern-lit izakaya dining';
    } else if (isDubai) {
      stayArea = i % 2 === 1 ? 'Downtown Dubai / Business Bay' : 'Dubai Marina / JBR';
      morningPlace = i % 2 === 1 ? 'Dubai Miracle Garden & Creek' : 'Jumeirah Beach Promenade';
      morningActivity = 'Floral canopy walks, traditional Abra boat creek crossing, and spice souks';
      afternoonPlace = i % 2 === 1 ? 'Dubai Mall & Burj Khalifa' : 'Palm Jumeirah & Atlantis Monorail';
      afternoonActivity = 'World-class aquarium, viewing decks, and luxury dining avenues';
      eveningPlace = 'Desert Safari Camp / Marina Dhow Cruise';
      eveningActivity = 'Dune sunset photography, traditional Tanoura dance, and Arabian feast';
    } else if (isBali) {
      stayArea = i % 2 === 1 ? 'Ubud Cultural Heart' : 'Seminyak / Uluwatu Coast';
      morningPlace = i % 2 === 1 ? 'Tegallalang Rice Terraces' : 'Uluwatu Sea Temple Cliff';
      morningActivity = 'Lush emerald terrace trekking, jungle swings, and organic smoothie bowls';
      afternoonPlace = i % 2 === 1 ? 'Ubud Sacred Monkey Forest' : 'Padang Padang Beach Cove';
      afternoonActivity = 'Artisan woodcarving markets, temple sanctuaries, and beachside coconuts';
      eveningPlace = 'Jimbaran Bay Sunset / Kecak Fire Dance';
      eveningActivity = 'Dramatic cliffside Kecak fire dance and candlelit beachfront dinner';
    } else if (isRajasthan) {
      stayArea = 'Heritage Quarter / Old City';
      morningPlace = i % 2 === 1 ? 'Amber Fort & Elephant Path' : 'City Palace & Hawa Mahal';
      morningActivity = 'Grand fortress courtyards, marble carvings, and panoramic valley ramparts';
      afternoonPlace = 'Johari Bazaar & Artisan Textile Studios';
      afternoonActivity = 'Hand-block printing workshops, royal museums, and Rajasthani thali lunch';
      eveningPlace = 'Nahargarh Fort Sunset Viewpoint';
      eveningActivity = 'Golden hour city panorama and folk music performance with dinner';
    } else if (isNewYork) {
      stayArea = 'Manhattan / Midtown';
      morningPlace = i % 2 === 1 ? 'Central Park & The Met' : 'High Line & Chelsea Market';
      morningActivity = 'Scenic park promenade, world-renowned museum galleries, and artisan coffee';
      afternoonPlace = i % 2 === 1 ? 'SoHo & Greenwich Village' : 'Brooklyn Bridge Walk & DUMBO';
      afternoonActivity = 'Cast-iron architecture, indie boutiques, authentic New York pizza or deli lunch';
      eveningPlace = 'Top of the Rock / Broadway Theater District';
      eveningActivity = 'Iconic skyscraper sunset skyline and Broadway performance with dinner';
    }

    // Specific style overrides
    if (currentStyle === 'Adventure') {
      morningActivity = `Outdoor trekking, scenic viewpoints, and coastal/mountain discovery in ${destination}`;
      afternoonActivity = `High-energy trail exploration, local watersports or off-road excursions`;
      eveningActivity = `Scenic summit/cliffside sunset photography & vibrant night market`;
    } else if (currentStyle === 'Relaxed') {
      morningActivity = `Leisurely breakfast followed by unhurried scenic stroll through shaded gardens`;
      afternoonActivity = `Wellness spa session, artisan cafe reading, and tranquil neighborhood browsing`;
      eveningActivity = `Golden hour sunset lounge with live acoustic music and candlelit dinner`;
    } else if (currentStyle === 'Cultural & Heritage') {
      morningActivity = `Guided walking tour through historic landmarks and ancient monuments in ${destination}`;
      afternoonActivity = `Artisan craft cooperatives, heritage museums, and cultural workshops`;
      eveningActivity = `Traditional performing arts recital and historic regional banquet`;
    } else if (currentStyle === 'Foodie & Culinary') {
      morningActivity = `Artisan breakfast bakery walk and specialty coffee/tea tasting`;
      afternoonActivity = `Curated street food trail and regional cooking demonstration`;
      eveningActivity = `Chef-table signature regional dinner and ambient sunset lounge`;
    } else if (currentStyle === 'Luxury') {
      morningActivity = `Private chauffeur transport to exclusive scenic vantage points and private gardens`;
      afternoonActivity = `High-end wellness retreat, premium boutique shopping, and curated tea service`;
      eveningActivity = `Gourmet multi-course fine dining reservation overlooking panoramic vistas`;
    } else if (currentStyle === 'Family Friendly') {
      morningActivity = `Interactive science center, wildlife sanctuary, or theme garden with kid-friendly paths`;
      afternoonActivity = `Shaded park pavilions, gentle scenic boat ride, and casual dessert stops`;
      eveningActivity = `Musical fountain display, open plaza walk, and family-friendly dining`;
    }

    const dayCostAct = Math.round(act / totalDays);
    const dayCostFood = Math.round(food / totalDays);

    days.push({
      day: i,
      title: `Day ${i}: ${destination} ${currentStyle} Highlights`,
      theme,
      stayArea,
      morning: {
        time: '08:30 AM - 12:00 PM',
        activity: morningActivity,
        place: morningPlace,
        description: `Start the day with tailored morning exploration designed for ${travelers} traveler(s) without transit rush.`,
        estCost: `${currency} ${Math.round(dayCostAct * 0.45)}`,
      },
      afternoon: {
        time: '01:00 PM - 04:30 PM',
        activity: afternoonActivity,
        place: afternoonPlace,
        description: `Enjoy delicious ${foodPreferenceDisplay} dining followed by engaging activities in the same neighborhood corridor.`,
        estCost: `${currency} ${Math.round(dayCostFood * 0.45)}`,
      },
      evening: {
        time: '05:30 PM - 09:30 PM',
        activity: eveningActivity,
        place: eveningPlace,
        description: `Golden hour sunset views, twilight strolls, and a memorable dinner atmosphere.`,
        estCost: `${currency} ${Math.round(dayCostFood * 0.55 + dayCostAct * 0.55)}`,
      },
      travelNotes: `Local transport guidance: Group activities geographically to keep transit under 20-30 mins per leg.`,
    });
  }

  return {
    id: 'trip_' + Date.now(),
    createdAt: new Date().toISOString(),
    preferences: prefs,
    tripSummary: {
      destination,
      duration: totalDays,
      travelers,
      budgetFormatted: `${currency} ${budget.toLocaleString()}`,
      travelStyle: travelStyleDisplay,
      foodPreference: foodPreferenceDisplay,
      summary: `A carefully balanced ${totalDays}-day travel blueprint in ${destination} designed for ${travelers} traveler(s) combining ${travelStyleDisplay} with a total budget of ${currency} ${budget.toLocaleString()}. Featuring tailored ${foodPreferenceDisplay} dining, scenic photography spots, and seamless day-by-day scheduling.`,
      highlights: [
        `Curated ${travelStyleDisplay} experiences across ${destination}`,
        `100% compliant ${foodPreferenceDisplay} dining recommendations`,
        `Geographically clustered itinerary eliminating unnecessary transit`,
        `Transparent 5-category budget breakdown with cost-saving guidance`,
      ],
      bestSeason: isGoa ? 'November to February (Pleasant coastal breezes)' : 'October to March (Ideal sightseeing weather)',
      tripVibe: `${travelStyleDisplay} & ${prefs.interests?.slice(0, 2).join(' / ') || 'Exploration'} in ${destination}`,
    },
    itinerary: days,
    recommendedPlaces: [
      {
        name: isGoa ? 'Chapora Fort & Vagator Coast' : `Historic Heart of ${destination}`,
        tag: 'Iconic Viewpoint & Sunset',
        description: `Panoramic 360-degree vistas overlooking scenic coastlines and historical battlements.`,
        whySuitable: `Perfect for photography and ${travelStyleDisplay.toLowerCase()} lovers seeking memorable sights.`,
        bestTimeToVisit: '4:30 PM - 6:30 PM (Sunset)',
        estimatedEntryFee: 'Free entry',
        locationArea: isGoa ? 'North Goa' : `Central ${destination}`,
      },
      {
        name: isGoa ? 'Fontainhas Latin Quarter' : `Artisan Quarter of ${destination}`,
        tag: 'Heritage & Street Photography',
        description: `Narrow cobbled streets lined with vibrant heritage architecture and quaint cafes.`,
        whySuitable: `High aesthetic value, rich architecture, and authentic local vibes.`,
        bestTimeToVisit: '09:00 AM - 11:30 AM (Cool morning light)',
        estimatedEntryFee: 'Free walk',
        locationArea: isGoa ? 'Panaji' : `Old Town ${destination}`,
      },
      {
        name: isGoa ? 'Grand Island Coastal Waters' : `Adventure Zone in ${destination}`,
        tag: 'Adventure & Scenic Excursion',
        description: `Exciting boat excursion featuring dolphin watching, snorkeling, and water sports.`,
        whySuitable: `Aligns directly with your interest in thrilling outdoor activities and scenic views.`,
        bestTimeToVisit: '08:00 AM - 01:30 PM',
        estimatedEntryFee: `${currency} 1,500 - 2,200 per person`,
        locationArea: isGoa ? 'Offshore Mormugao' : `Adventure Hub`,
      },
      {
        name: isGoa ? 'Anjuna Flea & Night Market' : `Bustling Local Market in ${destination}`,
        tag: 'Shopping & Cultural Vibe',
        description: `Lively open-air marketplace featuring handmade handicrafts, artisan apparel, and live music.`,
        whySuitable: `Great for souvenirs, street photography, and vibrant evening culture.`,
        bestTimeToVisit: '06:00 PM - 10:00 PM',
        estimatedEntryFee: 'Free entry',
        locationArea: isGoa ? 'Anjuna' : `Market Center`,
      },
    ],
    foodRecommendations: {
      preferenceNote: `Specially curated delicious ${foodPreferenceDisplay} food guide for ${destination}`,
      breakfast: [
        {
          dish: isGoa ? 'Goan Poi with Mushroom Xacuti / Poha & Filter Coffee' : `Traditional ${primaryFood} Morning Platter`,
          placeOrType: isGoa ? 'Artjuna Garden Cafe or Local Bakery' : 'Iconic Morning Cafe',
          description: `Freshly baked local bread paired with spiced gravies and organic herbal teas.`,
          priceRange: `${currency} 150 - 300`,
        },
      ],
      lunch: [
        {
          dish: isGoa ? 'Special Goan Vegetarian Thali with Sol Kadhi & Pickle' : `Regional ${primaryFood} Lunch Feast`,
          placeOrType: isGoa ? 'Kokni Kanteen or Ritz Classic' : 'Renowned Heritage Restaurant',
          description: `Wholesome variety of regional curries, rice, crispy fried snacks, and refreshing digestive drinks.`,
          priceRange: `${currency} 250 - 550`,
        },
      ],
      dinner: [
        {
          dish: isGoa ? 'Paneer Cafreal / Veg Caldin Curry with Steamed Rice' : `Chef Specialty ${primaryFood} Dinner`,
          placeOrType: isGoa ? 'Gunpowder (Assagao) or Fisherman\'s Wharf' : 'Atmospheric Sunset Bistro',
          description: `Rich aromatic herbs and coconut-based traditional sauces served in a romantic ambient setting.`,
          priceRange: `${currency} 450 - 900`,
        },
      ],
      localSpecialties: [
        {
          name: isGoa ? 'Bebinca & Dodol (Traditional Goan Sweets)' : `Signature ${destination} Sweet & Snack`,
          description: `Layered coconut milk and jaggery delicacy that melts in your mouth.`,
          mustTryAt: isGoa ? 'Confeitaria 31 De Janeiro (Panaji)' : `Historic Confectionery in ${destination}`,
          dietaryTag: `${primaryFood} Friendly`,
        },
      ],
    },
    budget: {
      currency,
      userBudget: budget,
      estimatedTotal: estTotal,
      breakdown: {
        accommodation: accomm,
        food,
        transportation: trans,
        activities: act,
        miscellaneous: misc,
      },
      budgetStatus: 'within_budget',
      budgetNote: `Plan estimated for ${travelers} traveler(s) over ${totalDays} days. Includes accommodation, meals, local transport, and activity tickets.`,
      costSavingTips: [
        'Rent a two-wheeler or shared cab rather than point-to-point private taxis.',
        `Dine at authentic local eateries for lunch and reserve dinners for specialty venues.`,
        'Book water sports and museum slots directly at the venue to skip third-party commissions.',
      ],
      optionalSplurges: [
        {
          item: isGoa ? 'Sunset Luxury Catamaran Cruise with Dinner' : `VIP Sunset Experience in ${destination}`,
          cost: `${currency} 2,500 / person`,
          reason: 'Unforgettable scenic vantage point and chilled beverages.',
        },
      ],
    },
    travelTips: {
      bestTimeToVisit: isGoa ? 'November to February for mild temperatures and active nightlife.' : 'September to March for comfortable outdoor temperatures.',
      localTransportation: [
        'Rental scooters / self-drive cars are most economical.',
        'Always negotiate auto-rickshaw fares or ask for the digital meter.',
        'Use pre-paid taxi counters at airport/railway stations.',
      ],
      packingList: [
        'Breathable cotton shirts, shorts, and swimwear',
        'Sunscreen (SPF 50+), UV sunglasses, and sun hat',
        'Power bank, waterproof phone cover, and universal adapter',
        'Reusable water bottle and basic first-aid kit',
        'Comfortable walking shoes and flip-flops',
      ],
      safetyTips: [
        'Keep emergency contacts and digital copies of your passport/ID accessible offline.',
        'Swim only in designated lifeguard-monitored zones.',
        'Carry a small amount of cash as small beach shacks may have intermittent network coverage.',
      ],
      bookingSuggestions: [
        'Reserve beach-facing accommodations at least 2-3 weeks in advance during high season.',
        'Schedule scuba or adventure activities for Day 2 morning when rested.',
      ],
      localEtiquette: [
        'Respect quiet hours in residential neighborhoods after 10:00 PM.',
        'Dress modestly when entering heritage churches, temples, or shrines.',
        'Leave no trace: dispose of plastics and trash responsibly.',
      ],
    },
    alternativePlan: {
      title: stylesList.includes('Adventure') ? 'The Mindful Scenic Explorer & Heritage Trail' : 'The High-Adrenaline Adventure Explorer',
      alternativeStyle: stylesList.includes('Adventure') ? 'Mindful Slow Travel & Hidden Cafes' : 'Action-Packed Outdoor Thrills',
      targetPersona: stylesList.includes('Adventure')
        ? 'For the mindful wanderer seeking serene mornings, artisan workshops, and zero timetable pressure.'
        : 'For the thrill-seeker looking for high-octane water sports, off-road expeditions, and cliffside viewpoints.',
      vibeShift: stylesList.includes('Adventure')
        ? 'High-Energy Adrenaline ➔ Unrushed Mindful Exploration'
        : 'Leisurely Sightseeing ➔ High-Adrenaline Expedition',
      energyLevel: stylesList.includes('Adventure') ? 'Relaxed & Zen' : 'High Energy & Thrills',
      concept: stylesList.includes('Adventure')
        ? 'A contrasting experiential counter-proposal replacing high-mileage transit with intimate neighborhood discovery, extended cafe mornings, and off-the-beaten-path sunset vistas.'
        : 'A dynamic alternative blueprint prioritizing summit treks, jet-ski safaris, hidden sea caves, and energetic night markets.',
      pacingSummary: stylesList.includes('Adventure')
        ? '40% more unhurried free time, zero early morning alarms, leisurely golden-hour dinners.'
        : 'Fast-paced, action-oriented schedule with morning sports and evening social hubs.',
      keyDifferences: [
        stylesList.includes('Adventure')
          ? 'Swaps commercial sports for quiet beach coves, pottery ateliers, and secret viewpoints'
          : 'Replaces quiet cafe afternoons with ATV jungle tracks and scuba diving sessions',
        stylesList.includes('Adventure')
          ? 'Allocates 3+ hours of flexible golden-hour downtime every afternoon'
          : 'Maximizes daylight hours with back-to-back outdoor excursions',
        `Estimated budget is ~${stylesList.includes('Adventure') ? '15% lower' : '10% higher'} due to activity allocation shifts`,
      ],
      whatYouGain: [
        stylesList.includes('Adventure')
          ? 'Spontaneous afternoon discovery without rigid reservation timelines'
          : 'Unmatched adrenaline rushes and panoramic summit photography',
        'Deep authentic local interactions away from typical tourist crowds',
        'Distinctive memories and off-the-beaten-path hidden gems',
      ],
      whatYouSkip: [
        stylesList.includes('Adventure')
          ? 'Long ticket lines at crowded commercial water sport operators'
          : 'Passive museum tours and long indoor gallery visits',
        'Exhausting multi-neighborhood transit during peak traffic hours',
        'Overpriced tourist traps with generic menus',
      ],
      secretGems: [
        {
          name: isGoa ? 'Cabo de Rama Secret Cliff & Sweet Water Lake' : `Secret Panoramic Ridge in ${destination}`,
          whySpecial: 'Dramatic secluded ocean cliff with natural freshwater lagoon away from crowds',
          bestFor: 'Sunset picnics, coastal photography, and quiet mindfulness',
          vibeTag: 'Secret Havens',
        },
        {
          name: isGoa ? 'Fontainhas Heritage Bakery & Artisan Tile Studio' : `Historic Craft Guild in ${destination}`,
          whySpecial: 'Centuries-old family-run oven and handmade Azulejos ceramic workshops',
          bestFor: 'Culinary nostalgia and handcrafted souvenirs',
          vibeTag: 'Artisan Heritage',
        },
      ],
      quickDayOverview: Array.from({ length: Math.min(totalDays, 4) }, (_, idx) => ({
        day: idx + 1,
        title: `Day ${idx + 1}: ${stylesList.includes('Adventure') ? 'Artisan Village & Sunset Cove' : 'Coastal Ridge Trek & Water Expedition'}`,
        focus: stylesList.includes('Adventure')
          ? 'Slow-roast morning espresso, local pottery studio, and peaceful cliffside sunset.'
          : 'Morning sea-cave kayak tour, coastal ATV dirt run, and beach bonfire.',
        highlightSpot: stylesList.includes('Adventure') ? 'Secluded Sunset Lookout' : 'Off-grid Adventure Point',
        pacingNote: stylesList.includes('Adventure') ? 'Unhurried and spontaneous' : 'High energy and thrilling',
      })),
      estimatedCostComparison: `Approx. ${currency} ${Math.round(budget * (stylesList.includes('Adventure') ? 0.85 : 1.05)).toLocaleString()} (${stylesList.includes('Adventure') ? 'Save ~15% on pass fees' : 'Slight activity upgrade'})`,
      costImpactType: stylesList.includes('Adventure') ? 'cheaper' : 'similar',
    },
  };
}

export function modifyPlan(currentPlan: TripPlan, modificationPrompt: string): TripPlan {
  const updatedPlan: TripPlan = JSON.parse(JSON.stringify(currentPlan));
  const modLower = (modificationPrompt || '').toLowerCase();

  if (modLower.includes('adventurous') || modLower.includes('adventure')) {
    updatedPlan.itinerary.forEach((d) => {
      if (modLower.includes(`day ${d.day}`) || (modLower.includes('day 2') && d.day === 2) || !modLower.includes('day')) {
        d.theme = 'High-Adrenaline Adventure & Thrills';
        d.morning.activity = 'Bungee jumping, zip-lining or high-speed jet ski safari';
        d.afternoon.activity = 'ATV dirt-trail adventure or rock climbing';
        d.evening.activity = 'Cliffside sunset bonfire & adventure debrief';
      }
    });
    updatedPlan.tripSummary.summary += ` [Updated with high-octane adventure enhancements.]`;
  } else if (modLower.includes('cheap') || modLower.includes('reduce') || modLower.includes('budget') || modLower.includes('30%') || modLower.includes('save')) {
    const factor = 0.7;
    updatedPlan.budget.estimatedTotal = Math.round(updatedPlan.budget.estimatedTotal * factor);
    updatedPlan.budget.breakdown.accommodation = Math.round(updatedPlan.budget.breakdown.accommodation * factor);
    updatedPlan.budget.breakdown.food = Math.round(updatedPlan.budget.breakdown.food * factor);
    updatedPlan.budget.breakdown.activities = Math.round(updatedPlan.budget.breakdown.activities * factor);
    updatedPlan.budget.budgetNote = `Budget optimized by ~30% with smart hostel/guesthouse stays and public transit.`;
    updatedPlan.budget.costSavingTips.unshift('Stay in verified eco-hostels or boutique guesthouses.');
  } else if (modLower.includes('beach') || modLower.includes('beaches')) {
    updatedPlan.itinerary.forEach((d) => {
      d.morning.place += ' & Secret Cove Beach';
      d.afternoon.activity += ' with seaside swimming & sunbathing';
    });
  } else if (modLower.includes('kid') || modLower.includes('children') || modLower.includes('family')) {
    updatedPlan.itinerary.forEach((d) => {
      d.theme = 'Family & Kid-Friendly Exploration';
      d.morning.activity = 'Interactive wildlife sanctuary / science park visit';
      d.afternoon.activity = 'Safe beach water park or shaded botanical gardens';
      d.evening.activity = 'Family-friendly musical fountain and casual dining';
    });
  } else if (modLower.includes('vegetarian') || modLower.includes('vegan')) {
    updatedPlan.preferences.foodPreference = modLower.includes('vegan') ? 'Vegan' : 'Vegetarian';
    updatedPlan.foodRecommendations.preferenceNote = `Strictly customized 100% ${updatedPlan.preferences.foodPreference} dining trail.`;
  } else if (modLower.includes('relax') || modLower.includes('relaxed') || modLower.includes('slow')) {
    updatedPlan.itinerary.forEach((d) => {
      d.theme = 'Slow Travel & Mindful Relaxation';
      d.morning.activity = 'Gentle morning yoga followed by leisurely brunch';
      d.afternoon.activity = 'Ayurvedic spa massage or quiet cafe reading';
      d.evening.activity = 'Tranquil sunset beach stroll & candlelight dinner';
    });
  } else {
    // General modification
    updatedPlan.itinerary.forEach((d) => {
      d.travelNotes += ` [Customized: ${modificationPrompt}]`;
    });
  }

  updatedPlan.id = currentPlan.id || 'trip_' + Date.now();
  updatedPlan.createdAt = currentPlan.createdAt;
  updatedPlan.modificationHistory = currentPlan.modificationHistory || [];
  updatedPlan.modificationHistory.push({
    prompt: modificationPrompt,
    timestamp: new Date().toISOString(),
  });

  return updatedPlan;
}
