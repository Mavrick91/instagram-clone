// @ts-check

/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    domains: [
      "cloudflare-ipfs.com",
      "avatars.githubusercontent.com",
      "instagram-clone-bucket-mav.s3.amazonaws.com",
    ],
  },
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
