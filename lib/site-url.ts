function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** Public site URL for emails and admin booking links. */
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL.trim());
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`);
  }

  if (process.env.VERCEL_URL?.trim()) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_URL.trim()}`);
  }

  return "http://localhost:3000";
}
