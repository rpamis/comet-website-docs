const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');

test('GIF and its tail-frame PNG share the exact display geometry', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [locale,width] of [['zh',1280],['en',390]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
      try {
        await page.goto(`${process.env.COMET_DOCS_URL || 'http://localhost:3000'}/${locale}/home`, { waitUntil: 'domcontentloaded' });
        await page.locator('.comet-home__title-inline-img--poster').evaluate(img => img.decode());
        const layers = await page.evaluate(() => {
          return ['.comet-home__title-inline-img--animated','.comet-home__title-inline-img--poster'].map(selector => {
            const img = document.querySelector(selector), rect = img.getBoundingClientRect(), css = getComputedStyle(img);
            return { x:rect.x, y:rect.y, width:rect.width, height:rect.height, transform:css.transform, naturalWidth:img.naturalWidth };
          });
        });
        for (const key of ['x','y','width','height']) assert.ok(Math.abs(layers[0][key]-layers[1][key]) < .01, `${locale}: ${key} must match`);
        assert.equal(layers[0].transform, layers[1].transform);
        await page.waitForFunction(() => document.querySelector('.comet-home__title-illustration')?.classList.contains('is-complete'));
        const poster = await page.locator('.comet-home__title-inline-img--poster').evaluate(img => ({
          src:img.getAttribute('src'), loaded:img.complete && img.naturalWidth === 480,
          opacity:getComputedStyle(img).opacity, transition:getComputedStyle(img).transitionDuration,
        }));
        assert.equal(poster.src, '/img/home-lin-original-still.png');
        assert.ok(poster.loaded);
        assert.equal(poster.opacity, '1');
        assert.equal(poster.transition, '0s');
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
});
