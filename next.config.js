/** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// module.exports = nextConfig;
// next.config.js
// const nextConfig = {
//   webpack: (config) => {
//     config.ignoreWarnings = [/critical dependency: the request of a dependency is an expression/];
//     return config;
//   },
// };
// export default nextConfig;

// next.config.js - REPLACE ENTIRE FILE
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
   
}

export default nextConfig
