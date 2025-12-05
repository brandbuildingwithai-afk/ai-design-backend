# 🎨 AI Design Platform

An intelligent design platform that learns your brand style from Instagram posts and generates on-brand social media designs using multi-agent AI orchestration.

## ✨ Features

- **🧠 Brand Learning**: Upload 3-5 Instagram posts, AI extracts colors, fonts, and style patterns
- **🤖 Multi-Agent AI**: Specialized agents for planning, layout, content, and brand consistency
- **🎯 Platform-Specific Templates**: Pre-built workflows for Instagram, LinkedIn, Twitter
- **✏️ Editable Canvas**: Full Fabric.js integration with drag-drop, resize, text editing
- **💬 Natural Language Editing**: Chat interface to edit designs ("make headline bigger", "change to blue")
- **⚡ Fast Generation**: < 30 seconds from prompt to editable design
- **💎 Credit System**: Free tier (10 designs/month), Pro tier (100/month), Enterprise (unlimited)

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **AI APIs**: 
  - Anthropic Claude (Opus & Sonnet for agents)
  - Stability AI (image generation)
  - OpenAI (fallback)
- **File Storage**: Cloudinary
- **Auth**: JWT with bcrypt

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Canvas**: Fabric.js
- **State**: Zustand
- **Routing**: React Router v6

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- API Keys for:
  - Anthropic Claude
  - Cloudinary
  - (Optional) Stability AI, OpenAI

### Installation

1. **Clone repository**
```bash
cd ai-design-platform
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Setup database
npm run prisma:migrate
npm run prisma:generate

# Start dev server
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start dev server
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api

## 📁 Project Structure

```
ai-design-platform/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express server
│   │   ├── config/                  # Database, env validation
│   │   ├── middleware/              # Auth, error handling
│   │   ├── routes/                  # API routes
│   │   ├── controllers/             # Request handlers
│   │   ├── services/
│   │   │   └── ai/
│   │   │       ├── agents/          # AI agents (planner, layout, etc.)
│   │   │       ├── orchestrator.ts  # Agent coordinator
│   │   │       └── clients/         # API clients (Claude, Stability)
│   │   └── types/
│   └── prisma/
│       └── schema.prisma            # Database schema
└── frontend/
    └── src/
        ├── components/              # React components
        ├── pages/                   # Route pages
        ├── store/                   # Zustand state
        ├── services/                # API calls
        └── hooks/                   # Custom hooks
```

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Project initialization
- [x] Database schema
- [x] TypeScript setup
- [x] Environment configuration

### Phase 2: Brand Learning (Week 1-2)
- [ ] Image upload UI
- [ ] Claude Vision integration
- [ ] Brand analysis & aggregation
- [ ] Brand profile display

### Phase 3: AI Generation (Week 2-3)
- [ ] Workflow templates
- [ ] Multi-agent orchestration
- [ ] Design generation pipeline
- [ ] Canvas rendering

### Phase 4: Editing (Week 3-4)
- [ ] Fabric.js canvas editor
- [ ] Element manipulation
- [ ] Chat-based editing
- [ ] Export functionality

### Phase 5: Launch (Week 4-5)
- [ ] Credit system
- [ ] Stripe integration
- [ ] Deployment
- [ ] Beta testing

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_design_platform
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Brand
- `POST /api/brand/analyze` - Upload and analyze brand images
- `GET /api/brand/:id` - Get brand profile
- `PUT /api/brand/:id` - Update brand profile

### Design
- `POST /api/design/generate` - Generate new design
- `GET /api/design/:id` - Get design
- `PUT /api/design/:id` - Update design
- `POST /api/design/:id/edit` - Natural language edit
- `POST /api/design/:id/export` - Export as PNG

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get template details

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

- Inspired by InVideo's multi-agent AI approach
- Built with cutting-edge AI models from Anthropic, Stability AI, and OpenAI
- Design principles from modern SaaS applications

---

**Built with ❤️ using TypeScript, React, and AI** 🚀
