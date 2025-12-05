# Deployment Guide

## Overview
This guide covers deploying the AI Design Platform to production using:
- **Backend**: Render (Node.js + PostgreSQL)
- **Frontend**: Vercel (Static + SSR)

---

## Prerequisites

### Accounts Needed
- [Render](https://render.com) (free tier available)
- [Vercel](https://vercel.com) (free tier available)
- GitHub account (for repository)

### API Keys Required
- Anthropic API key (Claude)
- Cloudinary credentials
- Stability AI API key

---

## Part 1: Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configure:
   - Name: `ai-design-db`
   - Database: `ai_design_platform`
   - User: (auto-generated)
   - Region: Choose closest to you
   - Plan: Free (or paid for production)
4. Click **Create Database**
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 2: Create Web Service

1. In Render Dashboard, click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ai-design-backend`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```

4. Click **Advanced** → Add Environment Variables:

```env
DATABASE_URL=<Internal Database URL from Step 1>
ANTHROPIC_API_KEY=<your Anthropic key>
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
STABILITY_API_KEY=<your Stability AI key>
JWT_SECRET=<generate a random 64-character string>
FRONTEND_URL=https://<your-vercel-app>.vercel.app
NODE_ENV=production
PORT=10000
```

5. Click **Create Web Service**

### Step 3: Run Database Migrations

1. Wait for the service to build and deploy
2. Go to your service → **Shell** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. Verify: Visit `https://<your-backend>.onrender.com/api/health`

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Step 2: Add Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL=https://<your-backend>.onrender.com/api
   ```

3. Click **Save**
4. Go to **Deployments** → Redeploy

### Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://<your-app>.vercel.app`)
2. Test the full flow:
   - Upload brand images
   - Generate design
   - Export design

---

## Part 3: Custom Domain (Optional)

### Backend (Render)
1. Go to service → **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS with provided CNAME

### Frontend (Vercel)
1. Go to project → **Settings** → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS with provided records

---

## Troubleshooting

### Backend Issues

**"Prisma Client not generated"**
```bash
# In Render Shell
npx prisma generate
```

**Database connection fails**
- Check `DATABASE_URL` format
- Ensure database and web service are in same region
- Use Internal Database URL, not External

**API returns 500**
- Check Render logs: Service → **Logs** tab
- Verify all environment variables are set

### Frontend Issues

**API calls fail (CORS)**
- Verify `FRONTEND_URL` in backend env vars
- Check `VITE_API_URL` in Vercel env vars

**Build fails**
- Check Node version (should be 18+)
- Verify all dependencies in `package.json`

**Blank page**
- Check browser console for errors
- Verify API URL is correct

---

## Monitoring

### Render
- **Logs**: Service → Logs tab
- **Metrics**: Service → Metrics tab
- **Alerts**: Set up email notifications

### Vercel
- **Analytics**: Project → Analytics
- **Logs**: Deployment → Runtime Logs
- **Insights**: Built-in Core Web Vitals

---

## Costs

### Free Tier Limits
- **Render**: 
  - PostgreSQL: 1GB storage
  - Web Service: 750 hours/month
  - Spins down after 15 min inactivity
  
- **Vercel**:
  - 100GB bandwidth
  - 6,000 build minutes
  - Unlimited deployments

### Recommended Paid Plans
- **Render**: $7/month (web service) + $7/month (database)
- **Vercel**: $20/month (Pro)

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test full user flow
4. 🔄 Set up monitoring
5. 🔄 Add authentication
6. 🔄 Implement usage limits
7. 🔄 Add analytics

---

## Support

If you encounter issues:
1. Check Render/Vercel logs
2. verify environment variables
3. Test API endpoints with Postman
4. Check this guide's troubleshooting section
