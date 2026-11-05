import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

for (const locale of ["zh", "en"]) {
  test(`${locale} homepage holds the first pose until visible playback can start`, () => {
    const mdx = readFileSync(new URL(`../${locale}/home.mdx`, import.meta.url), "utf8");
    const hero = mdx.slice(mdx.indexOf('<h1 id="comet-home-title">'), mdx.indexOf("</h1>"));
    assert.equal(hero.match(/<img\b[^>]*?\ssrc="([^"]+)"/)?.[1], "/img/home-lin-original-start.png");
    assert.match(hero, /data-animation-src="\/img\/home-lin-entrance-original.gif"/);
    assert.match(hero, /data-animation-duration="5000"/);
    assert.match(hero, /className="comet-home__title-illustration is-playing"/);
    assert.match(hero, /<source media="\(prefers-reduced-motion: reduce\)" srcSet="\/img\/home-lin-original-still.png"/);
  });
}
