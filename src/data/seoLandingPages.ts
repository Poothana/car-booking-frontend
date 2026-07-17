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
    slug: 'madurai-tourism',
    title: 'Madurai Tourism & Sightseeing Packages | Places to Visit | Mathi Cabs',
    description:
      'Plan Madurai tourism with Mathi Cabs — 1-day, 2-day & 3-day sightseeing packages. Meenakshi Temple, Nayakkar Mahal, Alagar Kovil & more. Book local tours from Madurai.',
    keywords:
      'madurai tourism, madurai sightseeing, places to visit in madurai, madurai tourist places, madurai temple tour, madurai itinerary, tours and travels madurai',
    h1: 'Madurai Tourism & Sightseeing Packages',
    tamilSubtitle: 'மதுரை சுற்றுலா — இடங்கள், பேக்கேஜ்கள் மற்றும் கேப் சேவை',
    intro: [
      'Madurai tourism is built around temples, heritage palaces, classical Tamil culture, and flavourful street food. Mathi Cabs helps visitors explore the Temple City with chauffeur-driven sightseeing packages — from a focused one-day temple circuit to multi-day Madurai itineraries that include nearby pilgrimage and nature spots.',
      'Whether you are a first-time tourist, a family on a weekend trip, or a pilgrim combining Madurai with Rameswaram, our local drivers know temple opening hours, crowd patterns, and the most efficient route order so you spend more time at attractions and less time stuck in traffic.',
    ],
    sections: [
      {
        heading: 'Top Tourist Places in Madurai',
        paragraphs: [
          'Meenakshi Amman Temple — the heart of Madurai tourism. Visit early morning (around 5:00 AM–12:30 PM and evening darshan hours) for cooler weather and fewer queues. Dress code applies; photography rules vary by area. Plan 2–3 hours for a proper visit.',
          'Thirumalai Nayakkar Mahal — 17th-century palace known for its towering pillars and evening light-and-sound show (timings vary by season; confirm on the day). Ideal mid-day or late-afternoon stop after the temple.',
          'Gandhi Memorial Museum — housed in the historic Tamukkam Palace; closed on Mondays. Good stop for history lovers and a quieter break between temple visits.',
          'Vandiyur Mariamman Teppakulam — large temple tank, especially lively during Theppam (float) festival season. Alagar Kovil & Pazhamudhir Solai — hill temples about 21 km from the city centre, best as an afternoon half-day extension.',
          'Other popular stops: Koodal Azhagar Temple, Pudhu Mandapam market streets for shopping, and Madurai\'s famous jigarthanda and banana-leaf meals near the temple area.',
        ],
      },
      {
        heading: '1-Day Madurai Local Temple Tour',
        paragraphs: [
          'Morning: Pickup from hotel, railway station, or Madurai Airport (IXM). Start at Meenakshi Amman Temple for darshan and a walk around the temple corridors.',
          'Midday: Thirumalai Nayakkar Mahal and lunch in the city. Afternoon: Gandhi Memorial Museum or Koodal Azhagar Temple, then shopping near Pudhu Mandapam. Optional evening: Alagar Kovil if time and traffic allow.',
          'Package typically covers 8 hours of cab hire with a local driver. Ideal for short stays and travellers who want the classic Madurai tourism highlights in one day.',
        ],
      },
      {
        heading: '2-Day Madurai Tourism Itinerary',
        paragraphs: [
          'Day 1: Full Madurai city circuit — Meenakshi Temple, Nayakkar Mahal, museum, tank, and local food stops. Evening free for temple lighting and street shopping.',
          'Day 2: Morning Alagar Kovil and Pazhamudhir Solai, or a short outstation add-on to Tirupparankundram Murugan Temple. Afternoon return to Madurai for departure, or continue to Rameswaram the same evening if your schedule is tight.',
          'This two-day Madurai tourism plan suits families who want a relaxed pace without rushing temple queues.',
        ],
      },
      {
        heading: '3-Day Madurai & Nearby Tour Package',
        paragraphs: [
          'Day 1: Madurai local sightseeing as above. Day 2: Madurai to Rameswaram (about 170 km) — Ramanathaswamy Temple, Pamban Bridge views, and coastal stops. Day 3: Return via Dhanushkodi viewpoint (subject to weather and access) or an alternative hill/pilgrimage stop such as Kodaikanal for travellers who prefer cooler weather.',
          'Mathi Cabs can customise this 3-day Madurai tourism package for pilgrimage-only, family leisure, or mixed heritage + nature travel. Vehicle options range from sedan to tempo traveller for groups.',
        ],
      },
      {
        heading: 'Madurai Tourism Package Vehicles & Indicative Pricing',
        paragraphs: [
          'Sedan (4 seats) — best for couples and small families on a 1-day Madurai city tour. Local full-day (8 hours / ~80 km) packages typically start from our standard sedan daily hire rate; confirm the live tariff on our fleet page or by phone.',
          'SUV / MUV (6–7 seats) — ideal for families with luggage or elders. Comfortable for Madurai temple circuits and short Alagar Kovil extensions. Priced above sedan rates with the same transparent per-day + driver batta structure.',
          'Tempo Traveller (12–14 seats) — for group Madurai tourism, temple tours, and multi-day packages with friends or corporate guests. Group rates are quoted per day based on kilometres and overnight stay needs.',
          'All packages include a chauffeur. Toll, parking, and temple parking fees are explained before booking. Airport (IXM), Madurai Junction, and hotel pickups are available. View current fleet tariffs on our cars page or enquire for a written quote.',
        ],
      },
      {
        heading: 'Book Madurai Tourism Cabs with Mathi Cabs',
        paragraphs: [
          'Mathi Cabs is a Madurai-based tours and travels operator offering local sightseeing cabs, outstation taxis, and multi-day tour packages across Tamil Nadu. Transparent daily and per-km tariffs, verified drivers, and 24/7 booking support.',
          'Call or enquire online to get a quote for Madurai tourism packages, airport pickup, or custom itineraries. We also run dedicated pages for Madurai local sightseeing, Madurai to Rameswaram taxi, and other popular routes.',
        ],
      },
    ],
    highlights: [
      '1-day, 2-day & 3-day Madurai packages',
      'Sedan, SUV & tempo traveller options',
      'Temple timings & local route planning',
      'Airport / hotel / station pickup',
      'Transparent package quotes',
    ],
    faqs: [
      {
        question: 'What are the best places to visit in Madurai for tourists?',
        answer:
          'Start with Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, Vandiyur Mariamman Teppakulam, and Alagar Kovil. Mathi Cabs packages cover these Madurai tourism highlights with efficient routing.',
      },
      {
        question: 'How many days are enough for Madurai tourism?',
        answer:
          'One full day covers the main city temples and palace. Two days are better for a relaxed pace plus Alagar Kovil. Three days work well if you add Rameswaram or another nearby destination.',
      },
      {
        question: 'Do you provide Madurai sightseeing packages with a driver?',
        answer:
          'Yes. Our Madurai tourism packages include chauffeur-driven cars for half-day, full-day, and multi-day itineraries. You can customise stops based on temple timings and your interests.',
      },
      {
        question: 'Which vehicle should I choose for a Madurai city tour?',
        answer:
          'Choose a sedan for 1–3 travellers, an SUV/MUV for families of 4–6 with luggage, and a tempo traveller for groups of 8+. We confirm availability and the exact package fare before you book.',
      },
      {
        question: 'Can I combine Madurai tourism with Rameswaram or Kodaikanal?',
        answer:
          'Yes. Popular combinations are Madurai–Rameswaram pilgrimage and Madurai–Kodaikanal hill station trips. Ask us for a custom cab itinerary and fare quote.',
      },
    ],
    relatedSlugs: [
      'madurai-tourism-packages',
      'madurai-local-sightseeing',
      'madurai-tours-and-travels',
      'madurai-to-rameswaram-taxi',
      'outstation-cabs-from-madurai',
    ],
  },
  {
    slug: 'madurai-tourism-packages',
    title: 'Madurai Tourism Packages | 1-Day City Tour & Sightseeing Cabs | Mathi Cabs',
    description:
      'Book Madurai tourism packages with Mathi Cabs — 1-day temple tour, 2-day & 3-day itineraries. Sedan, SUV & tempo traveller. Meenakshi Temple sightseeing from Madurai.',
    keywords:
      'madurai tourism packages, madurai sightseeing packages, madurai city tour package, madurai temple tour package, 1 day madurai tour',
    h1: 'Madurai Tourism Packages — City Tours & Cab Hire',
    tamilSubtitle: 'மதுரை சுற்றுலா பேக்கேஜ்கள் — 1 நாள் / 2 நாள் / 3 நாள்',
    intro: [
      'Looking for clear Madurai tourism packages with a driver? Mathi Cabs offers ready 1-day, 2-day, and 3-day sightseeing plans covering Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Museum, Alagar Kovil, and optional Rameswaram add-ons.',
      'Choose sedan, SUV, or tempo traveller based on your group size. Every package includes hotel / station / airport pickup options and a chauffeur who knows temple timings and local routes.',
    ],
    sections: [
      {
        heading: '1-Day Madurai City Tour Package',
        paragraphs: [
          'Coverage: Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, Vandiyur Mariamman Teppakulam, optional shopping stop. Duration: 8 hours with chauffeur. Best for short stays and first-time visitors.',
          'Vehicles: Sedan (couples/small family), SUV/MUV (family with luggage), Tempo Traveller (groups). Enquire for today’s package fare — toll and parking are confirmed upfront.',
        ],
      },
      {
        heading: '2-Day & 3-Day Madurai Tourism Packages',
        paragraphs: [
          '2-Day: Day 1 city temples and palace; Day 2 Alagar Kovil / Pazhamudhir Solai or Tirupparankundram. Ideal for a relaxed Madurai tourism trip.',
          '3-Day: Add Rameswaram pilgrimage (about 170 km) or a hill-station extension. Perfect for families combining Madurai sightseeing with Tamil Nadu pilgrimage travel.',
        ],
      },
      {
        heading: 'How to Book',
        paragraphs: [
          'Call Mathi Cabs, use WhatsApp, or submit an enquiry with your dates and group size. We send a written quote with vehicle type, inclusions, and pickup point before you confirm.',
        ],
      },
    ],
    highlights: [
      'Ready 1 / 2 / 3-day packages',
      'Temple & heritage circuit',
      'Sedan · SUV · Tempo Traveller',
      'Written fare before booking',
      '24/7 Madurai support',
    ],
    faqs: [
      {
        question: 'What is included in a Madurai tourism package?',
        answer:
          'Chauffeur-driven cab for the agreed hours/days, pickup as agreed (hotel, station, or IXM airport), and a route plan for the temples and sights you choose. Entry tickets are usually paid directly at monuments.',
      },
      {
        question: 'Can I customise the Madurai city tour package?',
        answer:
          'Yes. Tell us which places you want to visit and we adjust the itinerary and vehicle. Half-day packages are also available after airport arrivals.',
      },
    ],
    relatedSlugs: ['madurai-tourism', 'madurai-local-sightseeing', 'madurai-tours-and-travels', 'madurai-cabs'],
  },
  {
    slug: 'madurai-tours-and-travels',
    title: 'Best Tours and Travels in Madurai | Madurai Tourism Packages | Mathi Cabs',
    description:
      'Mathi Cabs — trusted tours and travels in Madurai. Local sightseeing, Madurai tourism packages, outstation cabs & Tamil Nadu tour packages. Book 24/7.',
    keywords:
      'madurai tours and travels, tours and travels madurai, tours and travels in madurai, madurai travel agency, madurai tourism packages, mathi cabs',
    h1: 'Tours and Travels in Madurai — Your Trusted Travel Partner',
    tamilSubtitle: 'மதுரை சுற்றுலா மற்றும் பயண சேவை',
    intro: [
      'Looking for reliable tours and travels in Madurai? Mathi Cabs serves travellers across Tamil Nadu with chauffeur-driven cabs, experienced local drivers, and transparent pricing. Whether you need a one-day Madurai city tour, a Madurai tourism package, a family trip to hill stations, or a pilgrimage to Rameswaram, we handle the transport so you can travel stress-free.',
      'Our fleet includes sedans, SUVs, MUVs, and tempo travellers suited for solo travellers, families, and group tours. Every vehicle is well-maintained and driven by professional chauffeurs who know Madurai roads, temple timings, and Tamil Nadu routes.',
    ],
    sections: [
      {
        heading: 'Why Choose Mathi Cabs for Tours and Travels in Madurai?',
        paragraphs: [
          'Madurai is the cultural heart of Tamil Nadu and the gateway to Rameswaram, Kodaikanal, Ooty, and Kanyakumari. A local tours and travels partner helps with accurate fare estimates, flexible itineraries, and drivers who understand temple timings, hill road conditions, and seasonal travel patterns.',
          'We offer packaged Madurai tourism itineraries and fully custom trips. Tell us your dates, group size, and destinations — we recommend the right vehicle and route. Toll, parking, and hill-station fees are explained upfront before you confirm.',
        ],
      },
      {
        heading: 'Our Tour Services from Madurai',
        paragraphs: [
          'Madurai tourism and local sightseeing covering Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Museum, and Alagar Kovil. Outstation one-way and round-trip cabs to all major Tamil Nadu cities. Multi-day tour packages for families and corporate groups. Wedding and event transportation on request.',
        ],
      },
    ],
    highlights: [
      '24/7 booking and customer support',
      'Transparent tariff — no hidden costs',
      'Professional, verified drivers',
      'Sedan to tempo traveller fleet',
      'Local tourism & outstation packages',
    ],
    faqs: [
      {
        question: 'Which tours and travels company serves Madurai tourists well?',
        answer:
          'Mathi Cabs is a Madurai-based tours and travels provider offering local sightseeing, Madurai tourism packages, outstation cabs, and Tamil Nadu itineraries with transparent pricing and 24/7 support.',
      },
      {
        question: 'Do you offer custom tour packages from Madurai?',
        answer:
          'Yes. We create custom itineraries based on your dates, destinations, and budget. Contact us via phone or the enquiry form for a personalised quote.',
      },
      {
        question: 'What types of vehicles are available for group tours?',
        answer:
          'We offer sedans (4 seats), SUVs/MUVs (6–7 seats), and tempo travellers (12–14 seats) for group tours from Madurai.',
      },
    ],
    relatedSlugs: ['madurai-tourism', 'madurai-cabs', 'madurai-local-sightseeing', 'outstation-cabs-from-madurai'],
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
      'Book Madurai local sightseeing cab tours. Meenakshi Temple, Thirumalai Nayakkar Mahal, Gandhi Museum & more. Full-day packages with Mathi Cabs.',
    keywords:
      'madurai local sightseeing, madurai city tour, madurai temple tour, madurai one day tour, madurai tourism sightseeing',
    h1: 'Madurai Local Sightseeing — City Tour Packages',
    tamilSubtitle: 'மதுரை உள்ளூர் சுற்றுலா',
    intro: [
      'Discover the Temple City with Mathi Cabs Madurai local sightseeing packages. Our full-day city tours cover iconic landmarks including Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, Vandiyur Mariamman Teppakulam, and Alagar Kovil.',
      'Packages include 8 hours of cab hire with a knowledgeable local driver who can suggest the best visit order based on temple timings and crowd levels. For full 1–3 day Madurai tourism itineraries, see our Madurai Tourism packages page.',
    ],
    sections: [
      {
        heading: 'Popular Madurai Sightseeing Spots',
        paragraphs: [
          'Meenakshi Amman Temple — world-famous Dravidian architecture; best visited early morning. Thirumalai Nayakkar Mahal — 17th-century palace with evening light show. Gandhi Memorial Museum — history of India\'s freedom movement (closed Mondays). Alagar Kovil — hill temple about 21 km from the city centre. Pazhamudhir Solai — Murugan temple in the Alagar hills.',
        ],
      },
      {
        heading: 'Half-Day and Full-Day City Tour Options',
        paragraphs: [
          'Half-day (4 hours): Meenakshi Temple plus one palace or museum stop — ideal after an airport arrival. Full-day (8 hours): classic temple–palace–museum–tank circuit with optional Alagar Kovil. Multi-day extensions are available under our Madurai tourism packages.',
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
    relatedSlugs: ['madurai-tourism', 'madurai-tours-and-travels', 'madurai-cabs', 'madurai-to-rameswaram-taxi'],
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
