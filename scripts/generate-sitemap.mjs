import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllPrerenderRoutes, SITEMAP_PRIORITIES } from './seo-routes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://mathicabs.in'
const today = new Date().toISOString().slice(0, 10)

const routes = getAllPrerenderRoutes()

const urls = routes
  .map((route) => {
    const priority = SITEMAP_PRIORITIES[route] ?? (route.includes('popular-destinations/') ? '0.8' : '0.7')
    const changefreq = route === '/' ? 'daily' : route.includes('madurai-') ? 'weekly' : 'monthly'
    return `  <url>
    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(join(__dirname, '../public/sitemap.xml'), sitemap, 'utf8')
console.log(`Generated sitemap with ${routes.length} routes`)
