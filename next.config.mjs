/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
  images: {
    remotePatterns: [
      "res.cloudinary.com"
    ].map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
