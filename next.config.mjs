/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      "res.cloudinary.com",
      "i.pravatar.cc",
      "avatar.iran.liara.run",
      "api.dicebear.com"
    ].map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
