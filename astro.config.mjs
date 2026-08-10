import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.watervalleyvoice.com",
  output: "static",
  integrations: [sitemap()],
});
