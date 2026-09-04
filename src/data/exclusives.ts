import { episodes } from "./episodes";

export interface Exclusive {
  slug: string;
  title: string;
  teaser: string;
  metaDescription: string;
  description: string[];
  publishedDate: string;
  publishedDateTime: string;
  duration: string;
  durationLabel: string;
  guests: string[];
  videoUrl: string;
  poster: string;
  posterAlt: string;
  captions?: string;
  /** Omit for an Exclusive that stands on its own. */
  relatedEpisodeSlug?: string;
}

export const exclusives: Exclusive[] = [
  {
    slug: "ryan-bach-hockey-fights",
    title: "EXCLUSIVE: Ryan Bach talks about hockey fights",
    teaser: "Marissa asks Ryan Bach how hockey players go from fights and trash talk to handshakes, future teammates, and beers after a series.",
    metaDescription: "Ryan Bach talks hockey fights, trash talk, rivals becoming teammates, and the respect behind the handshake line in this website-only extra.",
    description: [
      "How do hockey players go from throwing punches to sharing a beer? Marissa Donahoo has always wanted to know. In this website-only extra from Episode 1 · Part 2, she asks Ryan Bach about the fights, the trash talk, and whether those on-ice rivalries follow players out of the rink.",
      "Ryan admits he got into a few fights during his playing days—and some of those opponents later became his teammates. From chirping across the benches to scrums around the goalie, he gives Marissa a look at the side of hockey fans can’t hear from the stands. He also explains the respect behind that handshake line after a series-ending game, when emotions are still running high.",
      "And yes, after all that, opponents can head out for dinner and beers together. It’s a candid, funny look at a sport where you might trade punches today and wear the same jersey tomorrow.",
    ],
    publishedDate: "2026-09-04",
    publishedDateTime: "2026-09-04T16:30:00-06:00",
    duration: "PT3M11S",
    durationLabel: "3 min 11 sec",
    guests: ["Ryan Bach"],
    videoUrl: "https://media.watervalleyvoice.com/exclusives/ryan-bach-hockey-fights-v1.mp4",
    poster: "/media/images/exclusives/ryan-bach-hockey-fights.jpg",
    posterAlt: "Ryan Bach talking into a microphone in the Water Valley Voice podcast studio.",
    captions: "/media/captions/ryan-bach-hockey-fights.en.vtt",
    relatedEpisodeSlug: "episode-1-part-2",
  },
];

export const exclusivePath = (exclusive: Exclusive) => `/exclusives/${exclusive.slug}/`;

export const newestExclusives = [...exclusives].sort((a, b) =>
  b.publishedDateTime.localeCompare(a.publishedDateTime),
);

export const getExclusivesForEpisode = (slug: string) =>
  newestExclusives.filter((exclusive) => exclusive.relatedEpisodeSlug === slug);

export const getRelatedEpisode = (exclusive: Exclusive) => {
  if (!exclusive.relatedEpisodeSlug) return undefined;
  const episode = episodes.find((item) => item.slug === exclusive.relatedEpisodeSlug);
  if (!episode) throw new Error(`Unknown related episode for Exclusive: ${exclusive.slug}`);
  return episode;
};
