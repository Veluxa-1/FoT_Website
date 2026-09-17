# FoT_Website

Static marketing site for Futa on Top / Futa Heim.

## Notes

- Age gate is a **one-time** popup on first visit (`localStorage.ageConfirmed`).
- Throxxa dating profile lives in `index.html#throxxa` (responsive two-page layout with 4:5 portraits). `throxxa.html` redirects there.
- Free Patreon posts: `node scripts/fetch-patreon-posts.mjs` (also runs on deploy).
- Throxxa web images: `images/throxxa/throxxa-01.webp` / `throxxa-02.webp` (source PNGs kept alongside).
