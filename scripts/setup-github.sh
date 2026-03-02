#!/bin/bash

# GitHub Deployment Setup Script
# This script helps set up GitHub repository and CI/CD pipelines

set -e

echo "🚀 New World Timeline App - GitHub Deployment Setup"
echo "=================================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if already a git repository
if [ -d .git ]; then
    echo "✅ Git repository already exists"
    echo ""
    echo "📋 Current remote:"
    git remote -v || echo "No remote configured"
    echo ""
else
    echo "🔧 Initializing new Git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
fi

# Get GitHub username and repo name
read -p "📝 Enter your GitHub username: " GITHUB_USERNAME
read -p "📝 Enter the repository name (default: new-world-timeline-app): " REPO_NAME
REPO_NAME=${REPO_NAME:-new-world-timeline-app}

echo ""
echo "🔗 Setting up remote repository..."
GITHUB_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
echo "Repository URL: $GITHUB_URL"
echo ""

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "Remote 'origin' already exists. Updating..."
    git remote set-url origin "$GITHUB_URL"
else
    echo "Adding remote 'origin'..."
    git remote add origin "$GITHUB_URL"
fi

echo "✅ Remote configured"
echo ""

# Verify files
echo "📦 Verifying project files..."
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ Deploy workflow found"
else
    echo "❌ Deploy workflow not found"
    exit 1
fi

if [ -f ".github/workflows/pr-checks.yml" ]; then
    echo "✅ PR checks workflow found"
else
    echo "❌ PR checks workflow not found"
    exit 1
fi

echo "✅ All workflow files present"
echo ""

# Add files to git
echo "📋 Staging project files..."
git add -A
echo "✅ Files staged"
echo ""

# Check if there are commits
if git rev-parse --git-dir > /dev/null 2>&1; then
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    if [ "$COMMIT_COUNT" -eq 0 ]; then
        echo "💾 Creating initial commit..."
        git commit -m "Initial commit: New World Timeline App with CI/CD setup"
        echo "✅ Initial commit created"
    else
        echo "✅ Repository already has commits"
    fi
else
    echo "❌ Failed to initialize git"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "2. Enable GitHub Pages:"
echo "   - Go to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/pages"
echo "   - Select 'GitHub Actions' as the source"
echo "   - Click Save"
echo ""
echo "3. Monitor deployment:"
echo "   - Go to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/actions"
echo "   - Watch your workflow run"
echo ""
echo "4. View your site:"
echo "   - https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo ""
echo "📚 For more details, see: GITHUB_DEPLOYMENT.md"
echo ""
