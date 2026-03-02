# Quick Start: GitHub Deployment

## ⚡ 30-Minute Setup

### Step 1: Create GitHub Repository (5 min)
1. Go to [github.com/new](https://github.com/new)
2. Name it: `new-world-timeline-app`
3. Click **Create repository**

### Step 2: Initialize & Push Code (10 min)

**Linux/macOS:**
```bash
bash scripts/setup-github.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\setup-github.ps1
```

Or manually:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/new-world-timeline-app.git
git push -u origin main
```

### Step 3: Enable GitHub Pages (5 min)
1. Go to repo **Settings** → **Pages**
2. Set source to: **GitHub Actions**
3. Save

### Step 4: View Your Site (10 min)
1. Go to repo **Actions** tab
2. Watch the workflow run
3. Once complete, visit: `https://YOUR_USERNAME.github.io/new-world-timeline-app/`

---

## 📝 Regular Workflow

```bash
# Make changes
git add .
git commit -m "feat: add your feature"
git push

# Automatically:
# ✅ Runs linting
# ✅ Builds project
# ✅ Deploys to GitHub Pages
# ✅ View live at: https://YOUR_USERNAME.github.io/new-world-timeline-app/
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check Actions tab for error logs |
| Pages not updated | Ensure Pages source is set to "GitHub Actions" |
| Linting errors | Run `npm run lint` locally and fix |
| Need to customize base URL | Edit `vite.config.js` line 11 |

---

## 📚 Full Documentation

See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for detailed information.
