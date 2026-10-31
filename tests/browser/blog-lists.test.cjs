// Requires `mint dev` and Playwright. Run: node --test tests/browser/blog-lists.test.cjs
// For external tooling, COMET_PLAYWRIGHT_MODULE can point to its Playwright module.
// COMET_DOCS_URL and COMET_CHROMIUM_EXECUTABLE optionally override the server/browser.
const assert = require("node:assert/strict");
const { test } = require("node:test");
const locale = process.env.COMET_BLOG_LOCALE || "zh";
const { chromium } = require(
  process.env.COMET_PLAYWRIGHT_MODULE || "playwright",
);

test("blog prose preserves paragraphs and ordered, unordered and nested list markers", async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.COMET_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.COMET_CHROMIUM_EXECUTABLE }
      : {}),
  });
  try {
    const page = await browser.newPage();
    const base = process.env.COMET_DOCS_URL || "http://localhost:3000";
    for (const [slug, tag, expected] of [
      ["comet-beyond-skill", "ol", "decimal"],
      ["why-eval", "ul", "disc"],
    ]) {
      await page.goto(`${base}/${locale}/tech-blog/${slug}`, {
        waitUntil: "networkidle",
      });
      await page.locator(".comet-blog-post__body").waitFor();
      const paragraphs = await page
        .locator('.comet-blog-post__body > :is(p, span[data-as="p"])')
        .evaluateAll((nodes) => nodes.map((node) => ({
          display: getComputedStyle(node).display,
          marginBottom: parseFloat(getComputedStyle(node).marginBottom),
        })));
      assert.ok(paragraphs.length > 1, `${slug}: real Markdown paragraphs`);
      assert.ok(paragraphs.every((p) => p.display === "block"));
      assert.ok(paragraphs.slice(0, -1).every((p) => p.marginBottom > 0));
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        const lists = await page
          .locator(`.comet-blog-post__body ${tag}`)
          .evaluateAll((nodes) =>
            nodes.map((list) => ({
              type: getComputedStyle(list).listStyleType,
              position: getComputedStyle(list).listStylePosition,
              items: [...list.children]
                .filter((item) => item.tagName === "LI")
                .map((item) => getComputedStyle(item).display),
            })),
          );
        assert.ok(lists.length, `${slug}: rendered ${tag} lists must exist`);
        for (const list of lists) {
          assert.equal(
            list.type,
            expected,
            `${slug} at ${width}px: ${tag} marker`,
          );
          assert.equal(list.position, "outside");
          assert.ok(list.items.length);
          assert.ok(list.items.every((display) => display === "list-item"));
        }
      }
      // The separate table of contents deliberately remains unnumbered.
      assert.equal(
        await page
          .locator(".comet-blog-post__toc ol")
          .evaluate((list) => getComputedStyle(list).listStyleType),
        "none",
      );
    }
    // Exercise mixed nesting and non-default numbering in the real page/CSS.
    await page.locator(".comet-blog-post__body").evaluate((body) => {
      const fixture = document.createElement("div");
      fixture.id = "blog-list-regression";
      fixture.innerHTML =
        "<ul><li>Outer bullet<ol start='3'><li>Numbered item<ul><li>Inner bullet</li></ul></li></ol></li></ul>";
      body.append(fixture);
    });
    assert.deepEqual(
      await page
        .locator("#blog-list-regression ul, #blog-list-regression ol")
        .evaluateAll((lists) =>
          lists.map((list) => getComputedStyle(list).listStyleType),
        ),
      ["disc", "decimal", "disc"],
    );
    assert.equal(
      await page.locator("#blog-list-regression ol").getAttribute("start"),
      "3",
    );
  } finally {
    await browser.close();
  }
});
