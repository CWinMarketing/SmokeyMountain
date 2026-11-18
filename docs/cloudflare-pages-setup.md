# Deploying the new site to Cloudflare Pages

The static site lives in `site/` — plain HTML/CSS/JS, no build step required.

## 1. Deploy (free, no card required)

1. Sign up / log in at https://dash.cloudflare.com
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access the `CWinMarketing/SmokeyMountain` GitHub repo and select it.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave blank)
   - **Build output directory:** `site`
5. Deploy. Cloudflare gives you a temporary URL like `smokeymountain.pages.dev` — use this
   to test everything before touching your real domain.

## 2. Before going live, replace placeholders

- `site/shop.html` — replace the `href="#"` on the "Shop Now on Printify" button with your
  real Printify Pop-up Store URL (Printify dashboard → My Stores → Pop-up Store).
- Swap the gray placeholder `.media-box` divs across all pages for real `<img>` tags once
  you've exported photos/logos from Wix into `site/assets/`.

## 3. Point your domain at it (do this last, after testing)

Once you're happy with the `*.pages.dev` preview:

1. In Cloudflare Pages, go to the project → **Custom domains** → **Set up a custom domain**
   → enter `smokey-mountain-racing.com` (and `www.smokey-mountain-racing.com` if used).
2. If your domain's DNS isn't already on Cloudflare, you'll be walked through changing your
   nameservers at your domain registrar to Cloudflare's — this is the step that actually
   moves traffic off Wix, so don't do it until the new site is fully tested.
3. Wix will keep serving the site until this DNS change propagates (can take minutes to
   hours). Once confirmed working, you can cancel the Wix plan if desired.
