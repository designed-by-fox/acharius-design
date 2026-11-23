# Review notes for Fox

Everything I wrote that isn't your existing copy is listed here, and it's outlined on the site itself when you add `?review` to a URL. Your case study text is kept as written, reorganized into scope, process, decisions, designs, outcomes, and reflection. I made light edits only to fit the new structure (splitting long paragraphs, fixing a couple of typos, swapping em dashes for commas or colons).

## Drafted copy to approve or rewrite

### Home
- **Availability line:** "Acharius Fox, lead product designer in Chicago. Open to new roles."
- **Headline:** "I design mobile apps and the design systems that hold them together."
- **Modes panel note:** "This site runs on design tokens, like the apps I design. Pick a mode and every page follows."
- **Work intro:** "Shipped products in live events, healthcare, and financial services."
- **Card titles and summaries** for all four projects. Titles now say what changed instead of naming the product category ("Rebuilding the Master Tour app for 60,000 people on tour" instead of "Live Event Platform").
- **How I work:** all four short paragraphs (design systems, mobile and tablet, accessibility, AI in the workflow).
- **Contact:** "I'm looking for Lead and Senior product design roles in Chicago or remote, especially on consumer mobile apps and design systems. Email is the fastest way to reach me."
- **Footer credit:** "Designed by Fox and built in plain HTML and CSS with Claude Code. Hosted on GitHub Pages."

Your philosophy paragraph and the Option B intro stay in the hero, word for word (Option B starts with "I focus on mobile apps and design systems," as suggested in the portfolio review chat).

### Master Tour
- Title and subtitle second sentence.
- TL;DR "What I did" and "The outcome."
- Trade-offs for decisions 1 and 2, and the pull quote "Fifteen beta interviews caught a layout problem we would otherwise have shipped to 60,000 people." The second half is a strong claim, so cut it if it overstates.
- "The result" for decision 4 and "How it evolved" for decision 5.
- **Reflection (both cards).** These are my guesses and need your voice most of all. Hiring managers read reflections for judgment, so a real lesson beats a polished one.

### Supplier Transfer
- Title.
- "The situation" for both decisions.
- Metric label "scoped from the flows so the team could ship in stages." I didn't say both MVPs shipped by June 2022 because I couldn't confirm it.

### Identity Theft Protection
- Title and TL;DR outcome.
- Decision 1 "What it informed" is a placeholder asking for the usability test result. **Which flow won, and what changed because of it?** That's the single most useful sentence you could add to this page.
- The last sentence of "What I'd do differently."
- Snapshot role: "UX Design Analyst, then Senior UX Design Analyst, at Kin + Carta."

### Patient Rounding
- Title and TL;DR outcome.

### About
- First intro sentence, and the one-line education intro. Your "About me" paragraph, the FAQ answers, and the coworker quotes are word for word.

### Art
- "Some pieces carry my handle, radiantrepose."

## Decisions I made that you may want to change

1. **Hosting.** You didn't pick an option, so I built everything locally and didn't create a repo or publish anything. README steps 3 and 4 cover GitHub Pages and the domain move. Webflow stays live until you switch DNS.
2. **URLs.** Master Tour and Supplier Transfer keep their Webflow URLs, so links in applications you've already sent still work. `/itp` and the misspelled `/paitent-rounding-app` redirect to `/identity-theft-protection/` and `/patient-rounding/`.
3. **Websites section.** The live Art page says "coming soon," which reads as unfinished to a reviewer, so I left that section out. Send me the URLs (PUG Mortgage, Keegan's site, and so on) and I'll add a Websites section with live links.
4. **Farm-to-School Procurement** stays out, matching the hidden Webflow page.
5. **Résumé PDF.** I made `assets/AchariusFox_Resume.pdf` from your master résumé with the same text, minus your phone number, since it's a public link. Swap in your own export if you prefer.
6. **Dashboard demo colors.** The shipped app uses iOS system colors, and a few small-text pairs fall under 4.5:1. I nudged the accent and tertiary text a shade in each theme so the demo passes AA, and added a sentence saying so. Revert in `demos/master-tour-dashboard.html` if you'd rather show the exact shipped colors.
7. **Coworker quotes** have no names, as on the live site. If any of those coworkers would let you name them with their title, attributed quotes carry a lot more weight.
8. **Cover images.** The old white-background mockups looked dated on the new dark cards, so project cards and case study covers now use your real released screens in simple CSS device frames. The old cover images are still used for link previews when a case study is shared.

## What would raise interview rates the most

These came out of the research below and last month's portfolio review. In order of impact:

1. **One number per case study.** Every case study now has an outcome section, but most of it is scale and shipping dates, not change. Anything real helps: App Store rating before and after, support tickets, Dashboard usage, how often the More menu gets customized, Supplier Transfer volume, how many orders stopped getting canceled.
2. **The ITP test result** (see above).
3. **Reflections in your own words** on Master Tour.
4. **A Garage Appraiser case study** to show AI as a material, which your target roles increasingly ask about.
5. **Named testimonials,** if you can get permission.

## What the research says converts (short version)

- Reviewers decide fast. Homepages get roughly 10 to 15 seconds and a whole portfolio a few minutes, so role, level, and the best work need to be in the first screen. The hero and the first project card are both visible above the fold on desktop, and the first card peeks into view on a phone.
- Two to four strong case studies, one click from the homepage, with the outcome first and the story after.
- Hiring managers look for decisions and trade-offs more than process diagrams. Each case study now has a "Key decisions" section laid out as situation, choice, and trade-off.
- Missing outcomes are the most common reason a senior portfolio stalls. A clear before-and-after matters more than polish.
- Clear role and ownership ("I" versus "we") builds trust. Your precise attribution ("I interviewed 15 of 20," "I conducted 2 and took part in 12") is kept everywhere.
- Low visual quality, confusing navigation, dense text, and obvious AI writing are the top red flags. That's why your own words stay, and why anything I drafted is flagged for you.
- Shipped, traceable work beats concepts: Master Tour now links straight to the App Store and Google Play.
