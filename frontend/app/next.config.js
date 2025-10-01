Write-Host "Criando next.config.js..." -ForegroundColor Yellow
$nextConfig = @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig
'@
$nextConfig | Out-File -FilePath "next.config.js" -Encoding UTF8