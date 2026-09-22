/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" }, // clickjacking protection
  { key: "X-Content-Type-Options", value: "nosniff" }, // MIME-sniffing protection
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload", // enforced in production over HTTPS
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      // Add your image host(s) here, e.g. an S3 bucket or CDN
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // allow product image uploads via server actions
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
