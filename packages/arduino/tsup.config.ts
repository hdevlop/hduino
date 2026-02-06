import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    blocks: "src/blocks/index.ts",
    generators: "src/generators/index.ts",
    arduino: "src/arduino/index.ts",
    theme: "src/theme.ts",
    toolbox: "src/toolbox/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["blockly"],
});
