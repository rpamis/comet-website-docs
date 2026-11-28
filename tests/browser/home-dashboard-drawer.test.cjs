const { test } = require('node:test');
const { chromium } = require(process.env.COMET_PLAYWRIGHT_MODULE || 'playwright');

const base = process.env.COMET_DOCS_URL || 'http://localhost:3000';
const labels = {
  zh: {
    custom: '自定义工作流',
    classic: 'Classic 工作流',
    step: '实现工作流步骤',
    details: '步骤与验证详情',
  },
  en: {
    custom: 'Custom workflows',
    classic: 'Classic workflow',
    step: 'Implement workflow steps',
    details: 'Step and verification details',
  },
};

test('the homepage Dashboard accepts clicks after closing step details', async (t) => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE }
      : {}),
  });
  try {
    for (const [locale, width, dismissal] of [
      ['zh', 1600, 'button'],
      ['en', 1280, 'mask'],
      ['zh', 390, 'escape'],
    ]) {
      await t.test(`${locale} at ${width}px, close via ${dismissal}`, async () => {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        page.setDefaultTimeout(5000);
        try {
          const names = labels[locale];
          await page.goto(`${base}/${locale}/home`, { waitUntil: 'domcontentloaded' });
          const demo = page.locator('.comet-dashboard-website-mount');
          await demo.getByText(names.custom, { exact: true }).first().click({ timeout: 20000 });
          const step = demo.locator('.any-flow-node').filter({ hasText: names.step });
          await step.click();

          const drawer = demo.getByRole('dialog', { name: names.details });
          await drawer.waitFor({ state: 'visible' });
          if (dismissal === 'mask') {
            await demo.locator('.ant-drawer-open .ant-drawer-mask').click();
          } else if (dismissal === 'escape') {
            await page.keyboard.press('Escape');
          } else {
            await drawer.getByRole('button', { name: /^(close|关闭)$/i }).click();
          }
          await drawer.waitFor({ state: 'hidden' });

          await demo.getByText(names.classic, { exact: true }).first().click();
          await demo
            .locator('.ant-menu-item-selected')
            .filter({ hasText: names.classic })
            .waitFor({ state: 'visible' });
        } finally {
          await page.close();
        }
      });
    }
  } finally {
    await browser.close();
  }
});
