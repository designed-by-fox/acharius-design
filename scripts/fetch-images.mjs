// Downloads every image the site uses from the Webflow CDN into assets/img.
// Run once from the repo root:  node scripts/fetch-images.mjs
// Needs Node 18 or newer. Safe to re-run: files that already exist are skipped.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(join(root, "scripts", "image-manifest.json"), "utf8"));
const force = process.argv.includes("--force");
let ok = 0, skipped = 0, failed = [];

for (const [key, { path, urls }] of Object.entries(manifest)) {
  const dest = join(root, path);
  if (!force) {
    try { await access(dest); skipped++; continue; } catch {}
  }
  let saved = false;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      saved = true;
      break;
    } catch {}
  }
  if (saved) { ok++; console.log("saved", path); } else { failed.push(key); console.warn("FAILED", key); }
}
console.log(`\nDone. ${ok} downloaded, ${skipped} already there, ${failed.length} failed.`);
if (failed.length) process.exit(1);
