// Rich photographic library curated for travel itineraries, day-by-day sightseeing, and time slots
import { ALL_AVAILABLE_DESTINATIONS } from './destinations';

export interface ScenicPhotoInfo {
  url: string;
  title: string;
  caption: string;
  slot?: 'morning' | 'afternoon' | 'evening' | 'highlight';
}

export interface DayPhotoGallery {
  hero: ScenicPhotoInfo;
  morning: ScenicPhotoInfo;
  afternoon: ScenicPhotoInfo;
  evening: ScenicPhotoInfo;
  all: ScenicPhotoInfo[];
}

// Curated high-resolution Unsplash travel photography organized by destination
// Each destination has 6-12 distinct, high-clarity photos covering different spots, times of day, and landmarks
export const DESTINATION_DAY_PHOTOS: Record<string, {
  name: string;
  photos: {
    url: string;
    title: string;
    caption: string;
    suggestedSlot?: 'morning' | 'afternoon' | 'evening' | 'highlight';
  }[];
}> = {
  goa: {
    name: 'Goa',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        title: 'Vagator Beach & Coastal Cliffs',
        caption: 'Dramatic red sandstone cliffs and shimmering turquoise Arabian Sea surf.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80',
        title: 'Fontainhas Latin Quarter, Panaji',
        caption: 'Vibrant pastel Portuguese colonial villas and picturesque narrow lanes.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1200&q=80',
        title: 'Palolem Beach Sunset & Shacks',
        caption: 'Crescent-shaped serene beach framed by leaning coconut palms at twilight.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        title: 'Chapora Fort Panoramic Deck',
        caption: 'Historic Portuguese hilltop rampart overlooking the Ozran coast.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        title: 'Baga & Calangute Water Sports Bay',
        caption: 'Lively golden sands with catamaran sails and parasailing adventures.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Dudhsagar Waterfalls Trek',
        caption: 'Four-tiered roaring white cascades amidst lush Western Ghats rainforest.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        title: 'Mandovi River Sunset Cruise',
        caption: 'Scenic golden hour river cruise with Goan folk music and ocean views.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        title: 'Old Goa Se Cathedral & Basilica',
        caption: 'UNESCO World Heritage 16th-century Manueline architecture.',
        suggestedSlot: 'afternoon',
      },
    ],
  },
  manali: {
    name: 'Manali & Solang Valley',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        title: 'Solang Valley Snow Slopes',
        caption: 'Alpine meadows, paragliding launches, and snow-capped Himalayan ridges.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1596761405105-01e4054a8cf3?auto=format&fit=crop&w=1200&q=80',
        title: 'Jogini Waterfalls & Pine Trail',
        caption: 'Cascading alpine stream surrounded by ancient deodar cedar forests.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
        title: 'Old Manali Bohemian Cafes',
        caption: 'Rustic wooden mountain lodges with rooftop views of the Beas river.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Rohtang Pass High Altitude Vista',
        caption: 'Dramatic mountain pass at 13,058 ft with eternal glaciers and glaciers.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
        title: 'Hadimba Wooden Pagoda Temple',
        caption: 'Historic 16th-century wooden temple tucked inside deep cedar woods.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        title: 'Mall Road Twilight & Peaks',
        caption: 'Vibrant local bazaar with steaming momos and illuminated snow crests.',
        suggestedSlot: 'evening',
      },
    ],
  },
  kerala: {
    name: 'Kerala',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
        title: 'Munnar Rolling Tea Estates',
        caption: 'Endless emerald carpet of manicured tea plantations shrouded in mist.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
        title: 'Alleppey Backwaters Houseboat',
        caption: 'Traditional kettuvallam cruise drifting through serene palm-lined canals.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        title: 'Fort Kochi Chinese Fishing Nets',
        caption: 'Iconic cantilevered fishing nets silhouetted against the sunset harbor.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        title: 'Varkala Cliff & Papanasam Beach',
        caption: 'Dramatic red laterite cliffs bordering the turquoise Arabian Sea.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Athirappilly Rainforest Waterfalls',
        caption: 'The Niagara of India plunging 80 feet into lush Chalakudy river basin.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        title: 'Kovalam Lighthouse Beach Twilight',
        caption: 'Striped red-and-white lighthouse guarding crescent beach waters.',
        suggestedSlot: 'evening',
      },
    ],
  },
  jaipur: {
    name: 'Jaipur & Udaipur',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        title: 'Hawa Mahal (Palace of Winds)',
        caption: 'Intricate 953 honeycombed pink sandstone jharokha windows in the morning light.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
        title: 'Lake Pichola & City Palace Udaipur',
        caption: 'Marble royal palaces reflecting over the calm waters of Lake Pichola.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
        title: 'Amber Fort Hilltop Courtyards',
        caption: 'Grand Rajput ramparts, Sheesh Mahal mirror mosaic, and valley vistas.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        title: 'Nahargarh Fort Sunset Over Pink City',
        caption: 'Panoramic twilight view across Jaipur illuminated rooftops from the fortress.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        title: 'Jal Mahal Water Palace',
        caption: 'Floating palace in the middle of Man Sagar Lake against the Aravalli hills.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1588096344356-9b51f0840428?auto=format&fit=crop&w=1200&q=80',
        title: 'Johari Bazaar & Traditional Haveli',
        caption: 'Bustling gemstone bazaars, colorful textiles, and heritage architecture.',
        suggestedSlot: 'afternoon',
      },
    ],
  },
  udaipur: {
    name: 'Udaipur',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
        title: 'Lake Pichola & Jag Mandir Island',
        caption: 'Marble island palace floating gracefully in the historic lake basin.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        title: 'Udaipur City Palace Courtyards',
        caption: 'Ornate peacock courtyards, stained glass galleries, and Mewar royal artifacts.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        title: 'Ambrai Ghat Lake Sunset',
        caption: 'Romantic illuminated lakefront dining looking over the City Palace lights.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
        title: 'Fateh Sagar Lake & Neemach Mata',
        caption: 'Scenic hillside lake promenade surrounded by lush green hills.',
        suggestedSlot: 'morning',
      },
    ],
  },
  ladakh: {
    name: 'Ladakh',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
        title: 'Pangong Tso Blue Lake',
        caption: 'Pristine high-altitude endorheic lake with changing shades of turquoise.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        title: 'Thiksey Monastery Perched on Hill',
        caption: 'Twelve-story whitewashed Tibetan Buddhist monastery resembling the Potala Palace.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Nubra Valley Sand Dunes & Camels',
        caption: 'Double-humped Bactrian camels roaming cold mountain desert sand dunes.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Khardung La Pass (17,982 ft)',
        caption: 'Snow-clad world-famous motorable pass with colorful prayer flags.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        title: 'Shanti Stupa Sunset Over Leh',
        caption: 'White-domed Buddhist stupa offering 360-degree views of Leh valley and peaks.',
        suggestedSlot: 'evening',
      },
    ],
  },
  kashmir: {
    name: 'Kashmir',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
        title: 'Dal Lake Shikara Boat & Water Lilies',
        caption: 'Floating gardens, vibrant flower shikaras, and wooden heritage houseboats.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
        title: 'Gulmarg Gondola & Apharwat Peak',
        caption: 'High-altitude cable car ascending through dense fir trees to snow slopes.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        title: 'Betaab Valley & Lidder River, Pahalgam',
        caption: 'Lush green meadows flanked by snow-capped mountains and crystal streams.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1596761405105-01e4054a8cf3?auto=format&fit=crop&w=1200&q=80',
        title: 'Nishat Bagh Mughal Terrace Garden',
        caption: 'Terraced Mughal royal fountains overlooking Dal Lake at golden hour.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Sonamarg Meadow of Gold',
        caption: 'Alpine valley gateway to Thajiwas Glacier with gushing mountain streams.',
        suggestedSlot: 'morning',
      },
    ],
  },
  andaman: {
    name: 'Andaman & Nicobar',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
        title: 'Radhanagar Beach White Sands',
        caption: 'Crystal-clear turquoise waves gently lapping soft powdery white sand.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        title: 'Havelock Island Coral Reef Scuba',
        caption: 'Vibrant coral reef gardens teeming with sea turtles and tropical fish.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        title: 'Elephant Beach Sea Karting Cove',
        caption: 'Shallow calm waters perfect for snorkeling, water sports, and beach treks.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        title: 'Neil Island Natural Rock Bridge',
        caption: 'Intriguing natural limestone bridge formation at low tide sunset.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        title: 'Cellular Jail Heritage & Light Show',
        caption: 'Historic national memorial in Port Blair with stirring evening light & sound recital.',
        suggestedSlot: 'evening',
      },
    ],
  },
  varanasi: {
    name: 'Varanasi',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        title: 'Ganga Sunrise Boat Ride & Assi Ghat',
        caption: 'Serene dawn light bathing ancient riverside ghats and morning bathers.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1588096344356-9b51f0840428?auto=format&fit=crop&w=1200&q=80',
        title: 'Dashashwamedh Ghat Grand Evening Aarti',
        caption: 'Spectacular synchronization of brass fire lamps, conch shells, and chants.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        title: 'Ancient Heritage Lanes & Kashi Vishwanath',
        caption: 'Centuries-old cobblestone alleyways filled with silk weavers and chai stalls.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        title: 'Sarnath Dhamek Stupa & Deer Park',
        caption: 'Historic Buddhist pilgrimage monument where Lord Buddha gave his first sermon.',
        suggestedSlot: 'morning',
      },
    ],
  },
  rishikesh: {
    name: 'Rishikesh',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600100397608-f010f444856f?auto=format&fit=crop&w=1200&q=80',
        title: 'Ganga White Water River Rafting',
        caption: 'Thrilling grade III & IV rapids between Shivpuri and Lakshman Jhula.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        title: 'Laxman Jhula & Riverside Ashrams',
        caption: 'Iconic suspension bridge spanning the emerald green sacred Ganga river.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        title: 'Triveni Ghat Evening Maha Aarti',
        caption: 'Floating leaf diyas and chanting at the sacred river confluence at dusk.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Neer Garh Waterfalls Hike',
        caption: 'Multi-tiered natural limestone waterfall pool nestled in Himalayan foothills.',
        suggestedSlot: 'morning',
      },
    ],
  },
  mumbai: {
    name: 'Mumbai',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
        title: 'Gateway of India & Taj Mahal Palace',
        caption: 'Historic basalt arch monument guarding Mumbai harbor in morning golden light.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1566552881560-0be86c53e56f?auto=format&fit=crop&w=1200&q=80',
        title: "Marine Drive (Queen's Necklace)",
        caption: 'Sweeping coastal promenade curving alongside the Arabian Sea at sunset.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
        title: 'Chhatrapati Shivaji Maharaj Terminus (CST)',
        caption: 'UNESCO Victorian Gothic revival architectural masterpiece.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        title: 'Bandra Bandstand & Sea Link',
        caption: 'Modern cable-stayed bridge spanning across Mahim Bay into the horizon.',
        suggestedSlot: 'morning',
      },
    ],
  },
  hampi: {
    name: 'Hampi',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600100397837-7756e18dbcfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Virupaksha Temple Gopuram',
        caption: 'Soaring 160-foot temple tower standing over boulder-strewn historic ruins.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        title: 'Vijaya Vittala Stone Chariot',
        caption: 'Iconic monolithic shrine crafted from granite with intricately carved wheels.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        title: 'Matanga Hill Sunset & Tungabhadra River',
        caption: 'Epic panoramic sunset vantage point over the ancient Vijayanagara empire ruins.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        title: 'Coracle Boat Ride across Tungabhadra',
        caption: 'Traditional circular reed boat journey navigating giant riverside boulders.',
        suggestedSlot: 'morning',
      },
    ],
  },
  meghalaya: {
    name: 'Meghalaya (Shillong & Cherrapunji)',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        title: 'Double Decker Living Root Bridge',
        caption: 'Bio-engineered centuries-old rubber fig tree roots bridging rainforest rivers.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Dawki Umngot Crystal Glass River',
        caption: 'Boats appearing to float in mid-air over transparent emerald waters.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1596761405105-01e4054a8cf3?auto=format&fit=crop&w=1200&q=80',
        title: 'Nohkalikai Falls (1,115 ft Plunge)',
        caption: 'India’s tallest plunge waterfall cascading into a luminous turquoise pool.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Laitlum Canyons Misty Edge',
        caption: 'Endless rolling green ravines opening up into deep valley gorges.',
        suggestedSlot: 'evening',
      },
    ],
  },
  ooty: {
    name: 'Ooty & Coonoor',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
        title: 'Nilgiri Mountain Toy Train',
        caption: 'Historic steam locomotive winding through Nilgiri tea hills and tunnels.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
        title: 'Doddabetta Peak & Tea Gardens',
        caption: 'Highest point in the Nilgiris (8,652 ft) overlooking misty tea valleys.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Pykara Lake & Waterfalls',
        caption: 'Pristine mountain reservoir surrounded by shola forests and boathouses.',
        suggestedSlot: 'evening',
      },
    ],
  },
  paris: {
    name: 'Paris',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        title: 'Eiffel Tower & Champ de Mars',
        caption: 'Iconic wrought-iron lattice monument rising majestically above Paris.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
        title: 'Louvre Glass Pyramid Courtyard',
        caption: 'Grand Renaissance palace courtyards blended with modern glass architecture.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80',
        title: 'Montmartre & Sacré-Cœur Basilique',
        caption: 'Hilltop white dome basilica commanding panoramic views across Parisian rooftops.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        title: 'Seine River Twilight Bridges',
        caption: 'Romantic illuminated stone footbridges and passing river cruises.',
        suggestedSlot: 'evening',
      },
    ],
  },
  bali: {
    name: 'Bali',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        title: 'Tegalalang Emerald Rice Terraces',
        caption: 'Lush stepped valley rice fields illuminated by early morning tropical sun.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
        title: 'Uluwatu Sea Temple & Cliffs',
        caption: 'Dramatic 230-foot limestone cliffs dropping into turquoise Indian Ocean swells.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        title: 'Nusa Penida Kelingking T-Rex Beach',
        caption: 'Iconic coastal rock formation resembling a T-Rex overlooking pristine blue surf.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        title: 'Jimbaran Bay Candlelit Seafood Sunset',
        caption: 'Beachside dining under starry tropical skies with waves at your feet.',
        suggestedSlot: 'evening',
      },
    ],
  },
  tokyo: {
    name: 'Tokyo',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        title: 'Senso-ji Temple & Asakusa Lantern',
        caption: 'Tokyo’s oldest Buddhist temple adorned with giant red paper chochin lanterns.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
        title: 'Shibuya Scramble Crossing Neon Lights',
        caption: 'World-famous buzzing intersection surrounded by vibrant digital billboards.',
        suggestedSlot: 'evening',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Shinjuku Gyoen Japanese Garden',
        caption: 'Traditional teahouse pavilions nestled alongside tranquil cherry blossom ponds.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Mount Fuji Vista from Tokyo High-Rise',
        caption: 'Snow-capped symmetrical volcanic cone visible on clear skyline mornings.',
        suggestedSlot: 'morning',
      },
    ],
  },
  dubai: {
    name: 'Dubai',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        title: 'Burj Khalifa & Downtown Skyline',
        caption: 'World’s tallest architectural marvel towering 828 meters over blue lagoons.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        title: 'Arabian Desert Safari & Dunes',
        caption: 'Golden undulating sand dunes during 4x4 dune bashing and camel treks.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
        title: 'Dubai Marina & JBR Promenade Twilight',
        caption: 'Illuminated luxury yachts and waterfront high-rises under evening glow.',
        suggestedSlot: 'evening',
      },
    ],
  },
  zermatt: {
    name: 'Swiss Alps (Zermatt & Lucerne)',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
        title: 'Matterhorn Pyramid Peak',
        caption: 'Legendary jagged alpine summit reflecting over Riffelsee mirror lake.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        title: 'Glacier Express Alpine Railway',
        caption: 'Panoramic red train traversing dramatic mountain viaducts and gorges.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        title: 'Lake Lucerne & Chapel Bridge',
        caption: 'Historic covered wooden footbridge adorned with floral boxes.',
        suggestedSlot: 'evening',
      },
    ],
  },
  thailand: {
    name: 'Thailand (Phuket & Bangkok)',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
        title: 'Phi Phi Islands Limestone Cliffs',
        caption: 'Towering karst cliffs rising from emerald turquoise tropical waters.',
        suggestedSlot: 'morning',
      },
      {
        url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
        title: 'Grand Palace & Wat Arun Bangkok',
        caption: 'Gleaming golden stupas and porcelain mosaic spires on Chao Phraya river.',
        suggestedSlot: 'afternoon',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        title: 'Patong Beach Sunset & Lanterns',
        caption: 'Warm Andaman sea breeze with seaside markets and dining.',
        suggestedSlot: 'evening',
      },
    ],
  },
};

// Generic thematic fallback libraries for any destination
const THEMATIC_FALLBACK_PHOTOS: Record<string, { url: string; title: string; caption: string }[]> = {
  beach: [
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      title: 'Tropical Coastal Beach & Shore',
      caption: 'Sun-drenched sandy beach with gentle turquoise ocean waves.',
    },
    {
      url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      title: 'Palm-Fringed Bay & Lagoon',
      caption: 'Coconut palm groves overlooking warm coastal waters.',
    },
    {
      url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
      title: 'Island Reef & Water Sports',
      caption: 'Pristine island shoreline perfect for diving, boat rides, and snorkeling.',
    },
    {
      url: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1200&q=80',
      title: 'Golden Sunset Coastline',
      caption: 'Spectacular sunset horizon over warm ocean waters.',
    },
  ],
  mountains: [
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      title: 'Majestic Mountain Ridge',
      caption: 'Panoramic alpine peaks under crisp blue morning skies.',
    },
    {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      title: 'Snow-Capped Himalayan Vista',
      caption: 'Dramatic glaciers and alpine valleys bathed in golden sun.',
    },
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      title: 'Pine Valley & Mountain Stream',
      caption: 'Lush evergreen forests and gushing crystalline streams.',
    },
    {
      url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      title: 'Alpine Meadow & Cloud Inversion',
      caption: 'Misty mountain valleys with sweeping scenic hiking trails.',
    },
  ],
  heritage: [
    {
      url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      title: 'Royal Palace & Ancient Courtyards',
      caption: 'Intricate historical stonework, arches, and grand monuments.',
    },
    {
      url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      title: 'Historic Monument & Gardens',
      caption: 'World-renowned architectural heritage framed by symmetry and fountains.',
    },
    {
      url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      title: 'Ancient Fortress Ramparts',
      caption: 'Centuries-old stone bastion offering strategic views of the historic landscape.',
    },
    {
      url: 'https://images.unsplash.com/photo-1588096344356-9b51f0840428?auto=format&fit=crop&w=1200&q=80',
      title: 'Old Town Heritage Streets',
      caption: 'Vibrant cultural avenues and artisanal handicraft markets.',
    },
  ],
  general: [
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      title: 'Scenic Travel Road & Horizon',
      caption: 'Open exploration roads winding through picturesque natural landscapes.',
    },
    {
      url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
      title: 'Lakeside & Mountain Vista',
      caption: 'Calm reflective water bodies framed by rugged hills.',
    },
    {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      title: 'Sunny Scenic Shore',
      caption: 'Bright clear skies and tranquil natural highlights.',
    },
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      title: 'Lush Forest & Waterfalls',
      caption: 'Refreshing nature retreat with roaring waterfalls.',
    },
    {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      title: 'Twilight City & Mountain Glow',
      caption: 'Magical golden hour colors stretching across the horizon.',
    },
  ],
};

// Helper to find matching destination key
function getDestinationKey(destinationName: string): string | null {
  const norm = (destinationName || '').toLowerCase().trim();
  for (const key of Object.keys(DESTINATION_DAY_PHOTOS)) {
    if (norm.includes(key)) {
      return key;
    }
  }
  return null;
}

/**
 * Returns distinct photos for a specific day in the itinerary (Hero, Morning, Afternoon, Evening)
 */
export function getDayPhotoGallery(
  destinationName: string,
  dayNumber: number,
  dayTheme?: string
): DayPhotoGallery {
  const key = getDestinationKey(destinationName);
  const destNameFormatted = destinationName ? destinationName.trim() : 'Scenic Destination';

  let photoPool: { url: string; title: string; caption: string; suggestedSlot?: string }[] = [];

  if (key && DESTINATION_DAY_PHOTOS[key]) {
    photoPool = DESTINATION_DAY_PHOTOS[key].photos;
  } else {
    // Check destination category in ALL_AVAILABLE_DESTINATIONS
    const matched = ALL_AVAILABLE_DESTINATIONS.find((d) =>
      (destinationName || '').toLowerCase().includes(d.name.toLowerCase()) ||
      (destinationName || '').toLowerCase().includes(d.id)
    );

    if (matched) {
      if (matched.category === 'Beach') {
        photoPool = THEMATIC_FALLBACK_PHOTOS.beach;
      } else if (matched.category === 'Hill Station' || matched.category === 'Adventure') {
        photoPool = THEMATIC_FALLBACK_PHOTOS.mountains;
      } else if (matched.category === 'Heritage & Culture' || matched.category === 'Spiritual') {
        photoPool = THEMATIC_FALLBACK_PHOTOS.heritage;
      } else {
        photoPool = THEMATIC_FALLBACK_PHOTOS.general;
      }
    } else {
      photoPool = THEMATIC_FALLBACK_PHOTOS.general;
    }
  }

  // Ensure high diversity across days: shift index based on dayNumber so Day 1, Day 2, Day 3 get distinct sets of pictures
  const poolLen = photoPool.length;
  const baseIdx = ((dayNumber - 1) * 3) % poolLen;

  const heroItem = photoPool[(baseIdx) % poolLen];
  const morningItem = photoPool[(baseIdx + 1) % poolLen];
  const afternoonItem = photoPool[(baseIdx + 2) % poolLen];
  const eveningItem = photoPool[(baseIdx + 3) % poolLen];

  const hero: ScenicPhotoInfo = {
    url: heroItem.url,
    title: heroItem.title || `${destNameFormatted} Day ${dayNumber} Highlights`,
    caption: heroItem.caption || `Iconic scenic panorama during Day ${dayNumber} of travel.`,
    slot: 'highlight',
  };

  const morning: ScenicPhotoInfo = {
    url: morningItem.url,
    title: morningItem.title || `Morning at ${destNameFormatted}`,
    caption: morningItem.caption || `Serene morning exploration and early landmark visit.`,
    slot: 'morning',
  };

  const afternoon: ScenicPhotoInfo = {
    url: afternoonItem.url,
    title: afternoonItem.title || `Afternoon in ${destNameFormatted}`,
    caption: afternoonItem.caption || `Afternoon sightseeing, cultural immersion, and local dining.`,
    slot: 'afternoon',
  };

  const evening: ScenicPhotoInfo = {
    url: eveningItem.url,
    title: eveningItem.title || `Evening Sunset in ${destNameFormatted}`,
    caption: eveningItem.caption || `Twilight atmosphere, sunset viewpoints, and night experiences.`,
    slot: 'evening',
  };

  return {
    hero,
    morning,
    afternoon,
    evening,
    all: [hero, morning, afternoon, evening],
  };
}

/**
 * Returns single hero scenic photo for a specific day
 */
export function getDayScenicPhoto(
  destinationName: string,
  dayNumber: number,
  activityName?: string
): ScenicPhotoInfo {
  const gallery = getDayPhotoGallery(destinationName, dayNumber, activityName);
  return gallery.hero;
}

/**
 * Returns slot specific photo (morning / afternoon / evening) for a day
 */
export function getDaySlotPhoto(
  destinationName: string,
  dayNumber: number,
  slot: 'morning' | 'afternoon' | 'evening',
  placeName?: string
): ScenicPhotoInfo {
  const gallery = getDayPhotoGallery(destinationName, dayNumber);
  const photo = gallery[slot];
  if (placeName && placeName.trim()) {
    return {
      ...photo,
      title: placeName,
    };
  }
  return photo;
}
