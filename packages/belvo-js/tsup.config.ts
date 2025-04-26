import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["./src/**/*.{ts,tsx}"],
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  clean: true,
  external: ["react", "react-dom","next"],
  bundle: false,
  minify: false,
  sourcemap: true,
});
