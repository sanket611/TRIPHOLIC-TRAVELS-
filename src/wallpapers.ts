export interface Wallpaper {
  id: string;
  location: string;
  country: string;
  tagline: string;
  category: 'Mountains' | 'Coastal & Beach' | 'Forest & Nature' | 'Iconic Landscape' | 'Heritage & Scenic';
  url: string;
  photographer: string;
}

export const NATURE_TRIP_WALLPAPERS: Wallpaper[] = [
  {
    id: 'swiss-alps',
    location: 'Zermatt & Matterhorn',
    country: 'Switzerland',
    tagline: 'Majestic Alpine peaks & crisp glacial lakes',
    category: 'Mountains',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Samuel Ferrara',
  },
  {
    id: 'banff-canada',
    location: 'Lake Louise, Banff',
    country: 'Canada',
    tagline: 'Glacial turquoise waters framed by the Canadian Rockies',
    category: 'Forest & Nature',
    url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=2000&q=85',
    photographer: 'John Lee',
  },
  {
    id: 'santorini-greece',
    location: 'Santorini Caldera',
    country: 'Greece',
    tagline: 'Sun-drenched whitewashed cliffs overlooking the Aegean Sea',
    category: 'Coastal & Beach',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Anthony DELANOIX',
  },
  {
    id: 'maldives-lagoon',
    location: 'Baa Atoll Lagoon',
    country: 'Maldives',
    tagline: 'Crystalline waters, coral reefs & endless blue horizons',
    category: 'Coastal & Beach',
    url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Mohamed Thasneem',
  },
  {
    id: 'bali-terraces',
    location: 'Tegallalang Rice Terraces, Ubud',
    country: 'Indonesia',
    tagline: 'Lush tropical rainforest valleys & emerald tiered terraces',
    category: 'Forest & Nature',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Oliver Sjöström',
  },
  {
    id: 'dolomites-italy',
    location: 'Seceda, Dolomites',
    country: 'Italy',
    tagline: 'Dramatic limestone needles rising above alpine meadows',
    category: 'Mountains',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Kalen Emsley',
  },
  {
    id: 'fuji-japan',
    location: 'Mount Fuji & Lake Kawaguchi',
    country: 'Japan',
    tagline: 'Iconic volcanic silhouette surrounded by serene lakeside beauty',
    category: 'Iconic Landscape',
    url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=2000&q=85',
    photographer: 'David Becker',
  },
  {
    id: 'amalfi-coast',
    location: 'Positano, Amalfi Coast',
    country: 'Italy',
    tagline: 'Pastel cliffside villages cascading down to the Mediterranean',
    category: 'Coastal & Beach',
    url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Rebekah Yip',
  },
  {
    id: 'yosemite-valley',
    location: 'Yosemite National Park',
    country: 'United States',
    tagline: 'Towering granite monoliths, ancient pines & roaring waterfalls',
    category: 'Forest & Nature',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Kalen Emsley',
  },
  {
    id: 'cappadocia-turkey',
    location: 'Göreme Valley, Cappadocia',
    country: 'Turkey',
    tagline: 'Surreal volcanic rock chimneys and sunrise skies',
    category: 'Iconic Landscape',
    url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Yonatan Chen',
  },
  {
    id: 'norway-fjords',
    location: 'Geirangerfjord & Lofoten',
    country: 'Norway',
    tagline: 'Deep arctic fjords and dramatic sea-mountain cliffs',
    category: 'Mountains',
    url: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Stephan Henning',
  },
  {
    id: 'hawaii-na-pali',
    location: 'Na Pali Coast, Kauai',
    country: 'United States',
    tagline: 'Fluted emerald sea ridges dropping straight into Pacific waters',
    category: 'Coastal & Beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Sean Oulashin',
  },
  {
    id: 'kashmir-valley',
    location: 'Dal Lake & Gulmarg',
    country: 'India',
    tagline: 'Misty pine valleys, Himalayan snowcaps & serene floating shikaras',
    category: 'Heritage & Scenic',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Imad Clicks',
  },
  {
    id: 'iceland-aurora',
    location: 'Kirkjufell & Black Sand Beaches',
    country: 'Iceland',
    tagline: 'Emerald northern lights dancing above volcanic sea stacks',
    category: 'Iconic Landscape',
    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Jonatan Pie',
  },
  {
    id: 'new-zealand-fiord',
    location: 'Milford Sound, South Island',
    country: 'New Zealand',
    tagline: 'Dramatic glacier-carved peaks and cascading waterfalls',
    category: 'Mountains',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Sora Sagano',
  },
  {
    id: 'hallstatt-austria',
    location: 'Hallstatt Alpine Village',
    country: 'Austria',
    tagline: 'Fairytale lakeside village mirrored in tranquil waters',
    category: 'Heritage & Scenic',
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2000&q=85',
    photographer: 'Sorin Sirbu',
  },
];

/**
 * Returns a random wallpaper from the collection, ensuring a fresh wallpaper on every session/refresh
 */
export function getRandomWallpaper(excludeId?: string): Wallpaper {
  const filtered = excludeId
    ? NATURE_TRIP_WALLPAPERS.filter((w) => w.id !== excludeId)
    : NATURE_TRIP_WALLPAPERS;
  const list = filtered.length > 0 ? filtered : NATURE_TRIP_WALLPAPERS;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
