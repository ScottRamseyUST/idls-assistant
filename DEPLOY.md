# IDLS Assistant — Deployment Guide
## Williams Sonoma Tulsa Operation

This is a hosted web app your Tulsa team can access from any browser or phone
with no login, no Claude account, and no installation required.

---

## What You Need

1. A free **Render.com** account (render.com — sign up with Google or email)
2. A free **GitHub** account (github.com)
3. Your **Anthropic API key** (from console.anthropic.com)

Total setup time: ~10 minutes. Hosting is FREE on Render's free tier.

---

## Step 1 — Put the files on GitHub

1. Go to github.com and sign in
2. Click the "+" icon top right → "New repository"
3. Name it: `idls-assistant`
4. Click "Create repository"
5. On the next screen, click "uploading an existing file"
6. Upload these files (keep the folder structure):
   - `server.js`
   - `package.json`
   - `public/index.html`
7. Click "Commit changes"

---

## Step 2 — Deploy to Render

1. Go to render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub account if prompted
4. Select your `idls-assistant` repository
5. Fill in these settings:
   - **Name:** idls-assistant (or anything you like)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Click "Advanced" → "Add Environment Variable"
   - Key: `ANTHROPIC_API_KEY`
   - Value: (paste your API key from console.anthropic.com)
7. Click "Create Web Service"

Render will build and deploy automatically. Takes about 2 minutes.

---

## Step 3 — Share with the Tulsa Team

Once deployed, Render gives you a URL like:
`https://idls-assistant.onrender.com`

Share that URL with anyone on the Tulsa team. They can:
- Open it in any browser (Chrome, Safari, Edge)
- Bookmark it on their phone home screen
- Access it with no login or account required

---

## Cost

- **Render free tier:** $0/month (app spins down after 15 min of inactivity,
  takes ~30 seconds to wake back up on first visit — upgrade to Starter $7/month
  to keep it always-on if needed)
- **Anthropic API:** Very low cost. Claude Haiku is ~$0.001 per question.
  100 questions/day = roughly $3/month.

---

## Updating the App

If you get new SOP documents or want to change anything:
1. Edit the files locally
2. Upload the updated files to GitHub (same repo)
3. Render automatically redeploys within 2 minutes

---

## Getting Your Anthropic API Key

1. Go to console.anthropic.com
2. Sign in (or create a free account)
3. Click "API Keys" in the left menu
4. Click "Create Key"
5. Copy the key — you only see it once, save it somewhere safe
6. Add a credit card (you only get charged for actual usage, typically < $5/month)

---

## Need Help?

For IDLS platform issues: support@dashlogistics.com
For deployment help: render.com/docs
