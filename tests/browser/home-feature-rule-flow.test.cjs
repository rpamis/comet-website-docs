const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMET_DOCS_URL || 'http://localhost:3000';

for (const locale of ['zh', 'en']) {
test(`${locale} gray dashed feature lines slide and respect reduced motion`, async t => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE } : {}),
  });
  try {
    for (const width of [1600, 390]) {
      await t.test(`${width}px`, async () => {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion:'no-preference' });
        try {
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.route('**/player.bilibili.com/**', route => route.abort());
          await page.goto(`${base}/${locale}/home`, { waitUntil:'domcontentloaded' });
          await page.locator('.comet-home__loader.is-hidden').waitFor({ state:'attached' });
          assert.equal(await page.locator('.comet-home__feature--ruled').count(), 3);
          for (const id of ['comet-skill-title', 'comet-eval-title', 'comet-any-title']) {
            const selector = `section[aria-labelledby="${id}"]`;
            const section = page.locator(selector);
            await section.evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 150, behavior:'instant' }));
            await page.waitForFunction(selector => document.querySelector(selector)?.dataset.ruleFlow === 'active', selector);
            const positions = await section.evaluate(element => ['::before','::after'].map(pseudo => getComputedStyle(element,pseudo).backgroundPosition));
            await page.waitForFunction(({selector,positions}) => ['::before','::after'].every((pseudo,index) => getComputedStyle(document.querySelector(selector),pseudo).backgroundPosition !== positions[index]), {selector,positions});
            assert.equal(await section.evaluate(element => getComputedStyle(element,'::after').animationPlayState), 'running');
            assert.equal(await section.evaluate(element => Math.round(parseFloat(getComputedStyle(element,'::after').width))), width);
            const pattern = await section.evaluate(element => ({
              vertical: getComputedStyle(element,'::before').backgroundSize,
              horizontal: getComputedStyle(element,'::after').backgroundSize,
              top: getComputedStyle(element).getPropertyValue('--rule-top').trim(),
              repeat: getComputedStyle(element,'::after').animationIterationCount,
            }));
            assert.equal(pattern.vertical,'1px 16px, 1px 16px');
            assert.equal(pattern.horizontal,'16px 1px, 16px 1px');
            assert.equal(pattern.repeat,'infinite');
            assert.notEqual(pattern.top,'transparent');
            if(id==='comet-skill-title') {
              const alignment=await section.evaluate(element=>({
                vertical:parseFloat(getComputedStyle(element,'::before').top),
                horizontal:parseFloat(getComputedStyle(element,'::after').top),
              }));
              assert.ok(alignment.vertical>=24);
              assert.ok(Math.abs(alignment.vertical-alignment.horizontal-1)<0.1,'top rule must connect to both side rules below the blue panel');
            }
          }
          await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
          await page.waitForFunction(() => [...document.querySelectorAll('.comet-home__feature--ruled')].every(element => element.dataset.ruleFlow === 'idle'));
          assert.equal(await page.locator('.comet-home__feature--ruled').first().evaluate(element => getComputedStyle(element,'::after').animationPlayState), 'paused');
          const evalSection = page.locator('section[aria-labelledby="comet-eval-title"]');
          await evalSection.evaluate(element => window.scrollTo({top:element.getBoundingClientRect().top+scrollY-350,behavior:'instant'}));
          await page.emulateMedia({reducedMotion:'reduce'});
          await page.waitForFunction(() => [...document.querySelectorAll('.comet-home__feature--ruled')].every(element => getComputedStyle(element,'::after').animationName === 'none'));
          assert.equal(await page.locator('.comet-home__hero').evaluate(element => getComputedStyle(element,'::after').animationName), 'none');
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          assert.deepEqual(errors, []);
        } finally { await page.close(); }
      });
    }
  } finally { await browser.close(); }
});
}
