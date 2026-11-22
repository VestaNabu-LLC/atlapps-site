# Read this first (every Claude session in this repo)

**mapstoneapps.com** (until 2026-11-22 atlapps.monaidea.com, which forwards
here): the pages of Monaidea's Atlassian apps, and of Admin Kits, workbooks for
Jira admins (until 2026-11-22 at adminkits.monaidea.com, which forwards to
`/adminkits/`). `/` lists them; each app's own pages are under `/<app>/`
(`/ledgerstone/`, `/flagstone/`), Admin Kits' under `/adminkits/`.
The business rules of the apps are in `CLAUDE.md` of `VestaNabu-LLC/ledgerstone`
(it wins business-wide) and of `VestaNabu-LLC/flagstone`; they bind here too.
Decisions about the brand and the sites live in the owner's claude.ai Project
"StandAloneHarnessed" (`claude/decision-log.md` and its addenda).

## Who writes what

| What | Who | Where |
|---|---|---|
| The words of an app's pages | the apps' own workers (the weekly planner; its instructions are `docs/PLANNER-TASK.md` in `ledgerstone`) | `pages/<app>/` here |
| An app's pictures, videos and PDF | the same | `<app>/media/`, `<app>/guide/…`: the paths they are published at |
| The family page `/` and the 404 page | the owner's Project | `pages/index.html`, `pages/404.html` |
| Admin Kits' pages and pictures | the owner's Project | `pages/adminkits/`, `adminkits/…` |
| The look, the header, the footer, the fonts, the scripts | the owner's Project | repo `VestaNabu-LLC/monaidea`, folder `brand/`. **Never by hand here** |
| The finished pages, `style.css`, `site.js`, `contact.js`, `fonts/`, `sitemap.xml`, `robots.txt`, `_config.yml` | the stamper, and nobody else | every `.html` outside `pages/`, and those files at the root |
| An app's bar (its name, its mark, its pages) and the footer note | whoever adds a page or an app | `site.json` |

## A page is content only

```html
<title>What the page is</title>
<meta name="description" content="One or two sentences.">
<main>
  …the content, with the classes of the brand's stylesheet (monaidea: brand/css/site.css)…
</main>
```

Nothing else. The stamper (`brand/stamp.mjs` in `monaidea`; the exact rules are
at the top of that file) writes the finished page from it, at the same path
outside `pages/` (`pages/ledgerstone/guide/index.html` becomes
`ledgerstone/guide/index.html`), adding the stylesheet, the fonts, the header
and footer, the scripts, the page's address and its icon. It **writes nothing**
when a page has a `<script>`, `<style>`, `<link>` or `<iframe>`, a `style` or
`on…` attribute, a class the stylesheet does not know, a link that is not
`#…`, `/…`, `https://…` or `mailto:…`, or a link inside the site that leads
nowhere (the page, the file, or the `id` after a `#`).

**GitHub Pages serves `main` as it is: what is committed is what is live.** So:

1. Edit the page under `pages/` (never the finished one).
2. `git -C ../monaidea pull`, then `node ../monaidea/brand/stamp.mjs .` (clone
   `monaidea` next to this repo once).
3. Commit the source and what the stamper wrote, together, and push.
4. Check the run: `gh run list -R VestaNabu-LLC/mapstoneapps-site -L 1`. A red check
   means the committed files are not what the stamper writes (a page edited by
   hand, a forgotten stamp, or a brand that changed since): the live site is
   stale or off-brand, so fix it at once. The owner chose this over publishing
   through GitHub Actions (2026-11-15: "I don't care if something does not
   look right... we can fix it").

- **Never work around a refusal.** Fix the page. If a page needs a look the
  brand does not have, ask in the owner's Project: it goes into the brand
  first, then every site has it.
- Links inside the site are written from the root: `/ledgerstone/guide/`, never
  `guide/` or `https://mapstoneapps.com/…`.
- `pages/` holds pages only. A picture, a video or a PDF goes at the path it is
  published at, and a page links to it from the root (`/ledgerstone/media/…`).

## Rules

- **Every page keeps its address.** Marketplace listings, the released apps,
  the Forge console and search engines link to them: `/<app>/`,
  `/<app>/guide/`, `/<app>/support/`, `/<app>/privacy/`, `/<app>/security/`,
  and Ledgerstone's `/ledgerstone/jira-permission-audit-checklist/` and
  `/ledgerstone/jira-access-review-soc2-iso27001/`, and `/adminkits/` and
  `/adminkits/jira-permission-audit/` (Creem's product and searches link to
  them). Never rename or remove a
  page's folder. Each support page keeps `id="contact"` on its form section,
  and Flagstone's keeps the topic "Reminders request": the released Flagstone
  app links to `/support/?topic=reminders-request#contact` on its old host,
  which forwards here with the path kept.
- **Legal texts** (each app's `privacy/` and `security/`): no wording change
  without the owner's yes. The two `security/` pages are one text, Monaidea's
  security policy: change both or neither. Keep it in step with
  `docs/SECURITY.md` in `ledgerstone`, without lab internals.
- What a page says about an app (price, permissions, what is stored, what it
  cannot do) must be true of the released app. Prices and scopes are the
  owner's decisions.
- Screenshots must not show the company name or people's names (owner,
  2026-10-17): blur them and say so in the caption.
- The guide's PDF (`ledgerstone/guide/Ledgerstone-Guide.pdf`) is printed from
  the guide's page: after changing the guide, run the stamper, then
  `node tools/guide-pdf.mjs`, and commit the new PDF with the page.
- No other company on a page: no fonts, scripts, analytics or embeds from
  elsewhere. The contact form (Monaidea's Worker at forms.monaidea.com, with
  Cloudflare Turnstile) is the one exception, and Admin Kits' payment link
  (Creem).
- Admin Kits: the price, the refund terms (14 days) and what the buyer
  receives are the owner's decisions; a page says what is true of the product.
  "Not affiliated with Atlassian" and the trademark note stay in the footer
  (`site.json`).
- Never commit secrets, tokens, email addresses of people or personal data.
- Content goes to `main` directly or by pull request; either way the `check`
  run says whether the site is what the stamper writes. Commit messages end with the attribution lines the session
  provides.
- Never say something is done without evidence: say which of written, built,
  published or seen working it is.

## The owner

Seb, for VestaNabu LLC (public name **Monaidea**). He talks to Claude only
through claude.ai. Write to him short, direct, table-first; what he must do as
a numbered list of at most 3 steps, exact enough for a non-technical person.
Claude has no browser access to his accounts: he does the browser steps
(GitHub settings, DNS, the Atlassian consoles) himself.
