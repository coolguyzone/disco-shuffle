# 🚀 GitHub Pages Deployment Guide

## Quick Setup

### 1. Repository Setup
- Make sure your repository is **public**
- Repository name should be: `disco-shuffle`

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **"GitHub Actions"**
5. Click **Save**

### 3. Enable GitHub Actions
1. In **Settings** tab
2. Click **Actions** → **General**
3. Under **Actions permissions**, select **"Allow all actions and reusable workflows"**
4. Click **Save**

### 4. Push Your Code
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 5. Check Deployment
1. Go to **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (green checkmark)
4. Your app will be available at: `https://[your-username].github.io/disco-shuffle/`

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
npm run build
npm run deploy
```

## Troubleshooting

### Common Issues:
- **404 Error**: Make sure repository is public
- **Build Fails**: Check Actions tab for error details
- **Page Not Found**: Wait a few minutes after deployment

### Check These:
- ✅ Repository is public
- ✅ GitHub Pages is enabled
- ✅ GitHub Actions is enabled
- ✅ Code pushed to main branch
- ✅ Workflow completed successfully

## Support

If you encounter issues:
1. Check the Actions tab for error logs
2. Verify all settings are correct
3. Try manual deployment as backup
