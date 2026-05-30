import { useLocation } from 'react-router-dom'
import SeoHead, { buildServiceSchema } from './SeoHead'
import { getDestinationBySlug } from '../data/popularDestinations'
import { getSeoLandingPage } from '../data/seoLandingPages'
import { buildLocalBusinessSchema, buildWebSiteSchema } from '../lib/siteConfig'

const STATIC_SEO: Record<string, {
  title: string
  description: string
  keywords?: string
  noindex?: boolean
  schema?: Record<string, unknown>[]
}> = {
  '/': {
    title: 'Mathi Cabs | #1 Tours and Travels in Madurai | Best Car Rental Service',
    description:
      'Mathi Cabs is a trusted Madurai tours and travels company. Book affordable cabs, outstation taxis, airport transfers & Tamil Nadu tour packages. 24/7 service.',
    keywords:
      'Madurai tours and travels, Madurai cabs, car rental Madurai, taxi service Madurai, outstation cabs Madurai, Mathi Cabs',
    schema: [buildLocalBusinessSchema(), buildWebSiteSchema()],
  },
  '/cars': {
    title: 'Madurai Cabs & Car Rental — View Fleet & Tariff | Mathi Cabs',
    description:
      'Browse Mathi Cabs fleet in Madurai. Sedan, SUV, MUV & tempo traveller with transparent tariff. Book outstation cabs and local packages online.',
    keywords: 'madurai cabs, madurai car rental, cab tariff madurai, mathi cabs fleet',
  },
  '/booking': {
    title: 'Book Madurai Cab Online | Mathi Cabs',
    description:
      'Book your Madurai cab online with Mathi Cabs. Enter journey details, select your vehicle, and confirm your trip in minutes.',
    noindex: true,
  },
  '/enquiry': {
    title: 'Contact Mathi Cabs Madurai | Enquiry & Cab Booking',
    description:
      'Get in touch with Mathi Cabs for Madurai cab booking, tour packages, and outstation travel quotes. Call or submit an enquiry — we respond 24/7.',
  },
  '/tamil-nadu-map': {
    title: 'Tamil Nadu Map — Cab Service Coverage | Mathi Cabs Madurai',
    description:
      'View Mathi Cabs service coverage across Tamil Nadu. Outstation cabs from Madurai to all major cities, hill stations, and pilgrimage sites.',
  },
  '/popular-destinations': {
    title: 'Popular Destinations from Madurai | Tour Packages | Mathi Cabs',
    description:
      'Explore Tamil Nadu tour packages from Madurai — Ooty, Kodaikanal, Rameswaram, Kanyakumari & more. Book comfortable cabs with Mathi Cabs.',
    keywords: 'madurai tour packages, tamil nadu destinations, outstation trips madurai',
  },
}

export default function RouteSeo() {
  const { pathname } = useLocation()

  const landing = getSeoLandingPage(pathname.replace(/^\//, ''))
  if (landing) {
    return (
      <SeoHead
        key={pathname}
        title={landing.title}
        description={landing.description}
        path={pathname}
        keywords={landing.keywords}
        faqs={landing.faqs}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: landing.h1.split('—')[0].trim(), path: pathname },
        ]}
        schema={[buildServiceSchema(landing.h1, landing.description, pathname)]}
      />
    )
  }

  const destMatch = pathname.match(/^\/popular-destinations\/([^/]+)$/)
  if (destMatch) {
    const dest = getDestinationBySlug(destMatch[1])
    if (dest) {
      const path = `/popular-destinations/${dest.slug}`
      return (
        <SeoHead
          key={path}
          title={`Madurai to ${dest.name} Taxi & Tour Package | Mathi Cabs`}
          description={`Book Madurai to ${dest.name} cab with Mathi Cabs. ${dest.excerpt} Enquire for fare and itinerary.`}
          path={path}
          keywords={`madurai to ${dest.name.toLowerCase()} taxi, ${dest.name.toLowerCase()} tour from madurai, mathi cabs`}
          breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Destinations', path: '/popular-destinations' },
            { name: dest.name, path },
          ]}
          schema={[buildServiceSchema(`Madurai to ${dest.name} Cab Service`, dest.excerpt, path)]}
        />
      )
    }
  }

  const staticSeo = STATIC_SEO[pathname]
  if (staticSeo) {
    return (
      <SeoHead
        key={pathname}
        title={staticSeo.title}
        description={staticSeo.description}
        path={pathname}
        keywords={staticSeo.keywords}
        schema={staticSeo.schema}
        noindex={staticSeo.noindex}
      />
    )
  }

  return null
}
