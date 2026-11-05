const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');

test('the tail-frame PNG replaces the held GIF without a visible change', async (t) => {
  const browser = await chromium.launch({ headless: true });
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  try {
    const page = await browser.newPage({ viewport: { width:1280, height:900 }, reducedMotion:'no-preference' });
    // Hold back the PNG so the GIF remains visible until the poster is ready.
    await page.route('**/home-lin-original-still.png', async route => { await gate; await route.continue(); });
    await page.goto(`${process.env.COMET_DOCS_URL || 'http://localhost:3000'}/zh/home`, { waitUntil:'domcontentloaded' });
    await page.waitForFunction(() => {
      const hero=document.querySelector('.comet-home__hero-entrance');
      const img=hero?.querySelector('.comet-home__title-inline-img--animated');
      return hero?.classList.contains('is-hero-visible') && img.complete && img.naturalWidth===480;
    });
    await page.waitForTimeout(3100);
    await page.evaluate(() => Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,3000))]));
    const slot=page.locator('.comet-home__title-illustration');
    assert.ok((await slot.getAttribute('class')).includes('is-playing'), 'keep showing the GIF while the PNG is unavailable');
    const clip=await slot.boundingBox(),cdp=await page.context().newCDPSession(page);
    const before=await cdp.send('Page.captureScreenshot',{clip:{...clip,scale:2}});
    release();
    await page.waitForFunction(() => document.querySelector('.comet-home__title-illustration')?.classList.contains('is-complete'));
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const after=await cdp.send('Page.captureScreenshot',{clip:{...clip,scale:2}});
    const difference=await page.evaluate(async({before,after})=>{
      const read=async data=>{
        const img=new Image();img.src=`data:image/png;base64,${data}`;await img.decode();
        const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
        const context=canvas.getContext('2d');context.drawImage(img,0,0);
        return context.getImageData(0,0,canvas.width,canvas.height).data;
      };
      const a=await read(before),b=await read(after);let sum=0;
      for(let p=0;p<a.length;p+=4) for(let c=0;c<3;c++) sum+=Math.abs(a[p+c]-b[p+c]);
      return sum/(a.length/4*3);
    },{before:before.data,after:after.data});
    t.diagnostic(`GIF → exact PNG mean pixel difference: ${difference.toFixed(6)} / 255`);
    assert.ok(difference<.1,'the handoff must not move, fade or redraw the image');
  } finally { release();await browser.close(); }
});
