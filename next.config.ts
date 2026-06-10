/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! VESZÉLYES ZÓNA: Ez kikapcsolja a Vercel szigorú ellenőrzését !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;