export type PopularDestination = {
  slug: string
  name: string
  tamilName: string
  icon: string
  excerpt: string
  /** Hero / card image (Unsplash or other HTTPS URL). */
  image: string
  imageAlt: string
}

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    slug: 'ooty',
    name: 'Ooty',
    tamilName: 'ஊட்டி',
    icon: '🏔️',
    excerpt:
      'Experience the beauty of the Nilgiri hills with pleasant weather, tea plantations, lakes, and scenic mountain roads. Perfect for family trips and honeymoon travel.',
    image:
      'https://images.unsplash.com/photo-1622279452202-5b847faf7033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Nilgiri hills and tea plantations near Ooty',
  },
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    tamilName: 'கோடைக்கானல்',
    icon: '🌲',
    excerpt:
      'Discover the Princess of Hill Stations with misty valleys, pine forests, waterfalls, and peaceful lakes. Ideal for weekend getaways and nature lovers.',
    image:
      'https://images.unsplash.com/photo-1501785888031-bb785b93739c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Misty hills and lake scenery typical of Kodaikanal',
  },
  {
    slug: 'kanyakumari',
    name: 'Kanyakumari',
    tamilName: 'கன்னியாகுமரி',
    icon: '🌊',
    excerpt:
      'Visit the southern tip of India where three seas meet. Enjoy sunrise views, Vivekananda Rock Memorial, beaches, and cultural landmarks.',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Coastal view at Kanyakumari',
  },
  {
    slug: 'madurai',
    name: 'Madurai',
    tamilName: 'மதுரை',
    icon: '🛕',
    excerpt:
      'Explore the ancient city famous for the Meenakshi Amman Temple, vibrant streets, traditional food, and rich Tamil heritage.',
    image:
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Madurai temple architecture',
  },
  {
    slug: 'rameswaram',
    name: 'Rameswaram',
    tamilName: 'ராமேஸ்வரம்',
    icon: '🌉',
    excerpt:
      'A spiritual and coastal destination known for Ramanathaswamy Temple, Pamban Bridge, Dhanushkodi, and serene beaches.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Coastal shoreline and travel scenery',
  },
  {
    slug: 'yercaud',
    name: 'Yercaud',
    tamilName: 'ஏற்காடு',
    icon: '🌿',
    excerpt:
      'Enjoy peaceful hill station vibes surrounded by coffee plantations, gardens, viewpoints, and cool climate in the Shevaroy Hills.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Forest road and green hills',
  },
  {
    slug: 'coimbatore',
    name: 'Coimbatore',
    tamilName: 'கோயம்புத்தூர்',
    icon: '🐘',
    excerpt:
      'A vibrant city near famous tourist attractions like Isha Yoga Center, Adiyogi statue, waterfalls, and hill station routes.',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Peaceful nature and travel backdrop',
  },
  {
    slug: 'mudumalai',
    name: 'Mudumalai',
    tamilName: 'முதுமலை',
    icon: '🐅',
    excerpt:
      'Adventure through wildlife forests and safari experiences with chances to spot elephants, deer, peacocks, and exotic birds.',
    image:
      'https://images.unsplash.com/photo-1564760055776-f84d0bbe3b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Elephant in natural forest habitat',
  },
  {
    slug: 'velankanni',
    name: 'Velankanni',
    tamilName: 'வேளாங்கண்ணி',
    icon: '⛪',
    excerpt:
      "One of India's most visited pilgrimage destinations, known for the Basilica of Our Lady of Good Health and peaceful coastal atmosphere.",
    image:
      'https://images.unsplash.com/photo-1510593223784-781348a95359?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Historic church facade',
  },
  {
    slug: 'valparai',
    name: 'Valparai',
    tamilName: 'வால்பாறை',
    icon: '🌄',
    excerpt:
      'A hidden gem filled with tea estates, winding roads, waterfalls, and breathtaking Western Ghats landscapes.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Mountain peaks and dramatic sky',
  },
]

export function getDestinationBySlug(slug: string | undefined): PopularDestination | undefined {
  if (!slug) return undefined
  return POPULAR_DESTINATIONS.find(d => d.slug === slug)
}
