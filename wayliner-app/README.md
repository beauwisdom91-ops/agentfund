# Wayliner — Best Deals for Drivers

Wayliner is a polished, client-side web app that helps drivers (rideshare, delivery,
trucking, and everyday commuters) find and compare the best deals near them — fuel,
EV charging, parking, food, maintenance, car wash, and tolls/insurance.

> **Note:** There is no external deals API. All data is **seeded/mock data** bundled
> with the app (`src/data/deals.js`), so Wayliner is fully functional end-to-end offline.

## Tech stack

- **Vite** + **React 18** (JavaScript / JSX)
- Plain CSS (no UI framework)
- `localStorage` for saved-deal persistence
- Zero backend — a pure client-side SPA

## Getting started

```bash
cd wayliner-app
npm install
npm run dev
```

The dev server starts on **http://localhost:5173** (bound to `0.0.0.0`).

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serves the production build on http://localhost:4173
```

## Features

- **Deal grid** — 32 seeded deals, each with merchant, category, title, description,
  discount (with numeric `discountValue` / `discountType`), price/original price,
  distance, rating, expiry, city, and an emoji badge.
- **Categories** — Fuel/Gas, EV Charging, Parking, Food & Rest Stops,
  Maintenance & Tires, Car Wash, Tolls & Insurance. Filtering updates the list live.
- **Search** — live text filter across merchant, title, description, and city.
- **Sort** — Best discount (default), Nearest, Highest rated, Expiring soon.
- **Best Deals highlight** — a top section showcasing the highest-savings deals,
  plus a "Best Deal" badge on those cards.
- **Favorites / Save** — save/unsave deals (persisted to `localStorage`), a "Saved"
  view filter, and a live saved count in the header.
- **Deal detail modal** — full info plus a mock "Get Deal" action that returns a
  one-time redemption code.
- **Responsive UI** — mobile-friendly layout, hero summary bar, empty states, and a
  cohesive road/route color theme.

## Project structure

```
wayliner-app/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   ├── utils.js
│   ├── data/
│   │   ├── deals.js         # seeded deal dataset
│   │   └── categories.js
│   └── components/
│       ├── DealCard.jsx
│       └── DealModal.jsx
└── README.md
```

## Limitations

- Deals, distances, and ratings are **illustrative mock data**, not live offers.
- "Get Deal" generates a demo redemption code; it does not contact any merchant.
