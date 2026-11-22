import { execFileSync } from "node:child_process";
import path from "node:path";
import { defineConfig } from "vite";

const site = path.join(import.meta.dirname, "taksimaniya-demo");
const templates = path.join(import.meta.dirname, "_taksimaniya-build");
const assets = path.join(site, "assets");
const catalog = path.join(assets, "js", "cars.js");

function buildPages() {
  execFileSync(process.execPath, [path.join(templates, "build.js")], { stdio: "inherit" });
}

export default defineConfig({
  root: site,
  appType: "mpa",
  server: { host: "127.0.0.1", port: Number(process.env.PORT || 8766), strictPort: true },
  plugins: [{
    name: "taximania-preview",
    configureServer(server) {
      buildPages();
      server.watcher.add(templates);
      server.watcher.on("all", (event, file) => {
        if (!["add", "change", "unlink"].includes(event)) return;
        if (file.startsWith(templates + path.sep) || file === catalog) {
          try {
            buildPages();
          } catch (error) {
            server.config.logger.error(error.message);
          }
        } else if (file.startsWith(assets + path.sep) && !file.endsWith(".css")) {
          server.ws.send({ type: "full-reload" });
        }
      });
    }
  }]
});
