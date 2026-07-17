import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ada package-lock.json lain di direktori induk (D:\JEDA) untuk tooling
  // proposal — kunci root Turbopack ke folder app ini agar manifest benar.
  turbopack: {
    root: path.join(__dirname),
  },
  // Badge dev indicator mengotori screenshot demo.
  devIndicators: false,
};

export default nextConfig;
