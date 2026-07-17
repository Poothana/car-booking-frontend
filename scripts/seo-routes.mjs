export const SEO_LANDING_SLUGS = [
  'madurai-tourism',
  'madurai-tourism-packages',
  'madurai-tours-and-travels',
  'madurai-cabs',
  'madurai-taxi-service',
  'madurai-airport-taxi',
  'madurai-car-rental',
  'madurai-to-rameswaram-taxi',
  'madurai-to-kodaikanal-cab',
  'madurai-to-ooty-cab',
  'madurai-local-sightseeing',
  'outstation-cabs-from-madurai',
]

export const POPULAR_DESTINATION_SLUGS = [
  'ooty',
  'kodaikanal',
  'kanyakumari',
  'madurai',
  'rameswaram',
  'yercaud',
  'coimbatore',
  'mudumalai',
  'velankanni',
  'valparai',
]

/** Routes included in sitemap + prerender (excludes noindex pages like /booking). */
export const STATIC_ROUTES = [
  '/',
  '/cars',
  '/enquiry',
  '/tamil-nadu-map',
  '/popular-destinations',
]

export function getAllPrerenderRoutes() {
  return [
    ...STATIC_ROUTES,
    ...SEO_LANDING_SLUGS.map((slug) => `/${slug}`),
    ...POPULAR_DESTINATION_SLUGS.map((slug) => `/popular-destinations/${slug}`),
  ]
}

export const SITEMAP_PRIORITIES = {
  '/': '1.0',
  '/madurai-tourism': '0.98',
  '/madurai-tourism-packages': '0.97',
  '/madurai-tours-and-travels': '0.95',
  '/madurai-cabs': '0.95',
  '/madurai-taxi-service': '0.9',
  '/madurai-airport-taxi': '0.9',
  '/madurai-car-rental': '0.9',
  '/madurai-local-sightseeing': '0.92',
  '/outstation-cabs-from-madurai': '0.9',
  '/madurai-to-rameswaram-taxi': '0.85',
  '/madurai-to-kodaikanal-cab': '0.85',
  '/madurai-to-ooty-cab': '0.85',
  '/cars': '0.9',
  '/enquiry': '0.7',
  '/tamil-nadu-map': '0.8',
  '/popular-destinations': '0.9',
  '/popular-destinations/madurai': '0.85',
}
