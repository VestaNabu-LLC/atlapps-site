# mapstoneapps.com

Mapstone Apps: `/` lists the products, and each one's pages are under its own
path: `/ledgerstone/`, `/flagstone/` (apps for Jira and Confluence Cloud) and
`/adminkits/` (workbooks for Jira admins). Rules for anyone changing it:
`CLAUDE.md`.

A page under `pages/` holds content only. The stamper, `brand/stamp.mjs`,
writes the finished page from it at the page's path: it adds the stylesheet,
fonts, header, footer and scripts (all from `brand/`), checks every link inside
the site, and writes nothing if one page breaks a rule. The finished pages are
committed, and GitHub Pages serves `main` as it is. Pictures, videos and the
guide's PDF sit at the paths they are published at (`ledgerstone/media/…`). A
check on every push fails when the stamper's tests fail or the committed files
are not what the stamper writes.

```sh
node --test brand/stamp.test.mjs
node brand/stamp.mjs .            # then commit what it wrote
node brand/stamp.mjs . --check
```

## Contact form

The form on `/` and on each app's support page posts to the Worker
`mapstoneapps-contact` at https://forms.mapstoneapps.com (source, tests and
settings in `worker/`; `GET https://forms.mapstoneapps.com/` shows whether its
two secrets are set). It checks Cloudflare Turnstile (site key `SITEKEY` in
`brand/contact.js`) and emails the message from noreply@mapstoneapps.com to
support@mapstoneapps.com through Postmark.

```sh
node --test worker/test/index.test.mjs
```
