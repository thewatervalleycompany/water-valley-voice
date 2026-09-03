import type { APIRoute } from "astro";
import { episodePath, episodes } from "../data/episodes";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const siteURL = site ?? new URL("https://www.watervalleyvoice.com");
  const absoluteURL = (path: string) => new URL(path, siteURL).toString();
  const episodeLines = episodes.map(
    (episode) =>
      `- [${episode.label}: ${episode.title}](${absoluteURL(episodePath(episode))}) — ${episode.teaser}`,
  );

  const body = [
    "# Water Valley Voice",
    "",
    "> Water Valley Voice is a Windsor, Colorado podcast sharing conversations about the people, places, businesses, and ideas behind The Water Valley Company and Northern Colorado.",
    "",
    `Canonical website: ${absoluteURL("/")}`,
    "",
    "## Primary pages",
    "",
    `- [Home](${absoluteURL("/")})`,
    `- [All podcast episodes](${absoluteURL("/episodes/")})`,
    `- [About The Water Valley Company and host Marissa Donahoo](${absoluteURL("/about/")})`,
    "",
    "## Listen and watch",
    "",
    "- [Podcast RSS feed](https://feed.podbean.com/watervalleyvoice/feed.xml)",
    "- [Water Valley Voice on YouTube](https://www.youtube.com/channel/UCOn56MJ6u1mYxIfdJxZwvNw)",
    "",
    "## Episodes",
    "",
    ...episodeLines,
    "",
    "## Contact",
    "",
    "- contact@watervalleyvoice.com",
    "",
    "The canonical website and podcast feed are the authoritative sources for current episode information.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
