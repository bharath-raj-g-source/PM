/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Set output to 'export' to generate static files.
  // This bypasses Vercel's server runtime and eliminates the 'external collaborator' limit.
  output: 'export', 
  
  // REQUIRED FOR STATIC EXPORT: Tell Next.js where to place the static output folder
  // (Standard practice for 'output: export')
  distDir: 'out', 

  // IMAGE CONFIGURATION: Use your existing remotePatterns for safety 
  // and add unoptimized: true to allow Next/Image to work with static export.
  images: {
    unoptimized: true, // This is essential for static export!
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pm-s3-images.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ]
  },
};

export default nextConfig;
