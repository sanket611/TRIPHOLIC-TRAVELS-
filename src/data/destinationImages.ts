// Helper that returns scenic destination pictures for any place or day in the itinerary
import { ALL_AVAILABLE_DESTINATIONS } from './destinations';

const DEFAULT_SCENIC_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
];

const DESTINATION_SPECIFIC_GALLERY: { [key: string]: string[] } = {
  goa: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  ],
  manali: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596761405105-01e4054a8cf3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
  ],
  kerala: [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  ],
  jaipur: [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
  ],
  udaipur: [
    'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  ],
  ladakh: [
    'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  ],
  kashmir: [
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
  ],
  andaman: [
    'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  ],
  varanasi: [
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
  ],
  rishikesh: [
    'https://images.unsplash.com/photo-1600100397608-f010f444856f?auto=format&fit=crop&w=800&q=80',
  ],
  paris: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
  ],
  bali: [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
  ],
  tokyo: [
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  ],
  zermatt: [
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
  ],
};

export interface ScenicPhotoInfo {
  url: string;
  title: string;
  caption: string;
}

export function getDayScenicPhoto(destinationName: string, dayNumber: number, activityName?: string): ScenicPhotoInfo {
  const norm = (destinationName || '').toLowerCase().trim();
  let photoUrl = DEFAULT_SCENIC_PHOTOS[(dayNumber - 1) % DEFAULT_SCENIC_PHOTOS.length];
  let placeName = destinationName || 'Scenic Location';

  for (const [key, photos] of Object.entries(DESTINATION_SPECIFIC_GALLERY)) {
    if (norm.includes(key)) {
      const idx = (dayNumber - 1) % photos.length;
      photoUrl = photos[idx] || photos[0];
      placeName = destinationName.charAt(0).toUpperCase() + destinationName.slice(1);
      break;
    }
  }

  // Check matching destination in ALL_AVAILABLE_DESTINATIONS
  const matched = ALL_AVAILABLE_DESTINATIONS.find((d) =>
    norm.includes(d.name.toLowerCase()) || norm.includes(d.id)
  );

  if (matched) {
    placeName = matched.name;
    if (matched.secondaryImages && matched.secondaryImages.length > 0) {
      const allImgs = [matched.image, ...matched.secondaryImages];
      photoUrl = allImgs[(dayNumber - 1) % allImgs.length];
    } else {
      photoUrl = matched.image;
    }
  }

  const title = activityName ? `${placeName} — ${activityName}` : `${placeName} Highlights`;
  const caption = `Explore picturesque scenic vantage points and iconic local attractions across ${placeName} during Day ${dayNumber}.`;

  return {
    url: photoUrl,
    title,
    caption,
  };
}
