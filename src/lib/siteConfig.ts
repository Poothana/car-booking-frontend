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

export const SUPPORT_PHONE = env('VITE_SUPPORT_PHONE', '+91 63800 63873')
export const SUPPORT_EMAIL = env('VITE_SUPPORT_EMAIL', 'poothanapuvi@gmail.com')

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

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

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

export function buildLocalBusinessSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: SUPPORT_PHONE,
    email: SUPPORT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
    serviceType: ['Car Rental', 'Taxi Service', 'Tours and Travels', 'Outstation Cabs', 'Airport Transfer'],
  }
}

export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
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
