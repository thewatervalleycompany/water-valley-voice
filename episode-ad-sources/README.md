# Drop episode ad files here

Place each original image or GIF in the folder matching its designed size:

- `300x600/` — desktop right-rail creative
- `728x90/` — mobile creative above the Watch section
- `970x250/` — responsive creative between the description and share panel

These source files are intentionally ignored by Git and are not published to
the website. This prevents an unoptimized upload from being sent to every site
visitor. When a creative is ready, it will be resized or converted as needed,
copied to `public/media/ads/episodes/`, and connected to its destination URL in
`src/data/episode-ads.ts`.

Please include the destination URL and a short description of what the image
promotes when asking for an ad to be published.
