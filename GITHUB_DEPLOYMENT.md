# GitHub Deployment & CI/CD Guide

## 📋 Overview

This project is configured with GitHub Actions for automatic Continuous Integration and Continuous Deployment (CI/CD). When you push code to the `main` or `master` branch, the pipeline automatically:

1. ✅ Runs linting checks
2. ✅ Builds the project
3. ✅ Deploys to GitHub Pages
4. ✅ Notifies on success/failure

## 🚀 Initial Setup

### Step 1: Push to GitHub

If you haven't already, push this repository to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: New World Timeline App"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/new-world-timeline-app.git

# Push to GitHub (replace 'main' with your branch name if different)
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Select **Source**: `GitHub Actions`
   - This allows our workflow to deploy automatically
4. Click **Save**

### Step 3: Configure Base URL (If Using Subdirectory)

If deploying to a **repository subdirectory** (not a user/organization page):

```bash
# Example: deploying to github.com/username/new-world-timeline-app

# Set environment variable in GitHub Actions:
# Add to .github/workflows/deploy.yml in the "Build project" step:
env:
  VITE_BASE_URL: /new-world-timeline-app/
```

For **user/organization pages** (github.com/username.github.io):
- No changes needed, base URL defaults to `/`

## 📦 Workflow Files

### Main Deployment Workflow: `.github/workflows/deploy.yml`

**When It Runs:**
- Every push to `main` or `master` branch
- Every pull request to these branches

**What It Does:**

#### 1. **Build Job** (Runs on Node 18 & 20)
   - Checks out code
   - Installs dependencies
   - Runs linting
   - Builds project
   - Uploads artifacts

#### 2. **Test Job** (After build succeeds)
   - Verifies linting passes
   - Ensures code quality

#### 3. **Deploy Job** (Only on main/master)
   - Builds the project
   - Uploads to GitHub Pages
   - Sets up deployment environment

#### 4. **Notify Job** (Final status check)
   - Reports deployment status

## 🔄 Usage

### Making Changes & Deploying

```bash
# Make code changes
# ... edit files ...

# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add language support"

# Push to GitHub (triggers CI/CD automatically)
git push origin main
```

### Monitoring Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. View the workflow run in real-time
4. Check logs for any errors or warnings

### Release/Production Deployments

For major releases, you can create a **GitHub Release**:

```bash
# Tag a commit
git tag v1.0.0

# Push tag (triggers deployment)
git push origin v1.0.0
```

## ⚙️ Environment Variables

### Available Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_BASE_URL` | Base URL for deployment | `/app/` or `/` |
| `NODE_ENV` | Build environment | `production` |

### Setting Secrets (for future use)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secret (e.g., for API keys, deployment tokens)

```bash
# Reference in workflow:
env:
  API_KEY: ${{ secrets.MY_SECRET }}
```

## 🐛 Troubleshooting

### Build Fails: "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "chore: reinstall dependencies"
git push
```

### Linting Errors

The workflow will fail if there are linting errors. Fix them locally:

```bash
# Check all linting errors
npm run lint

# Auto-fix fixable errors
npx eslint . --fix
```

### Pages Not Deploying

1. Check GitHub Pages is enabled (Settings → Pages)
2. Verify source is set to "GitHub Actions"
3. Check workflow logs for build errors (Actions tab)
4. Verify `.github/workflows/deploy.yml` exists

### Verify Deployment

Once deployed, your site should be available at:

```
https://YOUR_USERNAME.github.io/new-world-timeline-app/
```

or

```
https://YOUR_ORGANIZATION.github.io/new-world-timeline-app/
```

## 📊 Workflow Status Badge

Add this to your README.md to show CI/CD status:

```markdown
[![Deploy Status](https://github.com/YOUR_USERNAME/new-world-timeline-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/new-world-timeline-app/actions)
```

## 🔐 Security Best Practices

1. **Never commit secrets** (API keys, tokens, passwords)
2. **Use GitHub Secrets** for sensitive data
3. **Review before merging** pull requests
4. **Keep dependencies updated** (`npm audit`, `npm update`)
5. **Enable branch protection** rules on main branch

## 📝 Git Workflow Best Practices

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commits
git commit -m "feat: describe what you added"
git commit -m "fix: describe what you fixed"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# - Review changes
# - Check CI/CD passes
# - Merge to main
```

### Commit Message Convention

```
feat: add new feature
fix: bug fixes
docs: documentation changes
style: code style changes
refactor: code refactoring
test: test additions/changes
chore: dependency updates, build changes
```

## 🚀 What's Next?

1. **Set up custom domain** (optional)
   - Settings → Pages → Custom domain

2. **Add status checks** to pull requests
   - Settings → Branches → Add branch protection rule

3. **Monitor performance**
   - Use GitHub Actions analytics
   - Monitor deployment times

4. **Set up notifications**
   - Watch repository for updates
   - Enable email notifications for workflow failures

## 📞 Support

For issues:
1. Check GitHub Actions logs (Actions tab)
2. Review workflow file: `.github/workflows/deploy.yml`
3. Verify settings in repository Settings → Pages
4. Check project's Issues on GitHub

---

**Last Updated:** March 2, 2026
**Workflow Version:** 1.0
