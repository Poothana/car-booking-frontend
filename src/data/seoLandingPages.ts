import type { FaqItem } from '../components/SeoHead'

export type SeoLandingPage = {
  slug: string
  title: string
  description: string
  keywords: string
  h1: string
  tamilSubtitle: string
  intro: string[]
  sections: { heading: string; paragraphs: string[] }[]
  highlights: string[]
  faqs: FaqItem[]
  relatedSlugs: string[]
}

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: 'madurai-tours-and-travels',
    title: 'Madurai Tours and Travels | Mathi Cabs — #1 Travel Agency',
    description:
      'Mathi Cabs is a trusted Madurai tours and travels company offering local sightseeing, outstation trips, pilgrimage tours & Tamil Nadu packages. Book 24/7.',
    keywords:
      'madurai tours and travels, tours and travels madurai, madurai travel agency, tamil nadu tour packages, mathi cabs',
    h1: 'Madurai Tours and Travels — Your Trusted Travel Partner',
    tamilSubtitle: 'மதுரை சுற்றுலா மற்றும் பயண சேவை',
    intro: [
      'Looking for the best Madurai tours and travels company? Mathi Cabs has been serving travellers across Tamil Nadu with reliable cabs, experienced drivers, and transparent pricing. Whether you need a one-day Madurai city tour, a family trip to hill stations, or a pilgrimage to Rameswaram, we handle every detail so you can travel stress-free.',
      'Our fleet includes sedans, SUVs, MUVs, and tempo travellers suited for solo travellers, families, and group tours. Every vehicle is well-maintained, fully insured, and driven by professional chauffeurs who know Madurai roads and Tamil Nadu routes inside out.',
    ],
    sections: [
      {
        heading: 'Why Choose Mathi Cabs for Tours and Travels in Madurai?',
        paragraphs: [
          'Madurai is the cultural heart of Tamil Nadu, and the gateway to iconic destinations like Rameswaram, Kodaikanal, Ooty, and Kanyakumari. A local tours and travels partner makes all the difference — you get accurate fare estimates, flexible itineraries, and drivers who understand temple timings, hill road conditions, and seasonal travel patterns.',
          'We offer both packaged tours and fully custom itineraries. Tell us your dates, group size, and destinations — we will recommend the right vehicle and route plan. No hidden charges: toll, parking, and hill station fees are explained upfront before you confirm.',
        ],
      },
      {
        heading: 'Our Tour Services from Madurai',
        paragraphs: [
          'Local sightseeing covering Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Museum, and Alagar Kovil. Outstation one-way and round-trip cabs to all major Tamil Nadu cities. Multi-day tour packages for families and corporate groups. Wedding and event transportation with decorated vehicles on request.',
        ],
      },
    ],
    highlights: [
      '24/7 booking and customer support',
      'Transparent tariff — no hidden costs',
      'Professional, verified drivers',
      'Sedan to tempo traveller fleet',
      'Local & outstation packages',
    ],
    faqs: [
      {
        question: 'Which is the best tours and travels company in Madurai?',
        answer:
          'Mathi Cabs is among the most trusted Madurai tours and travels providers, offering local sightseeing, outstation cabs, and Tamil Nadu tour packages with transparent pricing and 24/7 support.',
      },
      {
        question: 'Do you offer custom tour packages from Madurai?',
        answer:
          'Yes. We create fully custom itineraries based on your dates, destinations, and budget. Contact us via phone or the enquiry form for a personalised quote.',
      },
      {
        question: 'What types of vehicles are available for group tours?',
        answer:
          'We offer sedans (4 seats), SUVs/MUVs (6–7 seats), and tempo travellers (12–14 seats) for group tours from Madurai.',
      },
    ],
    relatedSlugs: ['madurai-cabs', 'madurai-local-sightseeing', 'outstation-cabs-from-madurai'],
  },
  {
    slug: 'madurai-cabs',
    title: 'Madurai Cabs | Book Taxi Online 24/7 | Mathi Cabs',
    description:
      'Book Madurai cabs online with Mathi Cabs. Affordable taxi service for local trips, outstation travel & airport transfers. Instant booking, professional drivers.',
    keywords: 'madurai cabs, madurai cab booking, cab service madurai, taxi madurai, mathi cabs madurai',
    h1: 'Madurai Cabs — Book Online 24/7',
    tamilSubtitle: 'மதுரை கேப் சேவை — ஆன்லைன் பooking',
    intro: [
      'Need a cab in Madurai? Mathi Cabs provides reliable Madurai cab service for every occasion — daily commutes, shopping trips, hospital visits, outstation journeys, and airport pickups. Book online in minutes or call us anytime for instant cab allocation.',
      'Our Madurai cabs come with experienced local drivers, GPS-enabled vehicles, and clear per-km or per-day pricing. Choose from economy sedans to spacious SUVs depending on your group size and luggage needs.',
    ],
    sections: [
      {
        heading: 'Madurai Cab Services We Offer',
        paragraphs: [
          'Point-to-point local cab rides anywhere in Madurai city and suburbs. Hourly rental packages for business meetings and shopping. Outstation cabs to Rameswaram, Kodaikanal, Ooty, Chennai, and all Tamil Nadu cities. Round-trip and one-way drop options available.',
        ],
      },
      {
        heading: 'How to Book Madurai Cabs',
        paragraphs: [
          'Visit our booking page, enter pickup and drop locations with travel dates, and select your preferred vehicle. You can also call our support line or submit an enquiry for custom routes. We confirm your booking with driver details and estimated fare before the trip starts.',
        ],
      },
    ],
    highlights: [
      'Instant online cab booking',
      'Sedan, SUV & traveller options',
      'One-way & round-trip cabs',
      'No surge pricing',
      'GPS-tracked vehicles',
    ],
    faqs: [
      {
        question: 'How much does a cab cost in Madurai?',
        answer:
          'Madurai cab fares depend on vehicle type, distance, and trip duration. Local packages start from affordable daily rates; outstation trips are charged per km above 250 km. Check our fleet page or enquire for exact pricing.',
      },
      {
        question: 'Can I book a Madurai cab for one-way outstation travel?',
        answer:
          'Yes. We offer one-way drops to all major cities in Tamil Nadu and neighbouring states. One-way fares are calculated based on distance and vehicle type.',
      },
      {
        question: 'Are Madurai cabs available at night?',
        answer:
          'Yes, Mathi Cabs operates 24/7. Night bookings are accepted with the same transparent pricing structure.',
      },
    ],
    relatedSlugs: ['madurai-taxi-service', 'madurai-car-rental', 'madurai-airport-taxi'],
  },
  {
    slug: 'madurai-taxi-service',
    title: 'Madurai Taxi Service | 24/7 Call Taxi | Mathi Cabs',
    description:
      'Reliable Madurai taxi service available 24/7. Call taxi for local rides, outstation trips & airport transfer. Professional drivers, fair rates. Mathi Cabs.',
    keywords: 'madurai taxi service, madurai call taxi, taxi in madurai, madurai taxi booking',
    h1: 'Madurai Taxi Service — Available 24 Hours',
    tamilSubtitle: 'மதுரை டாக்ஸி சேவை — 24 மணி நேரம்',
    intro: [
      'Mathi Cabs is your go-to Madurai taxi service for safe, comfortable, and affordable travel. Our call taxi service covers the entire Madurai district and beyond — from early-morning airport drops to late-night returns from outstation trips.',
      'Every taxi in our fleet is regularly serviced, air-conditioned, and driven by courteous professionals who prioritise your safety and punctuality.',
    ],
    sections: [
      {
        heading: 'Types of Taxi Services in Madurai',
        paragraphs: [
          'City taxi for local errands, office commutes, and hospital visits. Outstation taxi for inter-city travel with experienced highway drivers. Package taxi for full-day local hire with flexible stopovers. Corporate taxi accounts for businesses with monthly billing.',
        ],
      },
    ],
    highlights: [
      '24/7 call taxi availability',
      'AC & non-AC options',
      'Experienced highway drivers',
      'Corporate billing available',
      'Transparent meter-based pricing',
    ],
    faqs: [
      {
        question: 'How do I call a taxi in Madurai?',
        answer:
          'Call Mathi Cabs directly or use our online booking form. Provide your pickup location and destination — we assign the nearest available taxi within minutes.',
      },
      {
        question: 'Is your Madurai taxi service available on holidays?',
        answer:
          'Yes, we operate every day including weekends and public holidays with the same service quality and pricing.',
      },
    ],
    relatedSlugs: ['madurai-cabs', 'madurai-airport-taxi', 'madurai-local-sightseeing'],
  },
  {
    slug: 'madurai-airport-taxi',
    title: 'Madurai Airport Taxi | IXM Pickup & Drop | Mathi Cabs',
    description:
      'Book Madurai airport taxi for IXM pickup and drop. Fixed fares, flight tracking, 24/7 service. Mathi Cabs — reliable airport transfer in Madurai.',
    keywords: 'madurai airport taxi, madurai airport cab, IXM taxi, madurai airport transfer',
    h1: 'Madurai Airport Taxi — IXM Pickup & Drop Service',
    tamilSubtitle: 'மதுரை விமான நிலைய டாக்ஸி சேவை',
    intro: [
      'Travelling through Madurai International Airport (IXM)? Mathi Cabs provides dependable Madurai airport taxi service with punctual pickups, flight tracking, and fixed-route pricing. Whether you are arriving or departing, our driver will be waiting with a name board at the terminal.',
      'We serve all areas of Madurai city and suburbs including Mattuthavani, Anna Nagar, K.K. Nagar, Vilangudi, and Tirumangalam. Outstation airport connections to nearby cities are also available.',
    ],
    sections: [
      {
        heading: 'Madurai Airport Transfer Options',
        paragraphs: [
          'Sedan airport taxi for 1–3 passengers with standard luggage. SUV/MUV for families with extra baggage. Tempo traveller for group airport transfers. Pre-scheduled pickup based on your flight arrival time with free waiting up to 30 minutes.',
        ],
      },
    ],
    highlights: [
      'IXM airport pickup & drop',
      'Flight tracking & waiting time',
      'Fixed fare quotes available',
      'Meet & greet at terminal',
      '24/7 airport taxi service',
    ],
    faqs: [
      {
        question: 'How far is Madurai airport from the city centre?',
        answer:
          'Madurai International Airport (IXM) is approximately 12 km from the city centre. The drive takes 25–35 minutes depending on traffic.',
      },
      {
        question: 'Can I pre-book an airport taxi in Madurai?',
        answer:
          'Yes. We recommend pre-booking your Madurai airport taxi at least 2 hours in advance. Share your flight number for automatic delay tracking.',
      },
    ],
    relatedSlugs: ['madurai-cabs', 'madurai-taxi-service', 'madurai-local-sightseeing'],
  },
  {
    slug: 'madurai-car-rental',
    title: 'Madurai Car Rental | Chauffeur-Driven Cars | Mathi Cabs',
    description:
      'Affordable Madurai car rental with driver. Daily, weekly & outstation packages. Sedan, SUV, MUV & traveller. Book with Mathi Cabs today.',
    keywords: 'madurai car rental, car hire madurai, rent a car madurai, madurai car booking',
    h1: 'Madurai Car Rental — Chauffeur-Driven Fleet',
    tamilSubtitle: 'மதுரை கார் வாடகை சேவை',
    intro: [
      'Mathi Cabs offers flexible Madurai car rental with professional chauffeurs — the safest and most convenient way to explore the city and Tamil Nadu. Choose daily local packages or multi-day outstation rentals with transparent per-day and per-km rates.',
      'All rental cars are insured, regularly maintained, and equipped with AC. Our drivers handle navigation, parking, and route planning so you can focus on your trip.',
    ],
    sections: [
      {
        heading: 'Car Rental Packages in Madurai',
        paragraphs: [
          'Local daily rental: 8 hours / 80 km packages for city use. Outstation rental: per-day rate plus km charges above package limit. Multi-day rental: discounted rates for 3+ day trips. Event rental: wedding cars and decorated vehicles on request.',
        ],
      },
    ],
    highlights: [
      'Chauffeur-driven rental only',
      'Daily & multi-day packages',
      'Sedan to tempo traveller',
      'Fully insured vehicles',
      'Flexible itinerary',
    ],
    faqs: [
      {
        question: 'Do you offer self-drive car rental in Madurai?',
        answer:
          'Currently Mathi Cabs provides chauffeur-driven car rental only, ensuring safety and local route expertise for all customers.',
      },
      {
        question: 'What documents are needed for car rental?',
        answer:
          'For chauffeur-driven rental, no special documents are needed. Provide your contact details and trip itinerary at booking. ID proof may be requested for outstation trips.',
      },
    ],
    relatedSlugs: ['madurai-cabs', 'outstation-cabs-from-madurai', 'madurai-tours-and-travels'],
  },
  {
    slug: 'madurai-to-rameswaram-taxi',
    title: 'Madurai to Rameswaram Taxi | Cab Fare & Booking | Mathi Cabs',
    description:
      'Book Madurai to Rameswaram taxi at best rates. ~170 km, 3.5 hrs. One-way & round-trip cabs. Pilgrimage tours with Mathi Cabs.',
    keywords: 'madurai to rameswaram taxi, madurai to rameswaram cab, rameswaram tour from madurai',
    h1: 'Madurai to Rameswaram Taxi — Pilgrimage Cab Service',
    tamilSubtitle: 'மதுரை – ராமேஸ்வaram டாக்ஸி',
    intro: [
      'Planning a pilgrimage to Rameswaram? Mathi Cabs offers comfortable Madurai to Rameswaram taxi service covering the ~170 km journey in about 3.5 hours. Visit the Ramanathaswamy Temple, Pamban Bridge, Dhanushkodi, and Agni Theertham with a driver who knows the route and temple timings.',
      'Choose one-way drop, same-day return, or overnight round-trip packages. We offer sedans for couples, SUVs for families, and tempo travellers for group pilgrimages.',
    ],
    sections: [
      {
        heading: 'Madurai to Rameswaram Route & Travel Tips',
        paragraphs: [
          'The route passes through Ramanathapuram with good highway conditions. Start early morning to reach Rameswaram for temple darshan by 8 AM. Dhanushkodi day trip can be added to your itinerary. Pamban Bridge offers scenic views — ask your driver for a brief photo stop.',
        ],
      },
    ],
    highlights: [
      '~170 km, approx 3.5 hours',
      'One-way & round-trip options',
      'Temple-focused itineraries',
      'Dhanushkodi add-on available',
      'Group traveller vehicles',
    ],
    faqs: [
      {
        question: 'What is the distance from Madurai to Rameswaram?',
        answer:
          'Madurai to Rameswaram is approximately 170 km by road, taking around 3 to 3.5 hours depending on traffic and stops.',
      },
      {
        question: 'Can I visit Dhanushkodi on a Madurai to Rameswaram trip?',
        answer:
          'Yes. Dhanushkodi is 20 km from Rameswaram town and can be included in a same-day or overnight itinerary. Inform us at booking so we plan sufficient time.',
      },
    ],
    relatedSlugs: ['outstation-cabs-from-madurai', 'madurai-tours-and-travels', 'madurai-cabs'],
  },
  {
    slug: 'madurai-to-kodaikanal-cab',
    title: 'Madurai to Kodaikanal Cab | Hill Station Taxi | Mathi Cabs',
    description:
      'Book Madurai to Kodaikanal cab for hill station trips. ~120 km scenic route. Family packages, experienced hill drivers. Mathi Cabs.',
    keywords: 'madurai to kodaikanal cab, madurai to kodaikanal taxi, kodaikanal trip from madurai',
    h1: 'Madurai to Kodaikanal Cab — Hill Station Getaway',
    tamilSubtitle: 'மதுரை – கோடைக்கானல் கேப்',
    intro: [
      'Escape to the Princess of Hill Stations with Mathi Cabs Madurai to Kodaikanal cab service. The ~120 km journey takes about 3 hours through scenic ghat roads. Our hill-experienced drivers navigate the winding routes safely while you enjoy views of Palani hills and Kodaikanal lake.',
      'Popular stops include Silver Cascade Falls, Coaker\'s Walk, Bryant Park, and Pillar Rocks. We offer same-day return and overnight packages with hotel drop-off.',
    ],
    sections: [
      {
        heading: 'Best Time to Visit Kodaikanal from Madurai',
        paragraphs: [
          'Kodaikanal is pleasant year-round but peak season is April–June and September–October. Monsoon (July–August) offers lush greenery but carry rain gear. Book your cab in advance during Pongal and summer holidays for guaranteed availability.',
        ],
      },
    ],
    highlights: [
      '~120 km hill station route',
      'Experienced ghat road drivers',
      'Same-day & overnight packages',
      'SUV recommended for families',
      'Sightseeing stopovers included',
    ],
    faqs: [
      {
        question: 'How long does it take to reach Kodaikanal from Madurai by cab?',
        answer:
          'The Madurai to Kodaikanal cab journey takes approximately 3 hours covering 120 km, depending on traffic and stopovers.',
      },
      {
        question: 'Which vehicle is best for Kodaikanal hill roads?',
        answer:
          'SUVs and MUVs like Innova or Xylo are recommended for hill station trips due to comfort on ghat roads and ample space for luggage.',
      },
    ],
    relatedSlugs: ['madurai-to-ooty-cab', 'outstation-cabs-from-madurai', 'madurai-car-rental'],
  },
  {
    slug: 'madurai-to-ooty-cab',
    title: 'Madurai to Ooty Cab | Nilgiri Hills Taxi | Mathi Cabs',
    description:
      'Book Madurai to Ooty cab for Nilgiri hill station tours. Scenic routes via Kodai or Coimbatore. Family & group packages. Mathi Cabs.',
    keywords: 'madurai to ooty cab, madurai to ooty taxi, ooty tour from madurai',
    h1: 'Madurai to Ooty Cab — Nilgiri Hills Tour',
    tamilSubtitle: 'மதுரை – ஊட்டி கேப்',
    intro: [
      'Travel from Madurai to Ooty in comfort with Mathi Cabs. The journey of approximately 250–280 km takes 5–6 hours depending on the route chosen — via Kodaikanal for scenic ghats or via Coimbatore for faster highway travel.',
      'Ooty offers botanical gardens, Ooty Lake, Doddabetta Peak, and tea factory visits. Our drivers can suggest the best route based on your schedule and preferences.',
    ],
    sections: [
      {
        heading: 'Madurai to Ooty Route Options',
        paragraphs: [
          'Route 1 (Scenic): Madurai → Kodaikanal → Ooty via ghats — best for sightseeing. Route 2 (Fast): Madurai → Coimbatore → Ooty via NH — fastest option. Both routes are well-served by our outstation cab fleet with experienced long-distance drivers.',
        ],
      },
    ],
    highlights: [
      '250–280 km, 5–6 hours',
      'Two scenic route options',
      'Multi-day Ooty packages',
      'Tea estate stopovers',
      'Tempo traveller for groups',
    ],
    faqs: [
      {
        question: 'What is the best route from Madurai to Ooty?',
        answer:
          'Via Coimbatore is fastest (5 hours). Via Kodaikanal is more scenic but takes 6+ hours. Tell us your priority and we will recommend the best route.',
      },
      {
        question: 'Can I combine Ooty and Kodaikanal in one trip?',
        answer:
          'Yes. Multi-destination packages covering Kodaikanal and Ooty are popular. Contact us for a custom 2–3 day itinerary and combined fare quote.',
      },
    ],
    relatedSlugs: ['madurai-to-kodaikanal-cab', 'outstation-cabs-from-madurai', 'madurai-tours-and-travels'],
  },
  {
    slug: 'madurai-local-sightseeing',
    title: 'Madurai Local Sightseeing | City Tour Packages | Mathi Cabs',
    description:
      'Book Madurai local sightseeing cab tours. Meenakshi Temple, Thirumalai Nayakkar Mahal, Gandhi Museum & more. Full-day packages. Mathi Cabs.',
    keywords: 'madurai local sightseeing, madurai city tour, madurai temple tour, madurai one day tour',
    h1: 'Madurai Local Sightseeing — City Tour Packages',
    tamilSubtitle: 'மதுரை உள்ளூர் சுற்றுலா',
    intro: [
      'Discover the Temple City with Mathi Cabs Madurai local sightseeing packages. Our full-day city tours cover iconic landmarks including Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, Vandiyur Mariamman Teppakulam, and Alagar Kovil.',
      'Packages include 8 hours of cab hire with a knowledgeable local driver who can suggest the best visit order based on temple timings and crowd levels.',
    ],
    sections: [
      {
        heading: 'Popular Madurai Sightseeing Spots',
        paragraphs: [
          'Meenakshi Amman Temple — world-famous Dravidian architecture, best visited early morning. Thirumalai Nayakkar Mahal — 17th-century palace with evening light show. Gandhi Memorial Museum — history of India\'s freedom movement. Alagar Kovil — hill temple 21 km from city centre. Pazhamudhir Solai — Murugan temple in Alagar hills.',
        ],
      },
    ],
    highlights: [
      'Full-day 8 hr packages',
      'Temple & heritage sites',
      'Knowledgeable local drivers',
      'Flexible stop order',
      'Affordable family rates',
    ],
    faqs: [
      {
        question: 'How much does Madurai local sightseeing cost?',
        answer:
          'Local sightseeing packages start from our standard daily hire rates for sedans. SUV and traveller options are available for larger groups. Enquire for current pricing.',
      },
      {
        question: 'Can I customise the sightseeing itinerary?',
        answer:
          'Absolutely. Tell us which spots you want to visit and we will plan the most efficient route. Custom half-day and full-day packages are available.',
      },
    ],
    relatedSlugs: ['madurai-tours-and-travels', 'madurai-cabs', 'madurai-to-rameswaram-taxi'],
  },
  {
    slug: 'outstation-cabs-from-madurai',
    title: 'Outstation Cabs from Madurai | Inter-City Taxi | Mathi Cabs',
    description:
      'Book outstation cabs from Madurai to Chennai, Bangalore, Rameswaram, Kodaikanal, Ooty & all Tamil Nadu. One-way & round-trip. Mathi Cabs.',
    keywords: 'outstation cabs madurai, madurai outstation taxi, intercity cab madurai',
    h1: 'Outstation Cabs from Madurai — All Tamil Nadu Routes',
    tamilSubtitle: 'மதுரை வெளியூர் கேப் சேவை',
    intro: [
      'Mathi Cabs connects Madurai to every corner of Tamil Nadu and beyond with reliable outstation cab service. Whether you need a one-way drop to Chennai, a round-trip to Kanyakumari, or a multi-city tour across hill stations, our outstation fleet is ready 24/7.',
      'Outstation pricing is transparent: base per-day rate for trips under 250 km, plus per-km charges above that. Driver allowance (batta), toll, and parking are explained before booking — no surprises on your bill.',
    ],
    sections: [
      {
        heading: 'Popular Outstation Routes from Madurai',
        paragraphs: [
          'Madurai → Rameswaram (170 km) — pilgrimage tours. Madurai → Kodaikanal (120 km) — hill station getaways. Madurai → Ooty (280 km) — Nilgiri tours. Madurai → Kanyakumari (245 km) — southern tip tours. Madurai → Chennai (460 km) — highway travel. Madurai → Bangalore (440 km) — interstate trips. Madurai → Tiruchirappalli (140 km) — same-day return.',
        ],
      },
    ],
    highlights: [
      'All Tamil Nadu routes covered',
      'One-way & round-trip cabs',
      'Interstate travel available',
      'Transparent km-based pricing',
      'Highway-experienced drivers',
    ],
    faqs: [
      {
        question: 'How are outstation cab fares calculated from Madurai?',
        answer:
          'Fares include a base per-day rate for trips under 250 km. Beyond 250 km, additional per-km charges apply. Driver batta, toll, and parking are extra. We provide a full quote before confirmation.',
      },
      {
        question: 'Can I book a one-way outstation cab from Madurai?',
        answer:
          'Yes. One-way outstation drops to any city are available. One-way fares differ from round-trip rates — contact us for the exact price to your destination.',
      },
    ],
    relatedSlugs: ['madurai-cabs', 'madurai-to-rameswaram-taxi', 'madurai-tours-and-travels'],
  },
]

export function getSeoLandingPage(slug: string | undefined): SeoLandingPage | undefined {
  if (!slug) return undefined
  return SEO_LANDING_PAGES.find((p) => p.slug === slug)
}

export function getSeoLandingPageByPath(path: string): SeoLandingPage | undefined {
  const slug = path.replace(/^\//, '')
  return getSeoLandingPage(slug)
}
