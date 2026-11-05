import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

for (const locale of ["zh", "en"]) {
  test(`${locale} homepage renders the GIF first, before client-side code`, () => {
    const mdx = readFileSync(new URL(`../${locale}/home.mdx`, import.meta.url), "utf8");
    const hero = mdx.slice(mdx.indexOf('<h1 id="comet-home-title">'), mdx.indexOf("</h1>"));
    assert.equal(hero.match(/<img\s+[^>]*src="([^"]+)"/)?.[1], "/img/home-lin-entrance-original.gif");
    assert.match(hero, /className="comet-home__title-illustration is-playing"/);
    assert.match(hero, /<source media="\(prefers-reduced-motion: reduce\)" srcSet="\/img\/home-lin-original-still.png"/);
  });
}
