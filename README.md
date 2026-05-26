# 👑 Royalty Plus — Full-Stack Premium Website

A luxury futuristic full-stack website for the **Royalty Plus** brand, built with Next.js, Tailwind CSS, Framer Motion, Node.js, Express, and MongoDB.

---

## 🗂️ Project Structure

```
royalty-plus/
├── frontend/          # Next.js app
│   ├── pages/
│   │   ├── index.js            # Homepage
│   │   ├── products/           # Products page + detail
│   │   ├── articles/           # Blog + article detail
│   │   ├── research/           # Research papers
│   │   ├── ai-robotics/        # AI & Robotics projects
│   │   ├── about/              # About us
│   │   ├── contact/            # Contact form
│   │   └── admin9591/          # 🔒 Hidden admin panel
│   │       ├── index.js        # Admin login
│   │       ├── dashboard.js    # Analytics dashboard
│   │       ├── products.js     # Product management
│   │       ├── articles.js     # Article management
│   │       ├── research.js     # Research management
│   │       ├── ai-projects.js  # AI project management
│   │       ├── contacts.js     # Message management
│   │       ├── categories.js   # Category management
│   │       └── media.js        # Media/file manager
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Layout
│   │   ├── ui/                 # ParticleBackground, AnimatedSection
│   │   └── admin/              # AdminLayout, Modal
│   ├── lib/api.js              # All API calls
│   ├── context/AuthContext.js  # JWT auth context
│   └── styles/globals.css      # Design system
│
└── backend/           # Express API
    ├── server.js               # Main server
    ├── models/                 # MongoDB models
    ├── routes/                 # API routes
    └── middleware/             # Auth middleware
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd royalty-plus/backend
npm install

# Copy env file and edit it
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm run dev
# Runs on http://localhost:5000
```

### 2. Create First Admin User

After backend starts, run once:

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourPassword123!","email":"admin@royaltyplus.com"}'
```

Or visit: `http://localhost:5000/api/auth/setup` with POST body.

### 3. Frontend Setup

```bash
cd royalty-plus/frontend
npm install

cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed

npm run dev
# Runs on http://localhost:3000
```

---

## 🔐 Admin Panel

**URL:** `http://localhost:3000/admin9591`

Login with the credentials you set up in step 2.

### Admin Features:
- 📊 Dashboard with live analytics
- 📦 Product management (CRUD)
- 📝 Article/Blog management
- 🔬 Research paper management
- 🤖 AI & Robotics project management
- 📬 Contact message management
- 🏷️ Category management
- 🖼️ Media/file manager with drag-and-drop

---

## 🌐 Pages

| Page | URL |
|------|-----|
| Home | `/` |
| Products | `/products` |
| Product Detail | `/products/[slug]` |
| Articles | `/articles` |
| Article Detail | `/articles/[slug]` |
| Research | `/research` |
| AI & Robotics | `/ai-robotics` |
| About | `/about` |
| Contact | `/contact` |
| **Admin Login** | `/admin9591` |
| **Admin Dashboard** | `/admin9591/dashboard` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 13, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken) |
| Security | bcryptjs, helmet, express-rate-limit |
| Upload | Multer |

---

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
vercel deploy
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### Backend → Render / Railway
```bash
# Push to GitHub, connect repo to Render
# Set environment variables in Render dashboard
```

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Copy connection string to backend `.env`

---

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/royaltyplus
JWT_SECRET=your_very_long_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
BACKEND_URL=https://your-backend.render.com
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=https://your-backend.render.com/api
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
```

---

## 🎨 Design System

- **Colors:** Royal Blue (`#1d4ed8`), Dark Navy (`#0f172a`), Midnight (`#060d1f`)
- **Typography:** Cormorant Garamond (display), Outfit (body)
- **Effects:** Glassmorphism, particle background, glow effects, smooth animations
- **Style:** Apple smoothness × Tesla minimalism × Futuristic AI aesthetic

---

## 📁 Logo

Place your `logo.png` in `frontend/public/logo.png` for it to appear in the navbar and hero.

---

Built with ❤️ for **Royalty Plus** — *Designed for the future.*
