export const SITE_URL = 'https://mathicabs.in'
export const SITE_NAME = 'Mathi Cabs'

export const BUSINESS = {
  name: 'Mathi Cabs Tours and Travels',
  phone: '+91 452 123 4567',
  email: 'poothanapuvi@gmail.com',
  streetAddress: 'Near Meenakshi Temple',
  locality: 'Madurai',
  region: 'Tamil Nadu',
  postalCode: '625001',
  country: 'IN',
  latitude: 9.9252,
  longitude: 78.1198,
} as const

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
