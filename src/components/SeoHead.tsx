import { Helmet } from 'react-helmet-async'
import {
  absoluteUrl,
  buildLocalBusinessSchema,
  BUSINESS,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '../lib/siteConfig'

export type FaqItem = {
  question: string
  answer: string
}

type BreadcrumbItem = {
  name: string
  path: string
}

type SeoHeadProps = {
  title: string
  description: string
  path?: string
  keywords?: string
  ogImage?: string
  faqs?: FaqItem[]
  breadcrumbs?: BreadcrumbItem[]
  schema?: Record<string, unknown>[]
  noindex?: boolean
}

export default function SeoHead({
  title,
  description,
  path = '/',
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  faqs,
  breadcrumbs,
  schema = [],
  noindex = false,
}: SeoHeadProps) {
  const canonical = absoluteUrl(path)
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  const structuredData: Record<string, unknown>[] = [...schema]

  // Reinforce Madurai entity on every indexable page (helps vs brand/location collisions).
  if (!noindex) {
    const hasOrg = structuredData.some((item) => {
      const id = item['@id']
      const type = item['@type']
      return (
        id === `${SITE_URL}/#organization` ||
        type === 'TravelAgency' ||
        (Array.isArray(type) && type.includes('TravelAgency'))
      )
    })
    if (!hasOrg) {
      structuredData.unshift(buildLocalBusinessSchema())
    }
  }

  if (faqs && faqs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    })
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Madurai" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  )
}

export function buildServiceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': ['TravelAgency', 'TaxiService', 'LocalBusiness'],
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.streetAddress,
        addressLocality: 'Madurai',
        addressRegion: BUSINESS.region,
        postalCode: BUSINESS.postalCode,
        addressCountry: BUSINESS.country,
      },
    },
    areaServed: [
      { '@type': 'City', name: 'Madurai' },
      { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
    ],
    url: absoluteUrl(path),
  }
}
