import { defineConfig } from "tsup"

export default defineConfig({
  entry: { index: "src/index.ts" },
  outExtension: () => ({ js: ".cjs" }),
  format: ["cjs"],
  target: "node24",
  platform: "node",
  clean: true,
  minify: false,
  sourcemap: false,
  noExternal: [/.*/],
})
