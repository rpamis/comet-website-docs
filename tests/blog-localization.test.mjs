import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const files = readdirSync(new URL('zh/tech-blog/', root)).filter((f) => f.endsWith('.mdx'));

test('English blog pages keep the Chinese article structure and stable section anchors', () => {
  assert.deepEqual(
    readdirSync(new URL('en/tech-blog/', root))
      .filter((f) => f.endsWith('.mdx'))
      .sort(),
    [...files].sort(),
  );
  for (const file of files) {
    const zh = read(`zh/tech-blog/${file}`);
    const en = read(`en/tech-blog/${file}`);
    assert.match(en, /mode:\s*(['"])custom\1/, file);
    assert.doesNotMatch(en, /\p{Script=Han}|\/zh\//u, file);
    const headings = (s) => [...s.matchAll(/<h2 id="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(headings(en), headings(zh), file);
    assert.equal((en.match(/^```/gm) || []).length % 2, 0, `${file}: paired code fences`);
    const imported = en.match(/import Experiment from ['"]([^'"]+)['"]/);
    const content = imported ? `${en}\n${read(imported[1].slice(1))}` : en;
    const ids = new Set([...content.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, id] of en.matchAll(/href="#([^"]+)"/g))
      assert.ok(ids.has(decodeURIComponent(id)), `${file}: #${id}`);
    for (const [, path] of en.matchAll(/(?:href="|\]\()(\/en\/[^"\s)#]+)/g)) {
      assert.ok(
        existsSync(new URL(`${path.slice(1)}.mdx`, root)) ||
          existsSync(new URL(`${path.slice(1)}/index.mdx`, root)),
        `${file}: ${path}`,
      );
    }
  }
});

for (const locale of ['zh', 'en']) {
  test(`${locale} evaluation experiment column is complete, dated, and linked to shared reports`, () => {
    const index = read(`${locale}/tech-blog/index.mdx`);
    const section = index.match(/<section\s+id="eval-experiments"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, 'evaluation experiment column');
    const links = [...section.matchAll(/href="\/[^/]+\/tech-blog\/([^"]+)"/g)].map(
      (match) => match[1],
    );
    const dates = [...section.matchAll(/data-experiment-date="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(links.length, 6);
    assert.equal(dates.length, links.length);
    assert.deepEqual(dates, [...dates].sort().reverse(), 'newest experiments first');
    const covers = [...section.matchAll(/<img\s+src="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(covers).size, links.length, 'a distinct cover per article');
    const language = JSON.parse(read('docs.json')).navigation.languages.find(
      (entry) => entry.language === locale,
    );
    const group = language.versions[0].tabs
      .flatMap((tab) => tab.groups)
      .find((entry) =>
        entry.pages?.includes(`${locale}/eval/comet-native-clarification-experiment`),
      );
    assert.deepEqual(
      [...links].sort(),
      group.pages.map((page) => page.split('/').at(-1)).sort(),
      'every real experiment is listed',
    );
    const clarification = group.pages.indexOf(
      `${locale}/eval/comet-native-clarification-experiment`,
    );
    assert.deepEqual(group.pages.slice(clarification + 1, clarification + 3), [
      `${locale}/eval/comet-native-053-vs-040-rc1-experiment`,
      `${locale}/eval/comet-native-053-vs-goal-experiment`,
    ]);
    links.forEach((slug, index) => {
      const blog = read(`${locale}/tech-blog/${slug}.mdx`);
      const docs = read(`${locale}/eval/${slug}.mdx`);
      const shared = (source) => source.match(/import Experiment from ['"]([^'"]+)['"]/)[1];
      assert.equal(shared(blog), shared(docs), 'blog and docs use one report body');
      assert.match(
        read(shared(blog).slice(1)),
        /(?:Baseline|NativeClassic|Clarification|Rc1Beta16|MemoryDisabled|NativeGoal|NativeVersion)Report(?:En)?\b/,
        'full HTML report is retained',
      );
      assert.ok(existsSync(new URL(covers[index].slice(1), root)), covers[index]);
      assert.doesNotMatch(blog, /comet-blog-post__cover/, 'covers belong to the index cards');
      assert.match(blog, /comet-blog-post__layout/);
      assert.match(blog, /<Experiment\s*\/>/);
    });
  });
}

test('both blog indexes use the same inline banner and artwork', () => {
  const zh = read('zh/tech-blog/index.mdx');
  const en = read('en/tech-blog/index.mdx');
  const images = (s) => [...s.matchAll(/<img\s+src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(images(en), images(zh));
  assert.equal(images(en).length, 14);
  assert.equal((en.match(/\bnoZoom\b/g) || []).length, 14);
  assert.match(en, /loading="eager"\s+fetchPriority="high"/);
  assert.match(en, /<BlogLandscape lang="en"\s*\/>/);
  for (const path of images(en)) assert.ok(existsSync(new URL(path.slice(1), root)), path);
});

test('both languages register all blog pages in hidden navigation groups', () => {
  const config = JSON.parse(read('docs.json'));
  for (const locale of ['zh', 'en']) {
    const language = config.navigation.languages.find((entry) => entry.language === locale);
    const group = language.versions[0].tabs[0].groups.find((entry) =>
      entry.pages?.includes(`${locale}/tech-blog/index`),
    );
    assert.equal(group?.hidden, true);
    assert.deepEqual(
      [...group.pages].sort(),
      files.map((file) => `${locale}/tech-blog/${file.replace(/\.mdx$/, '')}`).sort(),
    );
  }
});
