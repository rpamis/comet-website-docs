// Requires mint dev. Override COMET_DOCS_URL, COMET_PLAYWRIGHT_MODULE,
// and COMET_CHROMIUM_EXECUTABLE when using external preview tooling.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.COMET_DOCS_URL || 'http://localhost:3000';
const redirects = new Map(JSON.parse(fs.readFileSync(path.join(__dirname, '../../docs.json'), 'utf8')).redirects.map(entry => [entry.source, entry.destination]));

for (const locale of ['zh', 'en']) {
test(`${locale} footer keeps navigation and community popovers usable across widths`, async (t) => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE } : {}),
  });
  try {
    for (const width of [1600, 1280, 768, 390]) {
      await t.test(`${width}px`, async () => {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        try {
          await page.route('**/player.bilibili.com/**', route => route.abort());
          await page.goto(`${base}/${locale}/home`, { waitUntil: 'domcontentloaded' });
          await page.locator('.comet-home__loader.is-hidden').waitFor({ state: 'attached' });
          const footer = page.locator('.comet-home__footer--expanded');
          await footer.waitFor();
          assert.deepEqual(await footer.locator('h2').allTextContents(), locale === 'zh' ? ['资源', '项目', '社区'] : ['Resources', 'Project', 'Community']);
          assert.equal(await footer.locator('.comet-home__footer-wordmark-text').innerText(), 'Comet');
          assert.equal(await page.locator('.comet-home__section-frame, .comet-home__footer-signature').count(), 0);
          assert.equal(await page.locator('.comet-home__feature--ruled').count(), 3);
          assert.equal(await page.locator('.comet-home__hero-entrance.comet-home__feature--ruled, .comet-home__hero.comet-home__feature--ruled').count(), 0);
          assert.equal(await footer.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(255, 255, 255)');
          assert.equal(await footer.locator('.comet-home__footer-docs').getAttribute('href'), `/${locale}/overview`);
          assert.equal(await footer.locator('.comet-home__footer-language [aria-current="page"]').getAttribute('href'), `/${locale}/home`);
          assert.equal(await footer.locator('.comet-home__footer-bottom').evaluate(element => getComputedStyle(element).borderTopWidth), '0px');
          assert.equal(await page.locator('.comet-home__supervisor').evaluate(element => getComputedStyle(element).borderTopWidth), '0px');
          const metrics = await footer.evaluate(element => ({
            overflow: document.documentElement.scrollWidth > innerWidth,
            clipped: [...element.querySelectorAll('a')].some(el => el.scrollWidth > el.clientWidth + 1),
            smallestTarget: Math.min(...[...element.querySelectorAll('button.comet-home__footer-social--qr')].map(el => el.getBoundingClientRect().height)),
          }));
          assert.equal(metrics.overflow, false);
          assert.equal(metrics.clipped, false);
          assert.ok(metrics.smallestTarget >= 40);
          for (const href of await footer.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
            const route = path.join(__dirname, '../..', redirects.get(href) || href);
            assert.ok(fs.existsSync(`${route}.mdx`) || fs.existsSync(path.join(route, 'index.mdx')), href);
          }
          for (const trigger of await footer.locator('button.comet-home__footer-social--qr').all()) {
            await trigger.focus();
            const popup = trigger.locator('[role="tooltip"]');
            await popup.waitFor({ state: 'visible' });
            const bounds = await popup.boundingBox();
            assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width + 1, 'QR popup must fit viewport');
            await popup.locator('img').evaluate(async image => { image.loading = 'eager'; await image.decode(); });
          }
          await page.evaluate(() => document.activeElement?.blur());
          const benchmarkSpacing = await page.evaluate(() => {
            const board = document.querySelector('.comet-home__benchmark-board').getBoundingClientRect();
            const notes = document.querySelector('.comet-home__benchmark-notes').getBoundingClientRect();
            const footer = document.querySelector('.comet-home__benchmark-footer').getBoundingClientRect();
            return { tableGap: notes.top - board.bottom, footerGap: footer.top - notes.bottom };
          });
          assert.ok(benchmarkSpacing.tableGap >= 19.5, 'table notes need at least 20px of space');
          assert.ok(benchmarkSpacing.footerGap >= 15.5, 'version and report links need at least 16px of space');
          if (process.env.COMET_FOOTER_SCREENSHOTS) {
            fs.mkdirSync(process.env.COMET_FOOTER_SCREENSHOTS, { recursive: true });
            await footer.screenshot({ path: path.join(process.env.COMET_FOOTER_SCREENSHOTS, `footer-${locale}-${width}.png`) });
          }
          if (width === 1280) {
            await footer.locator('.comet-home__footer-language a:not([aria-current])').click();
            await page.waitForURL(`**/${locale === 'zh' ? 'en' : 'zh'}/home`);
          }
        } finally { await page.close(); }
      });
    }
  } finally { await browser.close(); }
});

test(`${locale} footer particles follow scrolling, use the homepage font, and respond to the pointer`, async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  try {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/player.bilibili.com/**', route => route.abort());
    await page.goto(`${base}/${locale}/home`, { waitUntil: 'domcontentloaded' });
    await page.locator('.comet-home__loader.is-hidden').waitFor({ state: 'attached' });
    const art = page.locator('.comet-home__footer-wordmark-art');
    await page.locator('[data-particles-ready="true"]').waitFor({ state: 'attached' });
    await art.evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - innerHeight + 20, behavior: 'instant' }));
    await page.waitForFunction(() => Number(document.querySelector('[data-footer-progress]')?.dataset.footerProgress) > 0);
    const initial = Number(await art.getAttribute('data-footer-progress'));
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForFunction(() => Number(document.querySelector('[data-footer-progress]')?.dataset.footerProgress) >= 0.999);
    assert.ok(Number(await art.getAttribute('data-footer-progress')) > initial);
    assert.ok(Number(await art.getAttribute('data-footer-particles')) > 100);
    const typography = await page.evaluate(() => ({
      title: getComputedStyle(document.querySelector('#comet-home-title')).fontFamily,
      wordmark: getComputedStyle(document.querySelector('.comet-home__footer-wordmark-text')).fontFamily,
    }));
    assert.equal(typography.wordmark, typography.title);
    const canvas = art.locator('canvas');
    const before = await canvas.evaluate(element => element.toDataURL());
    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.waitForFunction(previous => document.querySelector('.comet-home__footer-wordmark-canvas').toDataURL() !== previous, before);
    await page.mouse.move(5, 5);
    if (process.env.COMET_FOOTER_SCREENSHOTS) {
      await page.locator('.comet-home__footer').screenshot({ path: path.join(process.env.COMET_FOOTER_SCREENSHOTS, `footer-motion-${locale}.png`) });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await canvas.isVisible(), false);
    assert.equal(await art.locator('span').isVisible(), true);
    assert.deepEqual(errors, []);
    await page.locator('#topbar-cta-button a').hover();
    const headerHover = await page.locator('#topbar-cta-button a > span').evaluate(element => ({
      color: getComputedStyle(element).backgroundColor,
      opacity: Number(getComputedStyle(element).opacity),
    }));
    await page.locator('.comet-home__footer-docs').hover();
    assert.equal(await page.locator('.comet-home__footer-docs').evaluate(element => getComputedStyle(element).boxShadow), 'none');
    const matchesHeader = await page.locator('.comet-home__footer-docs').evaluate((element, header) => {
      const sample = document.createElement('canvas').getContext('2d');
      sample.globalAlpha = header.opacity;
      sample.fillStyle = header.color;
      sample.fillRect(0, 0, 1, 1);
      const expected = [...sample.getImageData(0, 0, 1, 1).data];
      sample.clearRect(0, 0, 1, 1);
      sample.globalAlpha = 1;
      sample.fillStyle = getComputedStyle(element).backgroundColor;
      sample.fillRect(0, 0, 1, 1);
      return [...sample.getImageData(0, 0, 1, 1).data].every((value, index) => Math.abs(value - expected[index]) <= 1);
    }, headerHover);
    assert.equal(matchesHeader, true, 'footer and header buttons must use the same hover highlight');
    await page.locator('.comet-home__footer-docs').click();
    await page.waitForURL(`**/${locale}/overview`);
    assert.ok((await page.locator('#page-title').innerText()).includes('Comet'));
  } finally { await page.close(); await browser.close(); }
});
}
