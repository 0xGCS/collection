# Personal Compendium

A curated personal compendium of tools, websites, and platforms — organized and searchable in one place.

The site consists of two pages: a landing page and a filterable data table powered by Supabase. Users can browse, search, and filter 500+ entries across categories and subcategories, with support for light and dark mode.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Routing | React Router v6 |
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
