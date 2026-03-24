# Deploy to GitHub Pages (main site)
# Deploys to https://TSRCHARAN.github.io

npm run build
npx gh-pages -d dist -r "https://github.com/TSRCHARAN/TSRCHARAN.github.io.git"

Write-Host "✅ Deployed to GitHub Pages!"
Write-Host "Visit: https://TSRCHARAN.github.io"
