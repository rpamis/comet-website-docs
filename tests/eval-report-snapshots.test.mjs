import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const snapshots = new Map();
for (const file of readdirSync(new URL('snippets/eval-report-snapshots/', root))) {
  const source = read(`snippets/eval-report-snapshots/${file}`);
  const original = source.match(/Frozen HTML from (\/assets\/eval-reports\/.+\.json)\./)[1];
  const literal = source.match(/srcDoc=\{("(?:[^"\\]|\\[\s\S])*")\}/u);
  const html = JSON.parse(literal[1]);
  snapshots.set(`/snippets/eval-report-snapshots/${file}`, { original, html });
  test(`${file} preserves the complete frozen HTML report`, () => {
    assert.equal(html, JSON.parse(read(original.slice(1))).html);
    assert.match(html, /<table\b/);
    assert.match(source, /sandbox="allow-downloads allow-forms allow-popups allow-scripts"/);
  });
}

test('each historical experiment embeds its own frozen report without a JSON fetch', () => {
  const expected = {
    'comet-baseline-experiment.mdx': ['baseline'],
    'comet-native-vs-040-experiment.mdx': ['native-classic'],
    'comet-native-clarification-experiment.mdx': ['clarification'],
    'comet-native-vs-rc1-beta16-experiment.mdx': ['memory-disabled', 'rc1-beta16'],
  };
  let count = 0;
  for (const locale of ['zh', 'en'])
    for (const [file, names] of Object.entries(expected)) {
      const source = read(`snippets/eval-experiments/${locale}/${file}`);
      const imports = [
        ...source.matchAll(
          /import \{ (\w+) \} from ['"]([^'"]+eval-report-snapshots\/([^/'"]+)\.jsx)['"]/g,
        ),
      ];
      assert.deepEqual(
        imports.map((match) => match[3]),
        names.map((name) =>
          locale === 'en' && /^(memory-disabled|rc1-beta16)$/.test(name) ? `${name}-en` : name,
        ),
      );
      for (const [, component, path] of imports) {
        assert.ok(source.includes(`<${component}`));
        assert.ok(snapshots.has(path));
        count++;
      }
    }
  assert.equal(count, 10);
});
