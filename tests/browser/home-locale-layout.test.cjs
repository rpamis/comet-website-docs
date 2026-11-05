const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMET_DOCS_URL || 'http://localhost:3000';

test('both homepages share section order, type scale, artwork size and feature columns', async (t) => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1600, 1280, 390]) {
      await t.test(`${width}px`, async () => {
        const metrics = [];
        for (const locale of ['zh', 'en']) {
          const page = await browser.newPage({ viewport:{width,height:1000}, reducedMotion:'reduce' });
          try {
            await page.goto(`${base}/${locale}/home`, {waitUntil:'domcontentloaded'});
            await page.locator('.comet-home__loader.is-hidden').waitFor({state:'attached'});
            metrics.push(await page.evaluate(() => {
              const title = document.querySelector('#comet-home-title');
              const art = document.querySelector('.comet-home__title-illustration');
              const feature = document.querySelector('.comet-home__feature');
              const note = document.querySelector('.comet-home__why-story');
              const supervisorTitle = document.querySelector('.comet-home__supervisor-head h2');
              return {
                sections:[...document.querySelectorAll('.comet-home section[aria-labelledby]')].map(el=>el.getAttribute('aria-labelledby')),
                titleSize:getComputedStyle(title).fontSize,
                artworkWidth:art.getBoundingClientRect().width,
                columns:getComputedStyle(feature).gridTemplateColumns,
                sectionPadding:getComputedStyle(feature).paddingBlock,
                noteSize:note && getComputedStyle(note).fontSize,
                overflow:document.documentElement.scrollWidth > innerWidth,
                supervisorTitleFits:supervisorTitle.scrollWidth <= supervisorTitle.clientWidth,
              };
            }));
          } finally { await page.close(); }
        }
        assert.deepEqual(metrics[1], metrics[0], 'localized copy must not change shared layout dimensions or omit sections');
        assert.equal(metrics[0].overflow, false);
        assert.equal(metrics[1].supervisorTitleFits, true, 'long English headings must stay within their column');
      });
    }
  } finally { await browser.close(); }
});
