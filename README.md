# MGK Project

Marketing/presentation web app for **MGK-pack d.d.** built with **React + TypeScript + Vite + TailwindCSS**.

The site presents the company, product categories, technical specifications, and contact information in **Croatian** and **English**.

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- ESLint 9

## Main Features

- **Bilingual UI (HR/EN)** with runtime language toggle
- **Hero section** with delayed product-can animations
- **Sticky/hide-on-scroll top navbar**
- **Side product navigation** that appears after scrolling into product sections
- **Product sections generated from JSON** (data-driven rendering)
- **Slide-out specification panel** for each product category
- **Contact section** with localized labels
- **CMS at `/cms`** (employee login + JSON editor)

## Project Structure

```text
mgk-project/
├─ api/                     # Vercel Functions (auth + products API)
├─ public/                  # Static assets (images, icons, video)
├─ server/                  # Local Express API for dev
├─ src/
│  ├─ components/
│  │  ├─ CmsPanel.tsx       # CMS login + JSON editor
│  │  ├─ Navbar.tsx         # Top navbar (scroll-aware visibility)
│  │  ├─ Links.tsx          # Main nav links
│  │  ├─ ItemNavBar.tsx     # Left-side icon navigation by category
│  │  ├─ section.tsx        # Product section + side panel + specs table
│  │  ├─ SidePanel.tsx      # Slide-out details panel
│  │  ├─ cans.tsx           # Decorative separator component
│  │  ├─ Contact.tsx        # Contact/info footer section
│  │  └─ Product.tsx        # Product card component (generic)
│  ├─ lib/api.ts            # Frontend API client
│  ├─ types/products.ts     # Product data types
│  ├─ App.tsx               # Main page + CMS route switch
│  ├─ App.css               # Component-level styling/animations
│  ├─ index.css             # Global styles
│  ├─ products.json         # Product categories/specs/content (HR/EN)
│  ├─ info.json             # Company "About us" content (HR/EN)
│  └─ main.tsx              # App entry point
├─ index.html
├─ package.json
├─ tsconfig*.json
├─ vite.config.ts
└─ eslint.config.js
```

## Scripts

- `npm run dev` — start local frontend dev server (Vite)
- `npm run dev:api` — start local CMS API server (Express)
- `npm run build` — TypeScript build + production bundle
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Run Locally

```bash
npm install
cp .env.example .env
# set CMS_USERNAME / CMS_PASSWORD / CMS_JWT_SECRET in .env
npm run dev:api
npm run dev
```

Default URLs:
- Frontend: `http://localhost:5173`
- CMS page: `http://localhost:5173/cms`
- Local API: `http://localhost:3001`

## CMS (employee login + products.json editing)

- Employees open `/cms` and login with credentials from `.env` (or Vercel env vars)
- After login, they can edit full JSON content and save
- Frontend reads product data via `/api/products` (with local JSON fallback if API is offline)
- In local dev (Express API), save writes to `src/products.json`
- On Vercel, save persists in **Vercel Blob** at `cms/products.json`

## Deploy to Vercel (single provider)

1. Import repo in Vercel
2. Add environment variables:
   - `CMS_USERNAME`
   - `CMS_PASSWORD`
   - `CMS_JWT_SECRET`
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Blob store)
3. Deploy
4. Open `/cms`, login, edit/save products

Notes:
- API routes are in `api/*` and run as Vercel Functions
- No separate backend host is needed on Vercel

## Purpose

This project is structured as a product catalog + company-presentation frontend for industrial metal packaging, with a strong visual style and bilingual content support.
