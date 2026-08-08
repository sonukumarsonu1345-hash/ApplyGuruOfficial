/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prisma's generated client and bcryptjs's native-module-adjacent bindings
  // shouldn't be passed through the server component bundler — this is the
  // standard Next.js 15 setting for both.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  // Tree-shakes framer-motion's barrel import so client bundles only pick up
  // the modules a page actually uses, instead of the whole library.
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        // Applies to every route. Individual routes (e.g. the admin auth
        // pages) don't need anything looser than this baseline.
        source: "/:path*",
        headers: [
          // Prevents this site from being framed by another origin
          // (clickjacking protection) for browsers that don't honor CSP's
          // frame-ancestors, which is set below as the modern equivalent.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from MIME-sniffing a response away from its
          // declared Content-Type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limits how much of this site's URL is leaked to other origins
          // when a user follows an outbound link.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Opts out of browser features this site never uses.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS: once a browser sees this over HTTPS it will refuse to
          // load the site over plain HTTP for a year. Only meaningful in
          // production behind TLS — harmless locally since dev runs on
          // http://localhost and browsers ignore HSTS there.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-inline' is required for the JSON-LD <script> tags in
              // layout.tsx/CategoryPage.tsx and for Next.js's inline hydration
              // data; 'unsafe-eval' isn't included since none of this app's
              // code needs it.
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
