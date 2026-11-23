# acharius.design

Portfolio site for Acharius Fox, Lead Product Designer. Plain HTML, CSS, and a little JavaScript. No build step, no framework, no Webflow.

## What's here

```
index.html                         Home: hero with live modes, selected work, how I work, experience, contact
about/index.html                   About, coworker feedback, personal, education
art/index.html                     Photography and glitch art
live-event-platform/index.html     Master Tour case study (same URL as the Webflow site)
supplier-transfer/index.html       Parachute Health case study (same URL)
identity-theft-protection/         Discover case study (new URL; /itp redirects here)
patient-rounding/                  Press Ganey case study (new URL; /paitent-rounding-app redirects here)
demos/master-tour-dashboard.html   The interactive Master Tour Dashboard, embedded in its case study
404.html                           Not found page for GitHub Pages
assets/css/site.css                All styles. Tokens at the top: primitives, then dark and light roles
assets/js/site.js                  Modes, menu, lightbox, GIF pause, table of contents, copy email
assets/fonts/                      Instrument Sans and Instrument Serif (SIL Open Font License)
assets/img/                        Images (see step 1 below)
assets/AchariusFox_Resume.pdf      Résumé linked from the site (phone number left off on purpose)
scripts/                           Image download scripts and the image manifest
```

## 1. Download the images (once)

The images still live on Webflow's CDN. Every page points at local copies in `assets/img`, so pull them down once before you preview or publish. Pick one:

- **Windows PowerShell:** `powershell -ExecutionPolicy Bypass -File scripts\fetch-images.ps1`
- **Node 18+:** `node scripts/fetch-images.mjs`
- **GitHub:** nothing to do. The **Deploy site** workflow downloads any missing images and commits them on every push to `main`.

`scripts/image-manifest.json` lists every image, its local path, and its Webflow URL. Do this before you cancel Webflow, since the CDN copies go away with the site.

## 2. Preview locally

Double-click `index.html`. Links point at `index.html` files directly, so the site works straight from disk. For the closest match to production, run a tiny server from this folder instead:

```
python -m http.server 8000
```

then open http://localhost:8000.

## 3. Publish on GitHub Pages

1. The repo is `designed-by-fox/acharius-design`. Repo **Settings > Pages** has Source set to **GitHub Actions**.
2. Every push to `main` runs `.github/workflows/pages.yml`, which saves any missing images to the repo and deploys the site.
3. Check the site at `https://designed-by-fox.github.io/acharius-design/`. (The 404 page uses root-relative links, so it only looks right on the custom domain.)

## 4. Move www.acharius.design off Webflow

Do this when you're happy with the GitHub Pages version.

1. In **Settings > Pages > Custom domain**, enter `www.acharius.design` and save. GitHub adds a `CNAME` file to the repo.
2. At your DNS provider:
   - `www` CNAME record pointing to `designed-by-fox.github.io`
   - apex `acharius.design` A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - remove the old Webflow records
3. Once the DNS check passes, tick **Enforce HTTPS**.
4. Unpublish or downgrade the Webflow site after the new one is live.

## Editing

- Text lives right in the HTML files. Search for the sentence you want to change.
- Add `?review` to any URL (for example `index.html?review`) to outline every passage I drafted that still needs your eyes. Remove the `data-draft="..."` attribute from an element once you've approved or rewritten it.
- Colors, type sizes, spacing, and radii are CSS custom properties at the top of `assets/css/site.css`.
- Names of people, products, clients, and places are wrapped in `<span class="nm">`, which sets them in Instrument Serif italic. Keep that rule and the type system stays consistent.

## Accessibility

Built to WCAG 2.2 AA and checked with axe-core on every page, in both themes, at desktop and phone widths, with zero violations. Also checked by hand:

- Every text color pair is 4.5:1 or better, and controls are 3:1 or better against their background
- Keyboard: skip link, visible focus on everything, focus never hidden behind the sticky header, Escape closes the menu and the image viewer
- Targets are at least 24 by 24 px (most are 44)
- Reflows at 320 px wide with default and large text, no sideways scrolling
- Animated GIFs can be paused, and start paused when reduced motion is on
- Respects the operating system's reduced motion setting, plus an in-site Motion switch
- Theme and text size switches are standard radio buttons in labelled fieldsets
- Scrollable screenshots and the demo's scroll areas are keyboard focusable and labelled

When you add images, write alt text that says what the image shows and why it's there. Leave `alt=""` only on decorative images.
