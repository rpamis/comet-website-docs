import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

for (const file of [
  'native-version-report.jsx',
  'native-goal-report.jsx',
  'native-version-report-en.jsx',
  'native-goal-report-en.jsx',
]) {
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
for (const [stem, expectedCells] of [
  ['native-version-report', 63],
  ['native-goal-report', 148],
]) {
  test(`${stem} preserves scores and run provenance in English`, () => {
    const embedded = (file) => {
      const source = readFileSync(new URL(`../snippets/${file}.jsx`, import.meta.url), 'utf8');
      const literal = source.match(/srcDoc=\{\s*('(?:[^'\\]|\\[\s\S])*')\s*\}/u);
      assert.ok(literal);
      return vm.runInNewContext(literal[1]);
    };
    const original = embedded(stem);
    const english = embedded(`${stem}-en`);
    const numericCells = (html) =>
      [...html.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gu)]
        .map((match) => match[1].replace(/<[^>]*>/gu, '').trim())
        .filter((text) => /^[\d.,+−%/s×\s-]+$/u.test(text));
    assert.equal(numericCells(original).length, expectedCells);
    assert.deepEqual(numericCells(english), numericCells(original));
    const runs = (html) =>
      html.match(/comet-eval-[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}/gu) ?? [];
    assert.deepEqual(runs(english), runs(original));
    assert.match(english, /<html lang="en">/u);
    assert.doesNotMatch(english, /\p{Script=Han}|\/zh\//u);
  });
}
