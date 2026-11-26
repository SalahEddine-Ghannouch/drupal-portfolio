# Salah Eddine Ghannouch — Full-Stack Developer Portfolio

A single-page, fully responsive **full-stack developer** portfolio for
**Salah Eddine Ghannouch**, with a deep **specialization in Drupal** (which also
inspired the Drupal-blue theme). Built with plain **HTML / CSS / JavaScript** —
no build step. Supabase is optional; the portfolio also runs on its local data.

## Features

- **9 sections**: Hero, About, Expertise, Featured Projects, Experience timeline,
  Certifications & Community, Testimonials, Contact, Footer.
- **Bilingual (EN / FR)** with a language toggle — see *Internationalization* below.
- **Animated rotating tagline** (localized) — e.g. *Full-Stack Developer → Drupal Specialist → Backend Engineer → Frontend Developer*.
- **Light / dark mode toggle** with a smooth 300 ms transition (remembered).
- **Dynamic years of experience** — computed as `currentYear − 2023`, so it never goes stale.
- **Drupal-inspired palette**: Drupal Blue `#0678BE`, Aqua `#00B4D8`, Amber CTA `#FFB400`,
  Navy gradient `#0A1F3D → #001833`.
- **Motion**: staggered scroll reveals, hover-lift/zoom project cards, button ripples,
  drifting "water drop" hero shapes, frosted-glass navbar on scroll, scroll-to-top button.
- **Accessibility**: semantic landmarks, skip link, keyboard nav, focus styles, `aria`
  attributes, and full **`prefers-reduced-motion`** support.
- **Generated CV download** (localized EN/FR text file).
- **Optional Supabase backoffice** at `/admin/` for EN/FR portfolio text and links.
- **Admin MFA**: TOTP verification is required by the backoffice and database
  policies.
- **Portfolio entry management**: add, edit, publish, reorder, and delete projects,
  expertise items, experience, open-source modules, certifications, and testimonials.

## Internationalization (EN / FR)

A lightweight, static-host-friendly mechanism — no framework required:

- Every translatable element carries a `data-i18n="key"` (plain text) or
  `data-i18n-html="key"` (rich text) attribute.
- All strings live in **`js/translations.js`** under `window.I18N.en` / `window.I18N.fr`
  (plus rotating-tagline words and the CV text per language).
- When configured, Supabase overrides the local strings; local translations
  remain the fallback if the database is unavailable.
- **`js/main.js`** swaps the text on load and whenever the language toggle is clicked,
  sets `<html lang>`, and **remembers the choice in `localStorage`**. First-time visitors
  are auto-detected from their browser language (falls back to English).

**Add a language:** add a new block (e.g. `ar`, `es`) to `window.I18N` in
`js/translations.js`, add it to `SUPPORTED` in `js/main.js`, and you're done.
**Add a string:** add the key to both `en` and `fr` and reference it with `data-i18n`.

## Typography

- Headings: **Space Grotesk** · Body: **Inter** · Code accents: **JetBrains Mono** (Google Fonts)

## Run locally

```bash
xdg-open index.html
# or serve it (recommended)
python3 -m http.server 8000   # http://localhost:8000
```

## Supabase backoffice

Follow [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) to create the database,
enable TOTP MFA, allowlist an admin account, configure the public project key,
and publish the initial EN/FR content. The backoffice manages the portfolio
text and the project, expertise, experience, open-source, certification, and
testimonial entries. Section layout and styling remain code-managed.

## Deploy to Cloudflare Pages

This is a static site and requires no build command:

1. Connect the repository in **Workers & Pages → Create → Pages**, or use
   **Direct Upload**.
2. Leave the build command empty and set the output directory to the project
   root. Include `_headers`, `index.html`, `admin/`, `css/`, and `js/` in that
   output directory.
3. Add the custom domain in Cloudflare Pages and enable **Always Use HTTPS**.

Cloudflare Pages applies the admin security headers from `_headers`. If the
Supabase project uses a custom hostname instead of `*.supabase.co`, update the
admin Content Security Policy before deploying.

## Structure

```
drupal-portfolio/
├── index.html          # markup + content (with data-i18n keys)
├── css/styles.css      # theme tokens, layout, animations
├── js/translations.js  # EN + FR strings, rotator words, CV text
├── js/main.js          # interactions (i18n, theme, rotator, reveals, CV)
├── js/content.js       # optional Supabase content loading
├── js/portfolio-items.js # safe rendering for database-backed entries
├── _headers            # Cloudflare Pages security headers for /admin/
├── admin/              # Supabase Auth backoffice
├── supabase/migrations/ # database schema and row-level security
└── README.md
```

## Customize

- **Text / translations**: `/admin/` after Supabase setup, or `js/translations.js` locally
- **Structure & tags**: `index.html`
- **Colors, spacing, fonts**: CSS variables at the top of `css/styles.css`
- **Start year for experience**: change `data-years-since="2023"` in `index.html`

All portfolio strings have local EN/FR defaults in `js/translations.js`.
