# Smokey Mountain Racing — Redesign Implementation Guide (Phase 1: Home + Driver Roster)

Scope of this phase: fix layout, contrast, typography consistency, and mobile/responsive
behavior on the **Home** and **Driver Roster** pages. No new features yet.

This site is built on **Wix Studio**, so the design system below is delivered as real,
reusable CSS you paste into Wix's Custom CSS panel, plus custom classes you assign to
elements in the editor. Editor-level layout fixes (breakpoints, element resize behavior)
have to be done by hand in the Wix Studio Editor — Wix doesn't allow that part to be
scripted from outside.

## Step 0 — Install the CSS

1. Open the site in **Wix Studio Editor**.
2. Top left: **Site** menu > **Custom CSS**.
3. Paste the full contents of `design-system/smr-custom.css` (in this repo) into the panel and save.
4. Add the two Google Fonts referenced by the CSS (`Orbitron` and `Barlow`):
   Site menu > **Site Fonts** (or Text theme settings) > add both as custom fonts. If Studio's
   font picker doesn't support arbitrary Google Fonts directly, use **Custom Code** (Site
   Settings > Custom Code) to inject this into the site header instead:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
   ```

## Step 1 — Fix the overflow bug (do this first, it's the critical one)

At normal 100% browser zoom, the Blue Ridge Racing logo (left) and Appalachian Mountain
Autosport logo (right) run off the edge of the viewport instead of scaling down, and the
"SMR Charity Races" / "League Races" headers get clipped. This means the header section is
wider than the browser window on at least some screen sizes.

1. Select the header **section/strip** containing the three logos.
2. Open the **Breakpoints** panel (top toolbar). Check Desktop, Tablet, and Mobile — in
   at least one of these, the section or the flanking logo images are likely set to a
   fixed pixel width/position rather than a responsive one.
3. Select each flanking logo image individually. In the **Layout/Responsive** panel, set
   its resize behavior so it scales with its container rather than staying pinned at a
   fixed size — the logos should shrink before they get clipped.
4. Add the `smr-no-overflow` custom class (from the CSS file) to the header section and
   to both flanking logo images as a safety net.
5. Repeat the same check for the "SMR Charity Races" / "League Races" headings — reduce
   their font size at the Tablet and Mobile breakpoints so the text doesn't outgrow its
   column.

## Step 2 — Add a real mobile nav

The current nav is a single-row pink pill (Home / Driver Roster / Charity Races / League
Racing) with no mobile fallback.

1. In the **Mobile** breakpoint, swap the horizontal nav strip for Wix Studio's built-in
   **Mobile Menu** (hamburger) component.
2. Keep the same 4 links; verify the active-page underline style still shows correctly
   inside the mobile menu.

## Step 3 — Apply the design system classes

Assign these custom classes to existing elements (Design panel > Custom Class field):

| Element | Class |
|---|---|
| "EVENTS", "SPONSORS", "TEAM STORE" section headings | `smr-h1` |
| "SMR Charity Races", "League Races", team names on Driver Roster | `smr-h2` |
| Paragraph/body text (e.g. Charity Races description) | `smr-body` |
| Fine print / captions | `smr-body-dim` |
| "Register", "More Info", "View More", "Schedules and Info" buttons | `smr-btn-primary` |
| "Points Standings", "Latest Race Results" — **convert these from plain text links to real Button elements first**, then style | `smr-btn-secondary` |
| Individual event/driver/sponsor tiles — wrap each in a container box | `smr-card` |
| Every other major section (alternate Events / Team Store / Sponsors backgrounds) | `smr-section-alt` |

On the Driver Roster page specifically:
- Apply `smr-h2` to "SMOKEY MOUNTAIN RACING", "BLUE RIDGE RACING", "APPALACHIAN MOUNTAIN
  AUTOSPORT" section headings, then layer `smr-team-blueridge` / `smr-team-appalachian`
  on top of the latter two so each sub-team keeps its own accent color instead of all
  three competing for the same pink/yellow.
- Wrap each driver's photo + name in a `smr-card` box so spacing is consistent across all
  9 drivers instead of floating independently.
- Check the Breakpoints panel on the driver grid/repeater: it should go 4-across on
  desktop, 2-across on tablet, 1-across on mobile. Confirm this explicitly — it wasn't
  verifiable from static screenshots.

## Step 4 — Content/structure cleanup

- Move the **Sponsors** section (currently duplicated in full on every page) into a
  site-wide footer region instead, so it's maintained once and stays consistent —
  Studio supports reusable header/footer sections across pages.
- Replace individual driver-name logo images with real text elements styled via
  `smr-h2`/custom font — keep image logos only for the three team brand marks
  (Smokey Mountain Racing / Blue Ridge Racing / Appalachian Mountain Autosport).
  Improves accessibility, SEO, and lets names be edited without regenerating graphics.
- Clean up or remove the low-resolution/cropped image in the bottom-right corner of the
  Sponsors grid.

## Out of scope for this phase (flag for phase 2)

- Charity Races and League Racing pages (design system above already applies cleanly
  once you're ready — same classes, same steps).
- Replacing the pasted-in schedule spreadsheet screenshots on League Racing with a real,
  responsive table/repeater.
- Any new functionality (registration flow, standings data, etc.) — this pass is layout/
  design only, per the agreed scope.

See `design-system/smr-custom.css` for the full palette and class reference.
