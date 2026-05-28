/**
 * API + storage URL helpers.
 * - Dev: use relative `/api` and `/storage` (Vite proxies to Laravel).
 * - Prod: same-origin paths, or set VITE_API_URL (e.g. https://mathicabs.in).
 */
export function getApiBase(): string {
  return (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''
}

/** e.g. resolveApiUrl('/api/cars/list') */
export function resolveApiUrl(path: string): string {
  const base = getApiBase()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

/** Car images stored in Laravel public disk: storage/cars/{filename} */
export function resolveStorageCarsUrl(imageUrl: string): string {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl

  let clean = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
  if (clean.startsWith('storage/cars/')) {
    clean = clean.slice('storage/cars/'.length)
  }

  const base = getApiBase()
  return `${base}/storage/cars/${clean}`
}
