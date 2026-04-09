# Deploy to GitHub Pages 
# This script builds and deploys to https://TSRCHARAN.github.io

Write-Host "Setting environment variables..."
$env:VITE_SUPABASE_URL = "https://nkmrcaikhftifsraaqjp.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbXJjYWlraGZ0aWZzcmFhcWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzgwMjUsImV4cCI6MjA4OTkxNDAyNX0.dBtTN0vAlB75ffpm_HujegO_cJLHObaS_qMQ2pcKPhI"
$env:VITE_API_URL = "https://tsrcharan.vercel.app"

Write-Host "Building..."
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Build failed!"
  exit 1
}

Write-Host "Deploying to GitHub Pages..."
npx gh-pages -d dist -r "https://github.com/TSRCHARAN/TSRCHARAN.github.io.git"

Write-Host "✅ Deployed successfully!"
Write-Host "Visit: https://TSRCHARAN.github.io"
