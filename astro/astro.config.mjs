// @ts-check

import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://d0s-dev.github.io",
  base: "/",
  output: "static",
  integrations: [
    starlight({
      title: "d0s Documentation",
      description:
        "Operator-first guides for deploying and maintaining the d0s platform in connected and disconnected environments.",
      disable404Route: true,
      sidebar: [
        {
          label: "Overview",
          items: [
            { label: "Welcome", link: "/docs/" },
            { label: "CLI Quickstart", link: "/docs/cli" },
            { label: "Catalog Consumption", link: "/docs/catalog" },
          ],
        },
        {
          label: "Operations",
          items: [{ label: "Deploy Workflow", link: "/docs/catalog" }],
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/d0s-dev/d0s",
        },
      ],
      head: [
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            content: "#001233",
          },
        },
      ],
      customCss: ["./src/styles/starlight.css"],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
