/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:["sih.gov.in"]
  },
  devIndicators: {
    buildActivity: false
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
