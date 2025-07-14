/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
  images: {
    remotePatterns: [
      "res.cloudinary.com",
      "i.pravatar.cc",
      "avatar.iran.liara.run",
    ].map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
