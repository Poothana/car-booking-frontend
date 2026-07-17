/**
 * Site-wide contact & business details from Vite env (see .env.example).
 * Restart dev server after changing .env values.
 */

function env(key: string, fallback: string): string {
  const value = import.meta.env[key] as string | undefined
  return value?.trim() || fallback
}

export const SITE_URL = env('VITE_SITE_URL', 'https://mathicabs.in')
export const SITE_NAME = env('VITE_SITE_NAME', 'Mathi Cabs')
export const PUBLIC_WEBSITE = env('VITE_PUBLIC_WEBSITE', 'www.mathicabs.in')

export const SUPPORT_PHONE = env('VITE_SUPPORT_PHONE', '+91 8220084469')
export const SUPPORT_EMAIL = env('VITE_SUPPORT_EMAIL', 'mathicabs08@gmail.com')

/** Digits only, for wa.me links. Defaults to SUPPORT_PHONE digits. */
export const WHATSAPP_PHONE = env(
  'VITE_WHATSAPP_PHONE',
  SUPPORT_PHONE.replace(/\D/g, ''),
)

export const BUSINESS = {
  name: env('VITE_BUSINESS_NAME', `${SITE_NAME} Tours and Travels`),
  phone: SUPPORT_PHONE,
  email: SUPPORT_EMAIL,
  streetAddress: env('VITE_BUSINESS_STREET', 'Near Meenakshi Temple'),
  locality: env('VITE_BUSINESS_CITY', 'Madurai'),
  region: env('VITE_BUSINESS_REGION', 'Tamil Nadu'),
  postalCode: env('VITE_BUSINESS_POSTAL', '625001'),
  country: env('VITE_BUSINESS_COUNTRY', 'IN'),
  latitude: Number(env('VITE_BUSINESS_LAT', '9.9252')),
  longitude: Number(env('VITE_BUSINESS_LNG', '78.1198')),
  addressLine: env(
    'VITE_BUSINESS_ADDRESS',
    'Near Meenakshi Temple, Madurai, Tamil Nadu 625001',
  ),
} as const

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`

export const ENTITY_TAGLINE =
  'Mathi Cabs Tours and Travels — headquartered in Madurai, Tamil Nadu. Serving Madurai tourism, local sightseeing, and outstation travels.'

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function phoneTelHref(phone: string = SUPPORT_PHONE): string {
  return `tel:${phone.replace(/\D/g, '')}`
}

export function emailMailtoHref(email: string = SUPPORT_EMAIL): string {
  return `mailto:${email}`
}

export function whatsappHref(message?: string): string {
  const text =
    message ??
    `Hello ${SITE_NAME}, I need information about car rental`
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.streetAddress,
    addressLocality: BUSINESS.locality,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.country,
  }
}

function maduraiAreasServed() {
  return [
    { '@type': 'City', name: 'Madurai' },
    { '@type': 'AdministrativeArea', name: 'Madurai District' },
    { '@type': 'AdministrativeArea', name: 'Rameswaram' },
    { '@type': 'AdministrativeArea', name: 'Kodaikanal' },
    { '@type': 'AdministrativeArea', name: 'Ooty' },
    { '@type': 'AdministrativeArea', name: 'Kanyakumari' },
    { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
  ]
}

/**
 * Primary entity schema for Mathi Cabs (Madurai HQ).
 * Reinforces car-rental / tours identity vs unrelated brand collisions online.
 */
export function buildLocalBusinessSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'TaxiService', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    alternateName: [SITE_NAME, 'Mathi Cabs Madurai', 'Mathi Cabs Tours and Travels Madurai'],
    legalName: BUSINESS.name,
    description:
      'Mathi Cabs Tours and Travels is a Madurai-headquartered tours and travels / taxi service near Meenakshi Temple. We provide Madurai tourism packages, local sightseeing cabs, outstation taxis, and airport transfers across Tamil Nadu. This Madurai operator is distinct from unrelated businesses using a similar name in other cities.',
    slogan: ENTITY_TAGLINE,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: SUPPORT_PHONE,
    email: SUPPORT_EMAIL,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    hasMap: `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.addressLine)}`,
    areaServed: maduraiAreasServed(),
    foundingLocation: {
      '@type': 'Place',
      name: 'Madurai, Tamil Nadu',
      address: postalAddress(),
    },
    knowsAbout: [
      'Madurai tourism',
      'Madurai local sightseeing',
      'Tours and travels in Madurai',
      'Madurai airport taxi',
      'Outstation cabs from Madurai',
      'Meenakshi Temple cab tours',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer',
    serviceType: [
      'Madurai Tourism Packages',
      'Tours and Travels Madurai',
      'Taxi Service Madurai',
      'Car Rental Madurai',
      'Outstation Cabs',
      'Airport Transfer',
      'Local Sightseeing',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SUPPORT_PHONE,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil'],
    },
  }
}

/** TaxiService-focused schema (homepage / entity reinforcement). */
export function buildTaxiServiceSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    '@id': `${SITE_URL}/#taxi-service`,
    name: BUSINESS.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    telephone: SUPPORT_PHONE,
    email: SUPPORT_EMAIL,
    description:
      'Chauffeur-driven taxi and cab service headquartered in Madurai for city sightseeing, tourism packages, and outstation travel.',
    address: postalAddress(),
    areaServed: maduraiAreasServed(),
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS.name,
      telephone: SUPPORT_PHONE,
      address: postalAddress(),
      url: SITE_URL,
    },
  }
}

export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: BUSINESS.name,
    url: SITE_URL,
    description: ENTITY_TAGLINE,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/cars?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
