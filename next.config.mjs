/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure pdfkit's bundled font metrics are copied into the server output
  // so the route can access the standard Helvetica fonts at runtime.
  // Use '*' so it applies to all routes/server chunks.
  outputFileTracingIncludes: {
    '*': ['./node_modules/pdfkit/js/data/**/*']
  }
};

export default nextConfig;
