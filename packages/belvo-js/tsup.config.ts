import { defineConfig } from "tsup";
import { name, version } from "./package.json";

export default defineConfig({
  entryPoints: ["./src/**/*.{ts,tsx}"],
  format: ["esm", "cjs"],
  outDir: "dist",
  external: ["react", "react-dom","next"],
  bundle: false,
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true,
  legacyOutput: true,
  define: {
    PACKAGE_NAME: `"${name}"`,
    PACKAGE_VERSION: `"${version}"`,
  },
});
