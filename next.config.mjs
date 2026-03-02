/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // NEVER true — kills crawl budget
  poweredByHeader: false,
  generateEtags: true,
  // Ensure pdfkit's bundled font metrics are copied into the server output
  // so the route can access the standard Helvetica fonts at runtime.
  // Use '*' so it applies to all routes/server chunks.
  outputFileTracingIncludes: {
    '*': ['./node_modules/pdfkit/js/data/**/*']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
