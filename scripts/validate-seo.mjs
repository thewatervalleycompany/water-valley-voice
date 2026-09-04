import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = new URL("../dist/", import.meta.url);
const distDirectoryPath = fileURLToPath(distDirectory);
const canonicalOrigin = "https://www.watervalleyvoice.com";
const failures = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const seenCanonicals = new Map();

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const firstMatch = (html, pattern) => html.match(pattern)?.[1]?.trim();

const collectTypes = (value, types = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectTypes(item, types));
    return types;
  }

  if (!value || typeof value !== "object") return types;

  const type = value["@type"];
  if (Array.isArray(type)) type.forEach((item) => types.add(item));
  else if (typeof type === "string") types.add(type);

  Object.values(value).forEach((item) => collectTypes(item, types));
  return types;
};

const htmlFiles = walk(distDirectoryPath).filter((path) => extname(path) === ".html");

for (const file of htmlFiles) {
  const outputPath = relative(distDirectoryPath, file);
  const html = readFileSync(file, "utf8");
  const isRedirectDocument = outputPath === "book-studio/index.html";
  const isNotFoundDocument = outputPath === "404.html";

  if (isRedirectDocument) continue;

  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i);
  const description = firstMatch(
    html,
    /<meta\s+name="description"\s+content="([^"]+)"\s*\/?\s*>/i,
  );
  const canonical = firstMatch(
    html,
    /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/i,
  );
  const robots = firstMatch(html, /<meta\s+name="robots"\s+content="([^"]+)"\s*\/?\s*>/i);
  const jsonLdBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

  assert(Boolean(title), `${outputPath}: missing title`);
  assert(Boolean(description), `${outputPath}: missing meta description`);
  assert(canonical?.startsWith(canonicalOrigin), `${outputPath}: canonical is not on ${canonicalOrigin}`);
  assert(Boolean(robots), `${outputPath}: missing robots directive`);
  assert(
    isNotFoundDocument
      ? robots?.toLowerCase().includes("noindex")
      : !robots?.toLowerCase().includes("noindex"),
    `${outputPath}: unexpected robots indexing directive`,
  );
  assert((html.match(/<h1\b/gi) ?? []).length === 1, `${outputPath}: expected exactly one h1`);
  assert(/<main\s+[^>]*id="main-content"/i.test(html), `${outputPath}: missing labelled main content`);
  assert(/<meta\s+property="og:title"/i.test(html), `${outputPath}: missing Open Graph title`);
  assert(/<meta\s+property="og:image"/i.test(html), `${outputPath}: missing Open Graph image`);
  assert(/<meta\s+name="twitter:card"/i.test(html), `${outputPath}: missing Twitter card`);
  assert(jsonLdBlocks.length === 1, `${outputPath}: expected one connected JSON-LD graph`);

  for (const [value, seen, label] of [
    [title, seenTitles, "title"],
    [description, seenDescriptions, "description"],
    [canonical, seenCanonicals, "canonical"],
  ]) {
    if (!value) continue;
    assert(!seen.has(value), `${outputPath}: duplicate ${label} also used by ${seen.get(value)}`);
    seen.set(value, outputPath);
  }

  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      const types = collectTypes(data);
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
      assert(graph.length > 0, `${outputPath}: JSON-LD is not a populated @graph`);
      const graphIDs = graph
        .map((node) => node?.["@id"])
        .filter((id) => typeof id === "string");
      assert(
        new Set(graphIDs).size === graphIDs.length,
        `${outputPath}: JSON-LD graph contains duplicate @id nodes`,
      );
      assert(types.has("WebSite"), `${outputPath}: JSON-LD is missing WebSite`);
      assert(
        types.has("WebPage") || types.has("AboutPage") || types.has("CollectionPage"),
        `${outputPath}: JSON-LD is missing a page entity`,
      );

      if (outputPath.startsWith("episodes/episode-")) {
        assert(types.has("PodcastEpisode"), `${outputPath}: missing PodcastEpisode schema`);
        assert(types.has("AudioObject"), `${outputPath}: missing AudioObject schema`);
        assert(types.has("BreadcrumbList"), `${outputPath}: missing BreadcrumbList schema`);
      }

      if (outputPath.startsWith("exclusives/") && outputPath !== "exclusives/index.html") {
        const video = graph.find((node) => node?.["@type"] === "VideoObject");
        assert(Boolean(video), `${outputPath}: missing VideoObject schema`);
        assert(types.has("BreadcrumbList"), `${outputPath}: missing BreadcrumbList schema`);
        assert(video?.contentUrl?.startsWith("https://media.watervalleyvoice.com/exclusives/"), `${outputPath}: video must use the R2 media domain`);
        assert(html.includes(`<source src="${video?.contentUrl}" type="video/mp4"`), `${outputPath}: player and schema video URLs differ`);
        assert(/<video\b[^>]*\bcontrols\b/.test(html), `${outputPath}: missing native video controls`);
        assert(/data-share-kind="exclusive"/.test(html), `${outputPath}: missing Exclusive sharing controls`);
        const poster = firstMatch(html, /<video\b[^>]*poster="([^"]+)"/);
        assert(poster?.startsWith("/") && existsSync(join(distDirectoryPath, poster)), `${outputPath}: missing poster file`);
        const captions = firstMatch(html, /<track\b[^>]*src="([^"]+)"/);
        if (captions) {
          const captionPath = join(distDirectoryPath, captions);
          assert(existsSync(captionPath), `${outputPath}: missing caption file`);
          if (existsSync(captionPath)) assert(readFileSync(captionPath, "utf8").startsWith("WEBVTT"), `${outputPath}: captions are not WebVTT`);
        }
        if (video?.isPartOf?.["@id"]) {
          const parentPath = new URL(video.isPartOf["@id"]).pathname;
          const parentFile = join(distDirectoryPath, parentPath, "index.html");
          assert(html.includes(`href="${parentPath}"`), `${outputPath}: missing parent episode link`);
          assert(existsSync(parentFile), `${outputPath}: parent episode does not exist`);
          if (existsSync(parentFile)) {
            assert(readFileSync(parentFile, "utf8").includes(`href="${new URL(canonical).pathname}"`), `${outputPath}: parent episode does not link back to Exclusive`);
          }
        }
      }
    } catch (error) {
      failures.push(`${outputPath}: JSON-LD does not parse (${error.message})`);
    }
  }
}

const robotsText = readFileSync(new URL("robots.txt", distDirectory), "utf8");
assert(robotsText.includes("User-agent: OAI-SearchBot"), "robots.txt: OAI-SearchBot intent is not explicit");
assert(robotsText.includes("User-agent: PerplexityBot"), "robots.txt: PerplexityBot intent is not explicit");
assert(robotsText.includes("User-agent: Claude-SearchBot"), "robots.txt: Claude-SearchBot intent is not explicit");
assert(
  robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap-index.xml`),
  "robots.txt: canonical sitemap index is missing",
);

const sitemapIndex = readFileSync(new URL("sitemap-index.xml", distDirectory), "utf8");
assert(sitemapIndex.includes(`${canonicalOrigin}/sitemap-0.xml`), "sitemap index: child sitemap is missing");

const sitemap = readFileSync(new URL("sitemap-0.xml", distDirectory), "utf8");
const sitemapURLs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert(sitemapURLs.length > 0, "sitemap: no canonical URLs found");
assert(
  sitemapURLs.every((url) => url.startsWith(`${canonicalOrigin}/`)),
  "sitemap: found a non-canonical hostname",
);
assert(!sitemapURLs.some((url) => url.includes("/book-studio")), "sitemap: hidden studio route is listed");
assert(!sitemapURLs.some((url) => url.includes("/404")), "sitemap: 404 route is listed");

const manifest = JSON.parse(readFileSync(new URL("site.webmanifest", distDirectory), "utf8"));
assert(manifest.name === "Water Valley Voice", "site.webmanifest: unexpected application name");

const llmsText = readFileSync(new URL("llms.txt", distDirectory), "utf8");
assert(llmsText.includes("# Water Valley Voice"), "llms.txt: site heading is missing");
for (const url of sitemapURLs.filter((url) => url.includes("/episodes/episode-") || url.includes("/exclusives/"))) {
  assert(llmsText.includes(url), `llms.txt: missing content URL ${url}`);
}

if (failures.length > 0) {
  console.error(`SEO validation failed with ${failures.length} issue${failures.length === 1 ? "" : "s"}:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length - 1} rendered pages and ${sitemapURLs.length} sitemap URLs.`);
