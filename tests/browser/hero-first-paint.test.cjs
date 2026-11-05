const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');

test('the headline does not appear before its first-pose image is decoded', async () => {
  const browser = await chromium.launch({headless:true});
  let release;
  const gate = new Promise(resolve => { release=resolve; });
  try {
    const page = await browser.newPage({reducedMotion:'no-preference'});
    await page.route('**/home-lin-original-start.png', async route => { await gate; await route.continue(); });
    await page.goto(`${process.env.COMET_DOCS_URL || 'http://localhost:3000'}/zh/home`, {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => document.querySelector('.comet-home__hero-entrance')?.hasAttribute('data-hero-entrance-started'));
    await page.waitForTimeout(650);
    const pending = await page.locator('.comet-home__hero-entrance').evaluate(hero => ({
      opacity:Number(getComputedStyle(hero).opacity),
      imageLoaded:hero.querySelector('.comet-home__title-inline-img--animated').naturalWidth>0,
    }));
    assert.equal(pending.imageLoaded, false);
    assert.equal(pending.opacity, 0, 'text must not appear while its illustration is still missing');
    release();
    await page.waitForFunction(() => document.querySelector('.comet-home__title-illustration')?.dataset.playbackStarted);
    assert.equal(await page.locator('.comet-home__hero-entrance').evaluate(hero => Number(getComputedStyle(hero).opacity)), 1);
  } finally { release(); await browser.close(); }
});
