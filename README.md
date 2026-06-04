# Personal Compendium

A curated personal compendium of tools, websites, and platforms — organized and searchable in one place.

The site includes a landing page, a filterable directory table, item detail pages, and a placeholder Twitter page. Users can browse, search, and filter 500+ entries across categories and subcategories, drill into individual items, and use the app in light or dark mode.

## Routes

- `/` — landing page
- `/toooooooooools` — filterable directory table
- `/toooooooooools/:itemId` — item detail page
- `/twitter` — placeholder page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Routing | React Router v7 |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React + inline SVGs |
| Font | Space Grotesk |
| Deployment | Vercel |

---

## Getting Started

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

### Environment Variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
