// Requires mint dev; COMET_PLAYWRIGHT_MODULE may point at external tooling.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.COMET_DOCS_URL || "http://localhost:3000";
const selector = ".comet-home__title-inline-img";
const poster = "/img/home-lin-original-still.png";
const gif = "/img/home-lin-entrance-original.gif";
const firstPose = "/img/home-lin-original-start.png";
const waitForPoster = (page) => page.waitForFunction(() => {
  const slot = document.querySelector(".comet-home__title-illustration");
  const img = slot?.querySelector(".comet-home__title-inline-img--poster");
  return slot?.classList.contains("is-complete") &&
    slot.querySelector("picture").hidden && img.complete && img.naturalWidth > 0;
});
const waitForAnimation = (page) => page.waitForFunction(() => {
  const hero = document.querySelector(".comet-home__hero-entrance");
  const img = hero?.querySelector(".comet-home__title-inline-img--animated");
  return hero?.classList.contains("is-hero-visible") &&
    document.querySelector(".comet-home__title-illustration")?.dataset.playbackStarted &&
    img.complete && img.naturalWidth > 0;
});

test("homepage hero plays once and settles on its exact tail-frame PNG", async (t) => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE } : {}),
  });
  const newContext = async (options = {}) => {
    const context = await browser.newContext(options);
    await context.route("**/player.bilibili.com/**", (route) => route.abort());
    return context;
  };
  try {
    // mint dev can return a compiling shell for the first request. Without
    // page JavaScript it cannot refresh itself, so compile both routes first.
    const warmup = await newContext();
    try {
      for (const locale of ["zh", "en"]) {
        const response = await warmup.request.get(`${base}/${locale}/home`);
        assert.equal(response.status(), 200);
        assert.ok((await response.text()).includes("comet-home__title-illustration"));
      }
    } finally { await warmup.close(); }
    for (const reduced of [false, true]) {
      await t.test(`initial HTML uses ${reduced ? "the reduced-motion poster" : "the first pose"} without consuming GIF playback`, async () => {
        const context = await newContext({ javaScriptEnabled: false, reducedMotion: reduced ? "reduce" : "no-preference" });
        try {
          const page = await context.newPage();
          const requests = [];
          page.on("request", (request) => { if (new URL(request.url()).pathname === gif) requests.push(request.url()); });
          await page.goto(`${base}/zh/home`, { waitUntil: "domcontentloaded" });
          const animation = page.locator(".comet-home__title-inline-img--animated");
          await animation.evaluate((img) => img.decode());
          assert.equal(await animation.getAttribute("src"), firstPose);
          assert.ok((await animation.evaluate((img) => img.currentSrc)).endsWith(reduced ? poster : firstPose));
          assert.equal(await page.locator(".comet-home__title-animation").evaluate((el) => getComputedStyle(el).opacity), "1");
          assert.equal(await page.locator(".comet-home__title-inline-img--poster").evaluate((el) => getComputedStyle(el).opacity), "0");
          assert.deepEqual(requests, []);
        } finally { await context.close(); }
      });
    }

    for (const [locale, width] of [["zh", 1600], ["en", 1280], ["zh", 390]]) {
      await t.test(`${locale} at ${width}px plays a complete pass with stable image dimensions`, async () => {
        const context = await newContext({ viewport: { width, height: 1000 } });
        try {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          await page.goto(`${base}/${locale}/home`, { waitUntil: "domcontentloaded" });
          const animation = page.locator('.comet-home__title-inline-img--animated');
          await waitForAnimation(page);
          const started = Date.now();
          const size = await page.locator(".comet-home__title-illustration").boundingBox();
          const animationSize = await animation.boundingBox();
          assert.ok(Math.abs(animationSize.height / size.height - 0.947) < 0.001);
          assert.ok(await animation.evaluate((img) => img.complete && img.naturalWidth === 480));
          const hiddenPoster = await page.locator(".comet-home__title-inline-img--poster").boundingBox();
          assert.ok(Math.abs(hiddenPoster.x - animationSize.x) < .01);
          assert.ok(Math.abs(hiddenPoster.y - animationSize.y) < .01);
          assert.equal(hiddenPoster.width, animationSize.width);
          assert.equal(hiddenPoster.height, animationSize.height);
          await waitForPoster(page);
          assert.ok(Date.now() - started >= 4800, "the full visible five-second pass must finish before restoring the poster");
          const restored = page.locator(".comet-home__title-inline-img--poster");
          assert.ok(await restored.evaluate((img) => img.complete && img.naturalWidth > 0));
          const restoredSize = await restored.boundingBox();
          assert.equal(restoredSize.width, animationSize.width);
          assert.equal(restoredSize.height, animationSize.height);
          assert.equal(await page.locator(".comet-home__title-animation").isVisible(), false);
          if (process.env.COMET_HOME_SCREENSHOT_DIR) {
            fs.mkdirSync(process.env.COMET_HOME_SCREENSHOT_DIR, { recursive: true });
            await page.screenshot({ path: path.join(process.env.COMET_HOME_SCREENSHOT_DIR, `${locale}-${width}-static.png`) });
          }
          await page.waitForTimeout(600);
          assert.equal(await restored.getAttribute("src"), poster, "the GIF must not restart");
          assert.deepEqual(errors, []);
        } finally { await context.close(); }
      });
    }

    await t.test("slow entrance and warm reload both start at the first pose after the hero is visible", async () => {
      const context = await newContext();
      try {
        const page = await context.newPage();
        await page.addInitScript(() => {
          const observer = new MutationObserver(() => {
            const hero = document.querySelector('.comet-home__hero-entrance');
            if (!hero) return;
            hero.style.setProperty('transition', 'opacity 3s linear, transform 3s linear', 'important');
            observer.disconnect();
          });
          observer.observe(document, {childList:true,subtree:true});
        });
        const sources = [];
        for (let visit = 0; visit < 2; visit++) {
          if (visit === 0) await page.goto(`${base}/zh/home`, {waitUntil:'domcontentloaded'});
          else await page.reload({waitUntil:'domcontentloaded'});
          await page.waitForFunction(() => document.querySelector('.comet-home__hero-entrance')?.classList.contains('is-hero-visible'));
          await page.waitForTimeout(500);
          assert.equal(await page.locator('.comet-home__title-inline-img--animated').getAttribute('src'), firstPose,
            'the entrance must not consume the opening frames');
          await waitForAnimation(page);
          const playback = await page.evaluate(async (firstPose) => {
            const hero = document.querySelector('.comet-home__hero-entrance');
            const animation = hero.querySelector('.comet-home__title-inline-img--animated');
            const reference = new Image(); reference.src = firstPose; await reference.decode();
            const pixels = (image) => {
              const canvas = document.createElement('canvas'); canvas.width=480; canvas.height=480;
              const ctx=canvas.getContext('2d'); ctx.drawImage(image,0,0,480,480);
              return ctx.getImageData(0,0,480,480).data;
            };
            const expected=pixels(reference),actual=pixels(animation);
            return {opacity:Number(getComputedStyle(hero).opacity),src:animation.currentSrc,
              firstFrameMatches:actual.every((value,i)=>value===expected[i])};
          }, firstPose);
          assert.equal(playback.opacity, 1);
          assert.ok(playback.firstFrameMatches, 'visible playback must begin with frame 1, even after a warm reload');
          sources.push(playback.src);
        }
        assert.notEqual(sources[0], sources[1], 'reload must have a fresh playback timeline');
      } finally { await context.close(); }
    });

    await t.test("slow GIF never shows the static poster before playback", async () => {
      const context = await newContext();
      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      try {
        const page = await context.newPage();
        let requested;
        const requestStarted = new Promise((resolve) => { requested = resolve; });
        await page.route(`**${gif}*`, async (route) => {
          requested();
          await gate;
          await route.continue();
        });
        await page.goto(`${base}/zh/home`, { waitUntil: "domcontentloaded" });
        await requestStarted;
        await page.waitForTimeout(3100);
        assert.equal(await page.locator(".comet-home__title-inline-img--animated").getAttribute("src"), firstPose);
        assert.equal(await page.locator(".comet-home__title-inline-img--poster").evaluate((img) => getComputedStyle(img).opacity), "0");
        release();
        await waitForAnimation(page);
        const started = Date.now();
        await waitForPoster(page);
        assert.ok(Date.now() - started >= 4800);
      } finally { release(); await context.close(); }
    });

    await t.test("failed GIF retains the decoded poster", async () => {
      const context = await newContext();
      try {
        const page = await context.newPage();
        const failed = page.waitForRequest(request => new URL(request.url()).pathname === gif);
        await page.route(`**${gif}*`, (route) => route.abort());
        await page.goto(`${base}/zh/home`, { waitUntil: "domcontentloaded" });
        await failed;
        await waitForPoster(page);
      } finally { await context.close(); }
    });

    await t.test("reduced motion skips the download and keeps the static image", async () => {
      const context = await newContext({ reducedMotion: "reduce" });
      try {
        const page = await context.newPage();
        const requests = [];
        page.on("request", (request) => { if (new URL(request.url()).pathname === gif) requests.push(request.url()); });
        await page.goto(`${base}/zh/home`, { waitUntil: "domcontentloaded" });
        await page.locator(".comet-home__hero-entrance.is-hero-visible").waitFor({ state: "visible" });
        await page.waitForTimeout(1700);
        await waitForPoster(page);
        assert.deepEqual(requests, []);
      } finally { await context.close(); }
    });

    await t.test("enabling reduced motion during playback restores the poster immediately", async () => {
      const context = await newContext();
      try {
        const page = await context.newPage();
        await page.goto(`${base}/zh/home`, { waitUntil: "domcontentloaded" });
        await waitForAnimation(page);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await waitForPoster(page);
        assert.ok(await page.locator(".comet-home__title-inline-img--poster").evaluate((img) => img.complete && img.naturalWidth > 0));
      } finally { await context.close(); }
    });
  } finally { await browser.close(); }
});
