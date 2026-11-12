import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

for (const file of ['native-version-report.jsx', 'native-goal-report.jsx']) {
  test(`${file} exposes named keyboard-scrollable report tables`, () => {
    const source = readFileSync(new URL(`../snippets/${file}`, import.meta.url), 'utf8');
    const literal = source.match(/srcDoc=\{\s*('(?:[^'\\]|\\[\s\S])*')\s*\}/u);
    assert.ok(literal, 'report is embedded as a string literal');
    const html = vm.runInNewContext(literal[1]);
    const regions = html.match(
      /<div\b[^>]*(?:class="[^"]*table-scroll[^"]*"|style="overflow-x:\s*auto")[^>]*>/gu,
    );
    assert.ok(regions?.length, 'report has horizontal table containers');
    assert.equal(
      regions.length,
      html.match(/<table\b/gu)?.length,
      'each table has a scroll region',
    );
    for (const region of regions) {
      assert.match(region, /tabindex="0"/u);
      assert.match(region, /role="region"/u);
      assert.match(region, /aria-label="[^"\s][^"]*"/u);
      assert.match(region, /class="[^"]*report-scroll-region[^"]*"/u);
    }
    assert.match(html, /\.report-scroll-region:focus-visible\s*\{[^}]*outline:\s*2px solid/u);
  });
}
