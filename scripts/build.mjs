import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

await mkdir(resolve(client, "assets"), { recursive: true });
for (const asset of ["livedata.png", "mdilink.png", "customer-orders-live.png", "og.png"]) {
  await cp(resolve(root, "assets", asset), resolve(client, "assets", asset));
}
await cp(resolve(root, "rahullore_OP.pdf"), resolve(client, "rahullore_OP.pdf"));
await writeFile(resolve(client, "index.html"), await readFile(resolve(root, "index.html")));

await writeFile(
  resolve(server, "index.js"),
  `export default {\n  async fetch(request, env) {\n    return env.ASSETS.fetch(request);\n  },\n};\n`,
);

console.log("Built static site for deployment.");
