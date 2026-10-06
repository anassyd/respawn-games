/** @type {import('next').NextConfig} */
const nextConfig = {
  // RAWG images are resized through its own crop URLs (see lib/utils.ts), so Next's optimizer isn't needed.
  images: { unoptimized: true },
};
export default nextConfig;
