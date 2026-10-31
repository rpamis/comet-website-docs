// Requires `mint dev` and Playwright; tooling overrides match blog-lists.test.cjs.
const assert = require("node:assert/strict");
const { test } = require("node:test");
const locale = process.env.COMET_BLOG_LOCALE || "zh";
const { chromium } = require(
  process.env.COMET_PLAYWRIGHT_MODULE || "playwright",
);

test("blog banner loads before carousel JavaScript and switches only to decoded images", async (t) => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE }
      : {}),
  });
  const labels =
    locale === "en"
      ? {
          pause: "Pause landscape slideshow",
          shuffle: "Shuffle landscapes",
          first: "Observatory",
          next: "Library",
        }
      : {
          pause: "暂停自动切换风景",
          shuffle: "随机切换风景",
          first: "观星",
          next: "书廊",
        };
  const url = `${process.env.COMET_DOCS_URL || "http://localhost:3000"}/${locale}/tech-blog`;
  const newContext = async (options) => {
    const context = await browser.newContext(options);
    // External video availability is independent of the banner regression.
    await context.route("**/player.bilibili.com/**", (route) => route.abort());
    return context;
  };
  try {
    await t.test(
      "initial HTML includes the eager, high-priority banner without JavaScript",
      async () => {
        const context = await newContext({ javaScriptEnabled: false });
        try {
          const page = await context.newPage();
          await page.goto(url, { waitUntil: "domcontentloaded" });
          const poster = page.locator(".comet-blog__art img");
          assert.equal(
            await poster.count(),
            1,
            "the initial document must contain the banner",
          );
          assert.equal(await poster.getAttribute("loading"), "eager");
          assert.equal(await poster.getAttribute("fetchpriority"), "high");
          assert.equal(
            await poster.evaluate((img) => getComputedStyle(img).opacity),
            "1",
          );
          await poster.evaluate((img) => img.decode());
          assert.ok(await poster.evaluate((img) => img.naturalWidth > 0));
        } finally {
          await context.close();
        }
      },
    );

    await t.test(
      "mounting controls does not insert six hidden slideshow images",
      async () => {
        const context = await newContext();
        try {
          const page = await context.newPage();
          await page.goto(url, { waitUntil: "domcontentloaded" });
          await page.getByRole("button", { name: labels.pause }).click();
          assert.equal(await page.locator(".comet-blog__art img").count(), 1);
          assert.equal(
            await page.locator(".comet-blog [data-rmiz-btn-zoom]").count(),
            0,
          );
        } finally {
          await context.close();
        }
      },
    );

    await t.test(
      "a slow next image leaves the current banner visible until decoding finishes",
      async () => {
        const context = await newContext();
        let release;
        const gate = new Promise((resolve) => {
          release = resolve;
        });
        try {
          const page = await context.newPage();
          await page.route("**/library-oil-v2.webp", async (route) => {
            await gate;
            await route.continue();
          });
          await page.goto(url, { waitUntil: "domcontentloaded" });
          await page.getByRole("button", { name: labels.pause }).click();
          await page
            .locator(".comet-blog__art img.is-active")
            .evaluate((img) => img.decode());
          await page.evaluate(() => {
            Math.random = () => 0;
          });
          await page.getByRole("button", { name: labels.shuffle }).click();
          // Flush UI work while the target's bytes remain blocked, without a timing threshold.
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              ),
          );
          const current = await page
            .locator(".comet-blog__art img.is-active")
            .evaluate((img) => ({
              src: img.getAttribute("src"),
              loaded: img.complete && img.naturalWidth > 0,
            }));
          assert.ok(
            current.src.endsWith("observatory-oil-v2.webp"),
            "keep showing the first scene while the next download is blocked",
          );
          assert.ok(current.loaded);
          assert.match(
            await page.locator(".comet-blog__scene-name").innerText(),
            new RegExp(labels.first),
          );
          release();
          await page.waitForFunction(() => {
            const img = document.querySelector(
              ".comet-blog__art img.is-active",
            );
            return (
              img?.src.endsWith("library-oil-v2.webp") &&
              img.complete &&
              img.naturalWidth > 0
            );
          });
          assert.match(
            await page.locator(".comet-blog__scene-name").innerText(),
            new RegExp(labels.next),
          );
        } finally {
          release();
          await context.close();
        }
      },
    );
  } finally {
    await browser.close();
  }
});
