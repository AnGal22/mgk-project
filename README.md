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

## Project Structure

```text
mgk-project/
├─ public/                  # Static assets (images, icons, video)
├─ src/
│  ├─ components/
│  │  ├─ Navbar.tsx         # Top navbar (scroll-aware visibility)
│  │  ├─ Links.tsx          # Main nav links
│  │  ├─ ItemNavBar.tsx     # Left-side icon navigation by category
│  │  ├─ section.tsx        # Product section + side panel + specs table
│  │  ├─ SidePanel.tsx      # Slide-out details panel
│  │  ├─ cans.tsx           # Decorative separator component
│  │  ├─ Contact.tsx        # Contact/info footer section
│  │  ├─ ProductNav.tsx     # Product navigation helper (if used)
│  │  └─ Product.tsx        # Product card component (generic)
│  ├─ App.tsx               # Main page composition and section orchestration
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

## Data Model

### `src/products.json`
Contains category entries such as:
- `drawn_round_cans_food`
- `drawn_rectangular_cans_1_4_club`
- `three_piece_welded_food`
- `three_piece_welded_powder_dairy`

Each entry includes:
- localized `name`, `short_description`, `description`
- `images[]`
- `schema_image`
- `icon`
- `specs` (array columns rendered into a table)

### `src/info.json`
Contains localized company intro:
- `title_desc.hr/en`
- `description.hr/en`

## Rendering Flow (High Level)

1. `App.tsx` initializes language (`hr` default) and hero animation flags.
2. Product category keys are loaded from `products.json`.
3. For each key, a `Section` component is rendered.
4. `Section` uses IntersectionObserver:
   - to trigger visual in-view animations
   - to report visibility back to `App` for left navigation behavior
5. Clicking **Specifikacije / Specifications** opens `SidePanel` with:
   - long description
   - schema image
   - dynamically generated specs table
6. `Contact.tsx` renders localized contact fields.

## Scripts

From `package.json`:

- `npm run dev` — start local development server
- `npm run build` — TypeScript build + production bundle
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Run Locally

```bash
npm install
npm run dev
```

Default Vite dev URL is typically:
- `http://localhost:5173`

## Notes / Current Caveats

- `Contact.tsx` currently uses placeholder details for some fields (address/phone/certificates hint).
- Component filename `section.tsx` is lowercase; this works, but standard React convention is PascalCase (e.g. `Section.tsx`).
- There are minor mixed-language comments and some temporary dev comments that can be cleaned for production readability.

## Purpose

This project is structured as a product catalog + company-presentation frontend for industrial metal packaging, with a strong visual style and bilingual content support.
