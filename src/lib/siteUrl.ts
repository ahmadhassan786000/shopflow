export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Fall back to the deployment URL when the configured value is invalid.
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  return vercelUrl
    ? `https://${vercelUrl}`
    : "http://localhost:3000";
}