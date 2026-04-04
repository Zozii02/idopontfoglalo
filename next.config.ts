/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! VESZÉLYES ZÓNA: Ez kikapcsolja a Vercel szigorú ellenőrzését !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Kikapcsolja a formai hibák ellenőrzését is
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;