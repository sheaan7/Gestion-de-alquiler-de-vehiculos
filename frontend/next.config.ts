import type { NextConfig } from "next";

const configuracionNext: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.URL_GATEWAY ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

export default configuracionNext;
