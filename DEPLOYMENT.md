# Deployment Guide for BST Visualizer

## GitHub Pages Deployment

This project is configured for easy deployment to GitHub Pages using the `gh-pages` package.

### Prerequisites

1. Make sure you have a GitHub repository for this project
2. Update the `homepage` field in `package.json` with your GitHub Pages URL:

   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

### Deployment Steps

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**

   ```bash
   npm run deploy
   ```

   This command will:
   - Build the project for production
   - Create a `gh-pages` branch (if it doesn't exist)
   - Push the build files to the `gh-pages` branch
   - GitHub will automatically serve the site from this branch

### First-time Setup

If this is your first deployment:

1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set the source to "Deploy from a branch"
4. Select the `gh-pages` branch
5. Select `/ (root)` as the folder
6. Click "Save"

### Updating the Site

To update the deployed site, simply run:

```bash
npm run deploy
```

This will rebuild and redeploy automatically.

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Update the `homepage` field in `package.json` to your custom domain

### Troubleshooting

- **404 errors**: Make sure the `homepage` field in `package.json` matches your GitHub Pages URL
- **Build fails**: Check that all dependencies are installed with `npm install`
- **Deployment fails**: Ensure you have push access to the repository

### Local Testing

Before deploying, you can test the production build locally:

```bash
npm run build
npx serve -s build
```

This will serve the production build on `http://localhost:3000`.
