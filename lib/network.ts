export function isSharedPreviewHost(hostname?: string) {
  const host =
    hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");

  return host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]";
}
