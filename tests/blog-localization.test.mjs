import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const files = readdirSync(new URL("zh/tech-blog/", root)).filter((f) =>
  f.endsWith(".mdx"),
);

test("English blog pages keep the Chinese article structure and stable section anchors", () => {
  assert.deepEqual(
    readdirSync(new URL("en/tech-blog/", root))
      .filter((f) => f.endsWith(".mdx"))
      .sort(),
    [...files].sort(),
  );
  for (const file of files) {
    const zh = read(`zh/tech-blog/${file}`);
    const en = read(`en/tech-blog/${file}`);
    assert.match(en, /mode: "custom"/, file);
    assert.doesNotMatch(en, /\p{Script=Han}|\/zh\//u, file);
    const headings = (s) =>
      [...s.matchAll(/<h2 id="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(headings(en), headings(zh), file);
    assert.equal(
      (en.match(/^```/gm) || []).length % 2,
      0,
      `${file}: paired code fences`,
    );
    const ids = new Set([...en.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, id] of en.matchAll(/href="#([^"]+)"/g))
      assert.ok(ids.has(id), `${file}: #${id}`);
    for (const [, path] of en.matchAll(/(?:href="|\]\()(\/en\/[^"\s)#]+)/g)) {
      assert.ok(
        existsSync(new URL(`${path.slice(1)}.mdx`, root)) ||
          existsSync(new URL(`${path.slice(1)}/index.mdx`, root)),
        `${file}: ${path}`,
      );
    }
  }
});

test("both blog indexes use the same inline banner and artwork", () => {
  const zh = read("zh/tech-blog/index.mdx");
  const en = read("en/tech-blog/index.mdx");
  const images = (s) => [...s.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(images(en), images(zh));
  assert.equal(images(en).length, 8);
  assert.equal((en.match(/\bnoZoom\b/g) || []).length, 8);
  assert.match(en, /loading="eager" fetchPriority="high"/);
  assert.match(en, /<BlogLandscape lang="en"\s*\/>/);
  for (const path of images(en))
    assert.ok(existsSync(new URL(path.slice(1), root)), path);
});

test("both languages register all blog pages in hidden navigation groups", () => {
  const config = JSON.parse(read("docs.json"));
  for (const locale of ["zh", "en"]) {
    const language = config.navigation.languages.find(
      (entry) => entry.language === locale,
    );
    const group = language.versions[0].tabs[0].groups.find((entry) =>
      entry.pages?.includes(`${locale}/tech-blog/index`),
    );
    assert.equal(group?.hidden, true);
    assert.deepEqual(
      [...group.pages].sort(),
      files
        .map((file) => `${locale}/tech-blog/${file.replace(/\.mdx$/, "")}`)
        .sort(),
    );
  }
});
