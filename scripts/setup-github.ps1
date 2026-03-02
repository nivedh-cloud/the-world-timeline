# GitHub Deployment Setup Script for Windows
# This script helps set up GitHub repository and CI/CD pipelines

$ErrorActionPreference = "Stop"

Write-Host "🚀 New World Timeline App - GitHub Deployment Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if already a git repository
if (Test-Path .git) {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Current remote:" -ForegroundColor Cyan
    git remote -v
    Write-Host ""
} else {
    Write-Host "🔧 Initializing new Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    Write-Host ""
}

# Get GitHub username and repo name
$GITHUB_USERNAME = Read-Host "📝 Enter your GitHub username"
$REPO_NAME = Read-Host "📝 Enter the repository name (default: new-world-timeline-app)"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "new-world-timeline-app"
}

Write-Host ""
Write-Host "🔗 Setting up remote repository..." -ForegroundColor Yellow
$GITHUB_URL = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
Write-Host "Repository URL: $GITHUB_URL" -ForegroundColor Cyan
Write-Host ""

# Check if remote exists
$remoteExists = git remote | Select-String "origin"
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists. Updating..." -ForegroundColor Yellow
    git remote set-url origin $GITHUB_URL
} else {
    Write-Host "Adding remote 'origin'..." -ForegroundColor Yellow
    git remote add origin $GITHUB_URL
}

Write-Host "✅ Remote configured" -ForegroundColor Green
Write-Host ""

# Verify files
Write-Host "📦 Verifying project files..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    Write-Host "✅ Deploy workflow found" -ForegroundColor Green
} else {
    Write-Host "❌ Deploy workflow not found" -ForegroundColor Red
    exit 1
}

if (Test-Path ".github/workflows/pr-checks.yml") {
    Write-Host "✅ PR checks workflow found" -ForegroundColor Green
} else {
    Write-Host "❌ PR checks workflow not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All workflow files present" -ForegroundColor Green
Write-Host ""

# Add files to git
Write-Host "📋 Staging project files..." -ForegroundColor Yellow
git add -A
Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""

# Check if there are commits
try {
    $commitCount = (git rev-list --count HEAD 2>$null)
    if ($commitCount -eq 0) {
        Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
        git commit -m "Initial commit: New World Timeline App with CI/CD setup"
        Write-Host "✅ Initial commit created" -ForegroundColor Green
    } else {
        Write-Host "✅ Repository already has commits" -ForegroundColor Green
    }
} catch {
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: New World Timeline App with CI/CD setup"
    Write-Host "✅ Initial commit created" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push to GitHub:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "2. Enable GitHub Pages:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages" -ForegroundColor White
Write-Host "   - Select 'GitHub Actions' as the source" -ForegroundColor White
Write-Host "   - Click Save" -ForegroundColor White
Write-Host ""
Write-Host "3. Monitor deployment:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions" -ForegroundColor White
Write-Host "   - Watch your workflow run" -ForegroundColor White
Write-Host ""
Write-Host "4. View your site:" -ForegroundColor Yellow
Write-Host "   - https://$GITHUB_USERNAME.github.io/$REPO_NAME/" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more details, see: GITHUB_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
