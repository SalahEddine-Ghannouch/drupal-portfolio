# Salah Eddine Ghannouch — Full-Stack Developer Portfolio

A single-page, fully responsive **full-stack developer** portfolio for
**Salah Eddine Ghannouch**, with a deep **specialization in Drupal** (which also
inspired the Drupal-blue theme). Built with plain **HTML / CSS / JavaScript** —
no build step, no dependencies. Just open `index.html`.

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

## Internationalization (EN / FR)

A lightweight, static-host-friendly mechanism — no framework required:

- Every translatable element carries a `data-i18n="key"` (plain text) or
  `data-i18n-html="key"` (rich text) attribute.
- All strings live in **`js/translations.js`** under `window.I18N.en` / `window.I18N.fr`
  (plus rotating-tagline words and the CV text per language).
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

## Deploy to Hostinger

This is a static site, so deployment is drag-and-drop simple:

1. In **hPanel → Files → File Manager**, open your domain's `public_html` folder.
2. Upload `index.html` and the `css/` and `js/` folders (keep the same structure).
   - Or zip the project, upload the zip, and **Extract** it inside `public_html`.
3. Visit your domain — done. (No Node/build needed; Google Fonts load over HTTPS.)

> Tip: keep `index.html` at the root of `public_html` so it's served as the homepage.

## Structure

```
drupal-portfolio/
├── index.html          # markup + content (with data-i18n keys)
├── css/styles.css      # theme tokens, layout, animations
├── js/translations.js  # EN + FR strings, rotator words, CV text
├── js/main.js          # interactions (i18n, theme, rotator, reveals, CV)
└── README.md
```

## Customize

- **Text / translations**: `js/translations.js` (both `en` and `fr`)
- **Structure & tags**: `index.html`
- **Colors, spacing, fonts**: CSS variables at the top of `css/styles.css`
- **Start year for experience**: change `data-years-since="2023"` in `index.html`

All content is realistic placeholder data — swap in your real projects and links.
