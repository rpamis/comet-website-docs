import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../custom.css", import.meta.url), "utf8");

test("custom home pages show the existing loader before MDX mounts", () => {
  assert.ok(
    /html\[data-page-mode=['"]custom['"]\]\s+body:not\(:has\(\.comet-home__loader\)\)::before/.test(
      css,
    ),
    "missing the pre-MDX loader backdrop",
  );
  assert.ok(
    /html\[data-page-mode=['"]custom['"]\]\s+body:not\(:has\(\.comet-home__loader\)\)::after/.test(
      css,
    ),
    "missing the pre-MDX loader spinner",
  );
});

test("homepage font loading does not block the critical custom CSS", () => {
  assert.ok(
    !/@import\s+url\(['"]https:\/\/fonts\.googleapis\.com/.test(css),
    "Google Fonts must not block custom.css",
  );

  const fontLoaderPath = new URL("../homepage-fonts.js", import.meta.url);
  assert.ok(
    existsSync(fontLoaderPath),
    "homepage-fonts.js must load the fonts after first paint",
  );

  const fontLoader = readFileSync(fontLoaderPath, "utf8");
  assert.match(fontLoader, /document\.createElement\(['"]link['"]\)/);
  assert.match(fontLoader, /fonts\.googleapis\.com/);
});
