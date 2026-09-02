# Episode page ads

These folders contain the optimized, web-ready creatives used by the live
website:

- `300x600/` — desktop right-rail placement
- `728x90/` — mobile placement between the episode hero and video section
- `970x250/` — mobile placement between the full description and share panel

Original uploads should be placed in the matching folder under
`episode-ad-sources/`, not here. The website scales each published creative to
the available width while preserving its original aspect ratio. An empty
placement is not rendered, so no blank ad box appears on the site.

When publishing a creative, provide its destination URL and concise alternative
text. Optimize a static source to WebP (and an animated source to animated WebP
when it produces a meaningful size reduction), then configure it in
`src/data/episode-ads.ts`. Sitewide defaults and per-episode overrides are both
supported there.

Use lowercase, descriptive filenames, for example
`discovery-air-fall-2026.webp`. Do not replace a live file with unrelated art;
use a new filename so Cloudflare and browser caches cannot show stale artwork.
