import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { studioRentalsEnabled } from "./src/config/features";

export default defineConfig({
  site: "https://www.watervalleyvoice.com",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => studioRentalsEnabled || !new URL(page).pathname.startsWith("/book-studio"),
    }),
  ],
});
