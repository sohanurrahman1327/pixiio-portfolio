/** True only for temporary LAN share IPs (e.g. npm run share), not production. */
export function isSharedPreviewHost(hostname?: string) {
  const host =
    hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");

  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}
