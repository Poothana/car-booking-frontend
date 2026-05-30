import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { getAllPrerenderRoutes } from './seo-routes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '../dist')
const PORT = 4174

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function resolveFile(urlPath) {
  const safePath = decodeURIComponent(urlPath.split('?')[0])
  const relative = safePath === '/' ? '/index.html' : safePath
  const filePath = join(DIST, relative)

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath
  }

  const withIndex = join(DIST, safePath.replace(/\/$/, ''), 'index.html')
  if (existsSync(withIndex)) {
    return withIndex
  }

  return join(DIST, 'index.html')
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      try {
        const filePath = resolveFile(req.url || '/')
        const body = readFileSync(filePath)
        const type = MIME[extname(filePath)] || 'application/octet-stream'
        res.writeHead(200, { 'Content-Type': type })
        res.end(body)
      } catch {
        res.writeHead(404).end('Not found')
      }
    })
    server.listen(PORT, '127.0.0.1', () => resolve(server))
  })
}

function outputPath(route) {
  if (route === '/') return join(DIST, 'index.html')
  return join(DIST, route.replace(/^\//, ''), 'index.html')
}

function waitSelector(route) {
  if (route === '/') return '.home-container'
  if (route.startsWith('/popular-destinations/') || route === '/popular-destinations') {
    return '.popular-destinations-page, .popular-destination-detail-page'
  }
  if (route === '/cars') return '.cars-list-container'
  if (route === '/enquiry') return '.enquiry-page'
  if (route === '/booking') return '.booking-form-container'
  if (route === '/tamil-nadu-map') return '.tamil-nadu-map-page'
  return '.seo-landing-page'
}

function cleanHead(html, route) {
  const expectedCanonical = route === '/' ? 'https://mathicabs.in/' : `https://mathicabs.in${route}`
  const headEnd = html.indexOf('</head>')
  if (headEnd === -1) return html

  let head = html.slice(0, headEnd)
  const rest = html.slice(headEnd)

  const ogTitles = [...head.matchAll(/property="og:title" content="([^"]+)"/g)]
  const ogDescriptions = [...head.matchAll(/property="og:description" content="([^"]+)"/g)]
  const title = ogTitles.length ? ogTitles[ogTitles.length - 1][1] : 'Mathi Cabs'
  const description = ogDescriptions.length ? ogDescriptions[ogDescriptions.length - 1][1] : ''

  head = head.replace(/<title>[^<]*<\/title>/g, '')
  head = head.replace(/<link rel="canonical" href="[^"]+"\s*\/?>/g, '')
  head = head.replace(/<meta name="title" content="[^"]+"\s*\/?>/g, '')
  head = head.replace(/<meta name="description" content="[^"]+"\s*\/?>/g, '')

  const injected = [
    `<title>${title}</title>`,
    `<meta name="title" content="${title}">`,
    description ? `<meta name="description" content="${description}">` : '',
    `<link rel="canonical" href="${expectedCanonical}">`,
  ].filter(Boolean).join('\n')

  return `${head}\n${injected}\n</head>${rest}`
}

async function prerender() {
  const routes = getAllPrerenderRoutes()
  const server = await startServer()
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log(`Prerendering ${routes.length} routes...`)

  try {
    for (const route of routes) {
      const page = await browser.newPage()
      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      })
      await page.waitForSelector(waitSelector(route), { timeout: 15000 })
      await page.evaluate(() => new Promise((resolve) => {
        requestAnimationFrame(() => setTimeout(resolve, 500))
      }))

      const html = cleanHead(await page.content(), route)
      const out = outputPath(route)
      mkdirSync(dirname(out), { recursive: true })
      writeFileSync(out, html, 'utf8')
      console.log(`  ✓ ${route}`)
      await page.close()
    }
  } finally {
    await browser.close()
    server.close()
  }

  console.log('Prerender complete.')
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
