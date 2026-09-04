# Water Valley Voice media

Use these folders for files that should be available directly on the website:

- `images/` — photographs, episode artwork, logos, and social cards
- `audio/` — short audio files hosted directly by the website
- `video/` — short video files hosted directly by the website
- `ads/episodes/` — optimized clickable episode-page creatives, organized by ad size

Use lowercase, descriptive filenames with hyphens, such as
`grainhouse-interview-01.jpg`. Large podcast episodes should stay on Podbean and
full-length videos should stay on YouTube; embedding those services keeps this
site fast and avoids unnecessary hosting and bandwidth costs.

Website-only Exclusives use the separate Cloudflare R2 media bucket. Put
original exports in the project's local `exclusive-sources/` folder, then
upload optimized copies to R2 under `exclusives/`. Their public URLs start with
`https://media.watervalleyvoice.com/exclusives/`; do not place large Exclusive
videos in this `public/` tree. See `docs/r2-media.md` in the project root.

The homepage currently uses the Podbean player and YouTube playlist directly.

The files ending in `-web.jpg` are smaller, website-ready copies of the original
brand images. Keep the full-resolution originals as the source material and use
the optimized copies in page code so the site remains quick on mobile devices.
