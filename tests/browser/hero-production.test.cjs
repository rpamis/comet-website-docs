const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '../..');
const css = fs.readFileSync(path.join(root, 'custom.css'), 'utf8');
// Production adds these display:contents zoom wrappers around both pictures
// and images. mint dev does not, so test the deployed DOM shape explicitly.
const zoom = (html) => `<span data-ramka-trigger class="zoom-image-trigger contents"><span class="contents">${html}</span><button hidden>Zoom</button></span>`;
const image = (kind, file, wrapped) => {
  const img = `<img src="http://comet.test/img/${file}" width="480" height="480" class="comet-home__title-inline-img comet-home__title-inline-img--${kind}">`;
  return wrapped ? zoom(`<picture class="contents">${img}</picture>`) : img;
};

async function fixture(browser, wrapped) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route('http://comet.test/img/**', route => route.fulfill({
    path: path.join(root, 'img', new URL(route.request().url()).pathname.split('/').pop()),
  }));
  const animation = `<picture class="comet-home__title-animation">${image('animated', 'home-lin-entrance-original.gif', wrapped)}</picture>`;
  await page.setContent(`<style>${css}\n.contents{display:contents}</style><div class="comet-home"><section class="comet-home__hero"><h1 id="comet-home-title">从<span class="comet-home__title-illustration is-playing">${wrapped ? zoom(animation) : animation}${image('poster', 'home-lin-original-still.png', wrapped)}</span>想法到实现<br><span class="comet-home__title-accent">只需要 /comet 一个命令</span></h1></section></div>`);
  await page.locator('#comet-home-title img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  return page;
}

test('production zoom wrappers do not expose the poster over the playing GIF', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await fixture(browser, true);
    const layers = await page.evaluate(() => {
      const slot = document.querySelector('.comet-home__title-illustration');
      const poster = slot.querySelector('.comet-home__title-inline-img--poster');
      const animation = slot.querySelector('.comet-home__title-inline-img--animated');
      const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
      return { posterOpacity:getComputedStyle(poster).opacity, animation:rect(animation), poster:rect(poster) };
    });
    assert.equal(layers.posterOpacity, '0', 'the static PNG must be hidden throughout GIF playback');
    assert.deepEqual(layers.animation, layers.poster, 'production wrappers must not change image placement');
    const firstFrame = await page.locator('.comet-home__title-illustration').screenshot();
    await page.waitForTimeout(700);
    const laterFrame = await page.locator('.comet-home__title-illustration').screenshot();
    assert.notEqual(Buffer.compare(firstFrame, laterFrame), 0, 'the visible illustration must actually animate');
  } finally { await browser.close(); }
});

test('removing the GIF layer does not move either headline line', async (t) => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const wrapped of [false, true]) {
      await t.test(wrapped ? 'production wrappers' : 'plain preview DOM', async () => {
        const page = await fixture(browser, wrapped);
        try {
          const measure = () => page.evaluate(() => {
            const title = document.querySelector('#comet-home-title');
            const first = document.createRange(); first.selectNodeContents(title.firstChild);
            const second = title.querySelector('.comet-home__title-accent');
            return { first:first.getBoundingClientRect().y, second:second.getBoundingClientRect().y };
          });
          const before = await measure();
          await page.evaluate(() => {
            const slot = document.querySelector('.comet-home__title-illustration');
            slot.classList.replace('is-playing', 'is-complete');
            slot.querySelector('.comet-home__title-animation').hidden = true;
          });
          const after = await measure();
          for (const line of ['first', 'second']) assert.ok(Math.abs(before[line] - after[line]) < 0.1,
            `${line} headline line moved ${after[line] - before[line]}px during the GIF/PNG handoff`);
        } finally { await page.close(); }
      });
    }
  } finally { await browser.close(); }
});
