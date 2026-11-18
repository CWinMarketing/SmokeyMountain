# Smokey Mountain Racing — Site Rebuild

**Current direction:** migrating off Wix to a self-hosted static site on Cloudflare Pages,
with merch checkout handled by a Printify Pop-up Store. See `docs/cloudflare-pages-setup.md`
to deploy and go live.

## Contents

- `site/` — the new static site (plain HTML/CSS/JS, no build step). Deploy this to
  Cloudflare Pages.
- `docs/cloudflare-pages-setup.md` — how to deploy the site and cut the domain over from Wix.

## Status

**In progress:** core pages (Home, Driver Roster, Charity Races, League Racing, Shop)
built with placeholder images and real site copy. Still needed before launch:
- Real photos/logos exported from Wix (or original source files) dropped into `site/assets/`.
- The real Printify Pop-up Store URL in `site/shop.html`.
- Testing on the `*.pages.dev` preview URL before DNS cutover.

## Archived: Wix Studio redesign (superseded)

- `design-system/smr-custom.css` and `docs/wix-studio-implementation-guide.md` were built
  for an earlier plan to redesign the site in place on Wix Studio. Kept for reference in
  case the Wix site needs touch-ups before the new site goes live, but no longer the
  primary direction.
