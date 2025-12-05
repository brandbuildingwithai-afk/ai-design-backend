# 🚀 Quick Setup Guide

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 20+ installed
- [ ] PostgreSQL 15+ running locally or access to a PostgreSQL database
- [ ] Git configured
- [ ] Code editor (VS Code recommended)

## Required API Keys

You'll need to sign up for these services (all have free tiers):

1. **Anthropic Claude** (Required)
   - Sign up: https://console.anthropic.com
   - Get $5 free credit
   - Create API key

2. **Cloudinary** (Required)
   - Sign up: https://cloudinary.com/users/register/free
   - Free tier: 25GB storage, 25GB bandwidth
   - Get Cloud Name, API Key, API Secret from dashboard

3. **Stability AI** (Optional, for better image generation)
   - Sign up: https://platform.stability.ai
   - Get API key

4. **OpenAI** (Optional, fallback for images)
   - Sign up: https://platform.openai.com
   - Get API key

## Step-by-Step Setup

### 1. Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb ai_design_platform

# Your DATABASE_URL will be:
# postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/ai_design_platform
```

**Option B: Railway (Free Cloud Database)**
```bash
# 1. Go to https://railway.app
# 2. Click "Start a New Project" → "Provision PostgreSQL"
# 3. Copy the DATABASE_URL from settings
```

**Option C: Render (Free Cloud Database)**
```bash
# 1. Go to https://dashboard.render.com
# 2. New → PostgreSQL
# 3. Free tier is available
# 4. Copy External Database URL
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
# npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Use VS Code or any text editor:
code .env

# Required values to fill:
# DATABASE_URL=postgresql://... (from step 1)
# JWT_SECRET=generate-a-random-32-character-string-here
# ANTHROPIC_API_KEY=sk-ant-xxxxx (from Anthropic)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start backend server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies (already done)
# npm install

# Create .env file
cp .env.example .env

# Edit .env
code .env

# Set API URL (should already be correct):
# VITE_API_URL=http://localhost:5000

# Start frontend dev server
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Verify Everything Works

1. **Test Backend**
   - Open: http://localhost:5000/health
   - Should see: `{"status": "healthy", "timestamp": "..."}`

2. **Test Frontend**
   - Open: http://localhost:5173
   - Should see Vite + React default page

3. **Test API**
   - Open: http://localhost:5000/api
   - Should see API info with endpoints

## Common Issues & Solutions

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
cd backend
npm run prisma:generate
```

### Issue: "error: database 'ai_design_platform' does not exist"
**Solution:**
```bash
createdb ai_design_platform
# OR update DATABASE_URL in .env to point to existing database
```

### Issue: Backend crashes with "Invalid environment variables"
**Solution:**
Check your `.env` file has all required fields filled:
- DATABASE_URL
- JWT_SECRET (minimum 32 characters)
- ANTHROPIC_API_KEY (starts with sk-ant-)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### Issue: "Port 5000 is already in use"
**Solution:**
```bash
# Option 1: Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Option 2: Change port in backend/.env
PORT=5001
```

### Issue: Frontend can't connect to backend
**Solution:**
1. Make sure backend is running on port 5000
2. Check VITE_API_URL in frontend/.env matches backend port
3. Restart frontend dev server after changing .env

## Next Steps

Once both servers are running:

1. **Phase 2**: Start building Brand Learning System
   - Create brand upload page
   - Integrate Claude Vision API
   - Test brand extraction

2. **Create a test user**
   - Will implement auth routes next
   - Can test registration and login

3. **Explore the codebase**
   - Backend: `src/index.ts` - main server file
   - Frontend: `src/App.tsx` - main React component
   - Database: `prisma/schema.prisma` - database models

## Development Tips

### Useful Commands

**Backend**
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run start            # Run production build
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:migrate   # Create and apply migration
```

**Frontend**
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Recommended VS Code Extensions
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Database GUI
```bash
cd backend
npm run prisma:studio
```
Opens at http://localhost:5555 - visual database browser

## Need Help?

Check the main [README.md](README.md) for:
- Full project documentation
- API documentation
- Architecture overview
- Contributing guidelines

---

**You're all set! 🎉** Backend on :5000, Frontend on :5173
