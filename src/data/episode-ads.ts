export type EpisodeAdPlacement = "desktopTower" | "mobileTop" | "lowerBanner";

export interface EpisodeAd {
  /** Public path to the optimized image or animated GIF/WebP. */
  src: string;
  /** Destination opened when the creative is clicked or tapped. */
  href: string;
  /** A concise description of the promotion for screen-reader users. */
  alt: string;
  /** External links open in a new tab by default. Override when needed. */
  newTab?: boolean;
}

export type EpisodeAdSet = Partial<Record<EpisodeAdPlacement, EpisodeAd>>;

/**
 * Creatives configured here appear on every episode page. Leave a placement
 * absent to hide it completely. Example:
 *
 * desktopTower: {
 *   src: "/media/ads/episodes/300x600/example.webp",
 *   href: "https://example.com/",
 *   alt: "A short description of the featured promotion",
 * },
 */
const defaultEpisodeAds: EpisodeAdSet = {
  desktopTower: {
    src: "/media/ads/episodes/300x600/water-valley-vaults-protect-assets-looping.webp",
    href: "https://watervalleyvaults.com/design/",
    alt: "Water Valley Vaults: protect your assets and receive 10% off",
  },
  mobileTop: {
    src: "/media/ads/episodes/728x90/water-valley-vaults-10-percent-off.webp",
    href: "https://watervalleyvaults.com/design/",
    alt: "Water Valley Vaults: 10% off premium storage, limited availability",
  },
  lowerBanner: {
    src: "/media/ads/episodes/970x250/water-valley-vaults-10-percent-off.webp",
    href: "https://watervalleyvaults.com/design/",
    alt: "Water Valley Vaults: 10% off premium storage",
  },
};

/** Add only the placements that should differ for a particular episode. */
const episodeAdOverrides: Partial<Record<string, EpisodeAdSet>> = {};

export const getEpisodeAds = (episodeSlug: string): EpisodeAdSet => ({
  ...defaultEpisodeAds,
  ...episodeAdOverrides[episodeSlug],
});
