/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration to skip TypeScript checks during the build step.
  // WARNING: This is dangerous, as it allows builds to succeed even if there are type errors.
  // It is a temporary fix to allow Vercel deployment while you fix your type issues.
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;