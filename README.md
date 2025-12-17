# ☀️ SOL - Tokyo Drinking Partners

Connect foreigners with local Japanese for authentic Tokyo nightlife experiences.

## ✨ What We've Built

A platform connecting travelers and foreigners with friendly Japanese locals who love sharing Tokyo's drinking culture. Meet verified local guides, start at partner venues, and explore hidden gems together.

**Multi-language**: English • 中文 • 日本語

## 🚀 Tech Stack

- **Next.js 15** + TypeScript + Turbopack
- **Vercel Postgres** (Neon) + **Prisma ORM**
- **Tailwind CSS v4** with **Airbnb Design System**
- **shadcn/ui** components
- **next-intl** for 3-language support

## 🗄️ Database Models

- **User** (Admin/Member/Cast roles)
- **Member** (Basic/Premium tiers, verification docs)
- **Cast** (Standard/High-Class, photos, profiles)
- **MeetingRequest** (booking coordination)
- **Bookmark** (favorites system)

## 🎨 Airbnb-Inspired Design

**Colors**: Coral (#FF5A5F), Gold (#FFD700), Teal (#00A699)
**Features**: 8px grid, 12px radius, dimensional shadows, smooth animations

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env`:
```bash
DATABASE_URL="postgresql://..."  # From Vercel Postgres
NEXTAUTH_SECRET="your-secret-here"
```

3. Set up database:
```bash
npx prisma db push
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Key Structure

```
app/[locale]/        # EN/ZH/JA routes
├── (auth)/          # Login, register
├── (member)/        # Browse casts
├── (cast)/          # Profile management
└── (admin)/         # Dashboard

prisma/schema.prisma # Database schema
messages/            # Translations (en/zh/ja)
components/ui/       # shadcn components
```

## ✅ Completed (Week 1)

- [x] Next.js 15 + TypeScript setup
- [x] Database schema (8 models)
- [x] Airbnb design system
- [x] Multi-language (EN/ZH/JA)
- [x] Project structure
- [x] Homepage with i18n

## 🚧 Next Steps

**Week 2**: Auth + User Management
**Week 3**: Browse + Bookmarks + Requests
**Week 4**: Admin Dashboard + Deploy

## 🔐 User Roles

**Member** → Browse casts, bookmark, request meetings
**Cast** → Manage profile, view requests
**Admin** → Approve users, coordinate bookings

## 📚 Commands

```bash
npm run dev          # Start dev server
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma Client
```

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add Vercel Postgres
4. Deploy! 🎉

---

**Built with Next.js 15 • Prisma • Airbnb Design**
