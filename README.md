# atlapps.monaidea.com

The pages of Monaidea's Atlassian apps: `/` lists them, and each app's own
pages are under `/<app>/` (`/ledgerstone/`, `/flagstone/`). Rules for anyone
changing it: `CLAUDE.md`.

A page under `pages/` holds content only. The stamper of the Monaidea brand
(repository `VestaNabu-LLC/monaidea`, folder `brand/`) writes the finished page
from it into this repository, at the page's path: it adds the stylesheet,
fonts, header, footer and scripts, checks every link inside the site, and
writes nothing if one page breaks a rule. The finished pages are committed, and
GitHub Pages serves `main` as it is. Pictures, videos and the guide's PDF sit
at the paths they are published at (`ledgerstone/media/…`). A check on every
push fails when the committed files are not what the stamper writes.

```sh
git clone --depth 1 https://github.com/VestaNabu-LLC/monaidea ../monaidea   # once; later: git -C ../monaidea pull
node ../monaidea/brand/stamp.mjs .            # then commit what it wrote
node ../monaidea/brand/stamp.mjs . --check
```

Until 2026-11-15 the two apps had a site each, `ledgerstone.monaidea.com`
(repository `ledgerstone-site`) and `flagstone.monaidea.com` (`flagstone-site`).
Every page kept its path: `https://ledgerstone.monaidea.com/guide/` is now
`https://atlapps.monaidea.com/ledgerstone/guide/`.
