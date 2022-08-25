/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:["sih.gov.in","i.stack.imgur.com"]
  },
  devIndicators: {
    buildActivity: false
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
