# Deploy to GitHub Pages (main site)
# Deploys to https://TSRCHARAN.github.io

# Set environment variables for build
$env:VITE_SUPABASE_URL = "https://nkmrcaikhftifsraaqjp.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbXJjYWlraGZ0aWZzcmFhcWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzgwMjUsImV4cCI6MjA4OTkxNDAyNX0.dBtTN0vAlB75ffpm_HujegO_cJLHObaS_qMQ2pcKPhI"
$env:VITE_API_URL = "https://portfolio-hazel-five-u6bdbwydof.vercel.app"

npm run build
npx gh-pages -d dist -r "https://github.com/TSRCHARAN/TSRCHARAN.github.io.git"

Write-Host "✅ Deployed to GitHub Pages!"
Write-Host "Visit: https://TSRCHARAN.github.io"
