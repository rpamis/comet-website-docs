import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../custom.css", import.meta.url), "utf8");

test("custom home pages keep the top-level loader until the mounted loader mounts", () => {
  assert.ok(
    /html\[data-page-mode=['"]custom['"]\]\s+body:not\(:has\(\.comet-home__loader\)\)::before/.test(
      css,
    ),
    "the top-level loader backdrop exits once the mounted loader exists",
  );
  assert.ok(
    /html\[data-page-mode=['"]custom['"]\]\s+body:not\(:has\(\.comet-home__loader\)\)::after/.test(
      css,
    ),
    "the top-level loader spinner exits once the mounted loader exists",
  );
  assert.ok(
    !/body:not\(:has\(\.comet-home__loader\.is-hidden\)\)::(before|after)/.test(css),
    "the top-level loader must not overlap the mounted loader",
  );
  assert.ok(
    /html\[data-page-mode=['"]custom['"]\]:not\(:has\(\.comet-home__loader\.is-hidden\)\)\s+header/.test(
      css,
    ),
    "the sticky header remains visible above the loading layer",
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
