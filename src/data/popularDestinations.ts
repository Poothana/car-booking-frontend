export type PopularDestination = {
  slug: string
  name: string
  tamilName: string
  icon: string
  excerpt: string
  /** Local /public path or HTTPS URL — must match the destination visually. */
  image: string
  imageAlt: string
}

/**
 * Destination card images live in /public/destinations/ (subject-matched photos).
 * Do not use random Unsplash “travel” stock — it previously mapped Madurai to a
 * foreign skyline and Valparai to alpine snow peaks.
 */
export const POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    slug: 'ooty',
    name: 'Ooty',
    tamilName: 'ஊட்டி',
    icon: '🏔️',
    excerpt:
      'Experience the beauty of the Nilgiri hills with pleasant weather, tea plantations, lakes, and scenic mountain roads. Perfect for family trips and honeymoon travel.',
    image: '/destinations/ooty.webp',
    imageAlt: 'Ooty lake with boats and forested Nilgiri hills',
  },
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    tamilName: 'கோடைக்கானல்',
    icon: '🌲',
    excerpt:
      'Discover the Princess of Hill Stations with misty valleys, pine forests, waterfalls, and peaceful lakes. Ideal for weekend getaways and nature lovers.',
    image: '/destinations/kodaikanal.webp',
    imageAlt: 'Kodaikanal lake surrounded by green hills',
  },
  {
    slug: 'kanyakumari',
    name: 'Kanyakumari',
    tamilName: 'கன்னியாகுமரி',
    icon: '🌊',
    excerpt:
      'Visit the southern tip of India where three seas meet. Enjoy sunrise views, Vivekananda Rock Memorial, beaches, and cultural landmarks.',
    image: '/destinations/kanyakumari.webp',
    imageAlt: 'Vivekananda Rock Memorial at Kanyakumari',
  },
  {
    slug: 'madurai',
    name: 'Madurai',
    tamilName: 'மதுரை',
    icon: '🛕',
    excerpt:
      'Madurai tourism highlights include Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, and classic Tamil street food. Book local sightseeing and multi-day packages with Mathi Cabs.',
    image: '/destinations/madurai.webp',
    imageAlt: 'Meenakshi Amman Temple gopurams in Madurai',
  },
  {
    slug: 'rameswaram',
    name: 'Rameswaram',
    tamilName: 'ராமேஸ்வரம்',
    icon: '🌉',
    excerpt:
      'A spiritual and coastal destination known for Ramanathaswamy Temple, Pamban Bridge, Dhanushkodi, and serene beaches.',
    image: '/destinations/rameswaram.webp',
    imageAlt: 'Pamban Bridge connecting Rameswaram to the mainland',
  },
  {
    slug: 'yercaud',
    name: 'Yercaud',
    tamilName: 'ஏற்காடு',
    icon: '🌿',
    excerpt:
      'Enjoy peaceful hill station vibes surrounded by coffee plantations, gardens, viewpoints, and cool climate in the Shevaroy Hills.',
    image: '/destinations/yercaud.webp',
    imageAlt: 'Scenic view of Yercaud hill station',
  },
  {
    slug: 'coimbatore',
    name: 'Coimbatore',
    tamilName: 'கோயம்புத்தூர்',
    icon: '🐘',
    excerpt:
      'A vibrant city near famous tourist attractions like Isha Yoga Center, Adiyogi statue, waterfalls, and hill station routes.',
    image: '/destinations/coimbatore.webp',
    imageAlt: 'Adiyogi Shiva statue near Coimbatore',
  },
  {
    slug: 'mudumalai',
    name: 'Mudumalai',
    tamilName: 'முதுமலை',
    icon: '🐅',
    excerpt:
      'Adventure through wildlife forests and safari experiences with chances to spot elephants, deer, peacocks, and exotic birds.',
    image: '/destinations/mudumalai.webp',
    imageAlt: 'Wildlife habitat in Mudumalai National Park region',
  },
  {
    slug: 'velankanni',
    name: 'Velankanni',
    tamilName: 'வேளாங்கண்ணி',
    icon: '⛪',
    excerpt:
      "One of India's most visited pilgrimage destinations, known for the Basilica of Our Lady of Good Health and peaceful coastal atmosphere.",
    image: '/destinations/velankanni.webp',
    imageAlt: 'Basilica of Our Lady of Good Health at Velankanni',
  },
  {
    slug: 'valparai',
    name: 'Valparai',
    tamilName: 'வால்பாறை',
    icon: '🌄',
    excerpt:
      'A hidden gem filled with tea estates, winding roads, waterfalls, and breathtaking Western Ghats landscapes.',
    image: '/destinations/valparai.webp',
    imageAlt: 'Tea plantation hills typical of Valparai and the Western Ghats',
  },
]

export function getDestinationBySlug(slug: string | undefined): PopularDestination | undefined {
  if (!slug) return undefined
  return POPULAR_DESTINATIONS.find((d) => d.slug === slug)
}
