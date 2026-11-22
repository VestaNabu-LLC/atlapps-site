# mapstoneapps.com

The pages of Monaidea's Atlassian apps and of Admin Kits: `/` lists them, each
app's own pages are under `/<app>/` (`/ledgerstone/`, `/flagstone/`) and Admin
Kits' under `/adminkits/`. Rules for anyone changing it: `CLAUDE.md`.

A page under `pages/` holds content only. The stamper (`brand/stamp.mjs`, from a copy
of the Monaidea brand taken on 2026-11-22, Mapstone's own since) writes the finished page
from it into this repository, at the page's path: it adds the stylesheet,
fonts, header, footer and scripts, checks every link inside the site, and
writes nothing if one page breaks a rule. The finished pages are committed, and
GitHub Pages serves `main` as it is. Pictures, videos and the guide's PDF sit
at the paths they are published at (`ledgerstone/media/…`). A check on every
push fails when the committed files are not what the stamper writes.

```sh
node brand/stamp.mjs .            # then commit what it wrote
node brand/stamp.mjs . --check
```

Until 2026-11-15 the two apps had a site each, `ledgerstone.monaidea.com`
(repository `ledgerstone-site`) and `flagstone.monaidea.com` (`flagstone-site`);
then, until 2026-11-22, this site was at `atlapps.monaidea.com`. Every page
kept its path: `https://ledgerstone.monaidea.com/guide/` and
`https://atlapps.monaidea.com/ledgerstone/guide/` are now
`https://mapstoneapps.com/ledgerstone/guide/`, and the old addresses forward
there (the owner's Cloudflare rules, in monaidea.com's account). Admin Kits
was at `adminkits.monaidea.com` (repository `adminkits-site`) until 2026-11-22:
`https://adminkits.monaidea.com/jira-permission-audit/` is now
`https://mapstoneapps.com/adminkits/jira-permission-audit/`.
