import { build } from "esbuild";
import { fileURLToPath } from "node:url";

await build({
  absWorkingDir: fileURLToPath(new URL("../", import.meta.url)),
  entryPoints: [fileURLToPath(new URL("../auth-client.js", import.meta.url))],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: fileURLToPath(new URL("../dist/auth-client.js", import.meta.url)),
});
