/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cloudflare-ipfs.com",
      "avatars.githubusercontent.com",
      "instagram-clone-bucket-mav.s3.amazonaws.com",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
