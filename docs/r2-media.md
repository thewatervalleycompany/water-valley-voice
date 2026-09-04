# R2 media for Exclusives

## Setup status

R2 was activated on September 4, 2026 after approval of its recurring,
usage-based subscription. The `water-valley-voice-media` bucket exists with
Standard storage in Western North America. After explicit approval of public
access, `media.watervalleyvoice.com` was connected through R2 and its status
was verified as Active with access Enabled. The first optimized Exclusive is
published at `exclusives/ryan-bach-hockey-fights-v1.mp4`.

## Configuration

- Bucket: `water-valley-voice-media`
- Storage class: Standard, which is eligible for the R2 free allowance
- Location: automatic (Western North America)
- Media domain: `https://media.watervalleyvoice.com`
- Public development URL (`r2.dev`): disabled
- Object paths: `exclusives/<descriptive-title>-v1.mp4`

The media domain was unused before setup. Cloudflare created its DNS record
and HTTPS configuration through the bucket's Custom Domains settings.

Verification on September 4, 2026: normal DNS and an HTTPS HEAD request to the
first video returned HTTP 200, `Content-Type: video/mp4`,
`Content-Length: 60526591`, and `Accept-Ranges: bytes`. Requests for the first
and last 1,024 bytes returned HTTP 206 and matched the local optimized file.
Cloudflare delivered `Cache-Control: max-age=14400`.

The 191.425-second source was reduced from 187,936,048 to 60,526,591 bytes
(67.79% smaller), using 1920×1080 H.264 video and AAC stereo audio. Fast-start
metadata precedes video data. Full audio/video decoding passed without errors;
video duration and frame count match the original, and audio duration differs
by less than one millisecond. The source and optimization report remain local
under `exclusive-sources/`.

This bucket is for published website media. Source exports stay in the local
`exclusive-sources/` folder. Only upload reviewed, optimized delivery copies.

## Upload and playback

Open [the media bucket in Cloudflare](https://dash.cloudflare.com/f4db3b90ed0ac2cc81338afdd04e568d/r2/default/buckets/water-valley-voice-media),
open `exclusives/`, and upload the optimized file there. Set MP4 content type to
`video/mp4`. When available, set `Cache-Control` to
`public, max-age=86400`. Use a new versioned filename when replacing an export.

The website can use a native video player with the custom-domain object URL.
Direct playback does not require adding an R2 binding to the static Astro site.
Plain native video playback without a `crossorigin` attribute does not require
a CORS policy. Add an explicit read-only CORS policy if a future player uses
cross-origin JavaScript requests or a `crossorigin` attribute.

After the first upload, verify HTTPS, `Content-Type`, file length, and a byte
range request returning HTTP 206. Check video playback, audio, and seeking in
the website player before publishing an Exclusive.

## References

- [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [R2 custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [Upload objects](https://developers.cloudflare.com/r2/objects/upload-objects/)
- [Use R2 for Pages media](https://developers.cloudflare.com/pages/tutorials/use-r2-as-static-asset-storage-for-pages/)
