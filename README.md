# acharius.design

The portfolio of **Acharius Fox**, Lead Product Designer in Chicago. Case studies in consumer mobile apps, design systems, and accessibility.

**Live site:** https://designed-by-fox.github.io/acharius-design/

## About the build

Plain HTML, CSS, and a small amount of vanilla JavaScript. No framework, no build step, no tracking. Every page works straight from disk or from any static host.

- **Design tokens.** Colors, type, spacing, and radii are CSS custom properties at the top of `assets/css/site.css`: primitives first, then semantic roles for the dark and light themes.
- **Modes.** Theme, text size, and motion are stored per browser and applied to `<html>` before first paint, so pages never flash the wrong theme. The home page hero lets visitors switch them and shows live contrast ratios for the text.
- **Type.** Instrument Sans for everything, with Literata italic reserved for names of people, products, clients, and places (`<span class="nm">`).
- **Interactive demo.** `demos/master-tour-dashboard.html` rebuilds the Master Tour mobile Dashboard in code, driven by a primitives collection and a semantic collection, with theme, device, and text size modes.

## Structure

```
index.html                           Home: hero, selected work, how I work, experience, contact
about/                               About, coworker feedback, personal, education
art/                                 Photography and glitch art
live-event-platform/                 Case study: Master Tour mobile redesign and design system
garage-appraiser/                    Case study: The Garage Appraiser, an AI app built with Claude Code
supplier-transfer/                   Case study: Supplier Transfer at Parachute Health
identity-theft-protection/           Case study: Discover Identity Theft Protection
patient-rounding/                    Case study: Press Ganey iRound
hero-options/                        Hero previews for review (noindex, not linked)
itp/                                 Short link that redirects to identity-theft-protection/
demos/master-tour-dashboard.html     Interactive Dashboard demo, embedded in its case study
404.html                             Not found page
assets/css/site.css                  Tokens and all styles
assets/js/site.js                    Modes, menu, image viewer, pausable GIFs, table of contents, copy email
assets/fonts/                        Instrument Sans and Literata italic
assets/img/                          Images, one folder per page or case study
assets/AchariusFox_Resume.pdf        Resume
.github/workflows/pages.yml          Deploys to GitHub Pages on every push to main
```

## Run it locally

Open `index.html` in a browser. For the closest match to production, serve the folder instead:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Deploy

Every push to `main` runs `.github/workflows/pages.yml`, which publishes the repository root to GitHub Pages. In the repository settings, **Pages > Source** is set to **GitHub Actions**.

To serve the site from a custom domain, enter it under **Settings > Pages > Custom domain**, add the DNS records GitHub lists, and turn on **Enforce HTTPS** once the check passes. The 404 page uses root-relative links, so it displays correctly on a custom domain.

## Editing

- Text lives in the HTML files.
- Add `?review` to any page URL to outline passages marked with a `data-draft` attribute. Remove the attribute once a passage is final.
- When adding images, describe what the image shows in its `alt` text, and use `alt=""` only for decorative images. Set `width` and `height` so the layout doesn't shift while images load.

## Accessibility

Built to WCAG 2.2 AA and checked with axe-core on every page, in both themes, at desktop and phone widths.

- Text meets 4.5:1 contrast or better, and controls meet 3:1 against their background
- Skip link, visible focus on every control, and focus is never hidden behind the sticky header
- Targets are at least 24 by 24 px, most are 44
- Reflows at 320 px wide with default and large text, with no sideways scrolling
- Animated GIFs can be paused, and start paused when reduced motion is on
- Respects the system's reduced motion setting, plus an in-site Motion switch
- Mode switches are standard radio buttons in labelled fieldsets
- Scrollable screenshots and the demo's scroll areas are keyboard focusable and labelled
- Escape closes the mobile menu and the image viewer, and focus returns to where it was

## Credits and rights

Fonts: Instrument Sans by the Instrument Sans Project Authors and Literata by TypeTogether, both under the SIL Open Font License 1.1.

Case study text, images, and screenshots © 2026 Acharius Fox, shown as portfolio work. Product screens remain the property of their respective companies. Please don't reuse them.
