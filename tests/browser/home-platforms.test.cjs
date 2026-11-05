// Requires mint dev. COMET_PLAYWRIGHT_MODULE, COMET_DOCS_URL, and
// COMET_CHROMIUM_EXECUTABLE can point to external preview tooling.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.COMET_DOCS_URL || "http://localhost:3000";
const sectionSelector = ".comet-home__platforms";

test("homepage platform logos span the page without gaps or horizontal overflow", async (t) => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE } : {}),
  });
  try {
    for (const [locale, width, reducedMotion, dark = false] of [
      ["zh", 1600, "no-preference"],
      ["zh", 1864, "no-preference"],
      ["zh", 1280, "no-preference"],
      ["zh", 390, "no-preference"],
      ["en", 1280, "no-preference"],
      ["zh", 2560, "no-preference"],
      ["zh", 390, "reduce"],
      ["zh", 1600, "no-preference", true],
    ]) {
      await t.test(`${locale}, ${width}px, motion ${reducedMotion}${dark ? ", dark" : ""}`, async () => {
        const context = await browser.newContext({
          viewport: { width, height: 1000 }, reducedMotion,
        });
        try {
          await context.route("**/player.bilibili.com/**", (route) => route.abort());
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          await page.goto(`${base}/${locale}/home`, { waitUntil: "domcontentloaded" });
          const section = page.locator(sectionSelector);
          await section.waitFor();
          await page.locator(".comet-home__loader.is-hidden").waitFor({ state: "attached" });
          if (dark) await page.evaluate(() => document.documentElement.classList.add("dark"));
          await section.evaluate((element) => {
            window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 110, behavior: "instant" });
          });
          await page.waitForFunction(() => {
            const element = document.querySelector(".comet-home__platforms");
            return parseFloat(getComputedStyle(element).opacity) === 1;
          });
          await section.locator("img").evaluateAll((images) => Promise.all(images.map((img) => {
            img.loading = "eager";
            return img.decode();
          })));
          const metrics = await section.evaluate((element) => {
            const marquee = element.querySelector(".comet-home__platforms-marquee");
            const groups = [...element.querySelectorAll(".comet-home__platforms-group")];
            const primary = groups.filter((group) => !group.hasAttribute("aria-hidden"));
            return {
              viewport: document.documentElement.clientWidth,
              pageWidth: document.documentElement.scrollWidth,
              width: marquee.getBoundingClientRect().width,
              left: marquee.getBoundingClientRect().left,
              names: primary.flatMap((group) => [...group.children].map((card) => card.textContent.trim())),
              images: [...element.querySelectorAll("img")].map((img) => ({
                loaded: img.complete && img.naturalWidth > 0,
                width: img.getBoundingClientRect().width,
                height: img.getBoundingClientRect().height,
                alt: img.alt,
              })),
              groups: groups.map((group) => ({
                width: group.getBoundingClientRect().width,
                hidden: getComputedStyle(group).display === "none",
              })),
              tracks: [...element.querySelectorAll(".comet-home__platforms-track")].map((track) => ({
                animation: getComputedStyle(track).animationName,
                width: track.getBoundingClientRect().width,
              })),
              spacing: [...element.querySelectorAll(".comet-home__platforms-track")].map((track) => {
                const cards = [...track.querySelectorAll(".comet-home__platforms-group > span")];
                const gap = parseFloat(getComputedStyle(track.firstElementChild).columnGap);
                return {
                  gap,
                  actual: cards.slice(1).map((card, index) =>
                    card.getBoundingClientRect().left - cards[index].getBoundingClientRect().right),
                };
              }),
              cardsFit: primary.every((group) => [...group.children].every((card) => card.scrollWidth <= card.clientWidth)),
            };
          });
          assert.equal(metrics.names.length, 39);
          assert.equal(new Set(metrics.names).size, 39);
          assert.equal(metrics.images.length, 78);
          assert.ok(metrics.images.every((img) => img.loaded && img.alt === ""));
          assert.ok(metrics.images.filter((img) => img.width > 0).every((img) =>
            Math.abs(img.width - 24) < 0.01 && Math.abs(img.height - 24) < 0.01));
          assert.ok(metrics.cardsFit, "platform names must not be clipped");
          if (dark) assert.ok(await section.locator("img").evaluateAll((images) =>
            images.every((img) => getComputedStyle(img).colorScheme === "light")));
          assert.ok(metrics.pageWidth <= metrics.viewport, "page must not overflow horizontally");
          assert.ok(Math.abs(metrics.left) < 1, "strip starts at the page edge");
          assert.ok(Math.abs(metrics.width - metrics.viewport) < 1, "strip spans the viewport");
          if (reducedMotion === "reduce") {
            assert.ok(metrics.tracks.every((track) => track.animation === "none"));
            assert.equal(metrics.groups.filter((group) => group.hidden).length, 3);
          } else {
            assert.ok(metrics.spacing.every((row) => row.gap === metrics.spacing[0].gap &&
              row.actual.every((gap) => Math.abs(gap - row.gap) < 0.05)),
            "all rows and loop boundaries must keep the same fixed spacing");
            for (let i = 0; i < 3; i++) {
              assert.ok(metrics.groups[i * 2].width >= metrics.viewport, "each repeated half covers the viewport");
              assert.ok(Math.abs(metrics.groups[i * 2].width - metrics.groups[i * 2 + 1].width) < 1);
              assert.ok(Math.abs(metrics.tracks[i].width - metrics.groups[i * 2].width * 2) < 1);
            }
            await section.hover();
            assert.ok(await section.locator(".comet-home__platforms-track").evaluateAll((tracks) =>
              tracks.every((track) => getComputedStyle(track).animationPlayState === "paused")));
          }
          assert.deepEqual(errors, []);
          if (process.env.COMET_HOME_SCREENSHOT_DIR) {
            fs.mkdirSync(process.env.COMET_HOME_SCREENSHOT_DIR, { recursive: true });
            await page.screenshot({
              path: path.join(process.env.COMET_HOME_SCREENSHOT_DIR, `platforms-${locale}-${width}-${reducedMotion}${dark ? "-dark" : ""}.png`),
              ...(reducedMotion === "reduce" ? { fullPage: false } : {}),
            });
          }
        } finally { await context.close(); }
      });
    }
  } finally { await browser.close(); }
});
