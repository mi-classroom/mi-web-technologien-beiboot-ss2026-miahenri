import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/mi-web-technologien-beiboot-ss2026-miahenri/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        player: resolve(__dirname, "player.html"),
      },
    },
  },
});