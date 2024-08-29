import createJiti from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/login",
        destination: "/",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

export default nextConfig;
