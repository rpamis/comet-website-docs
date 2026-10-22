import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../snippets/sponsors.mdx', import.meta.url), 'utf8');
const config = JSON.parse(source.match(/export const sponsorConfig = ([\s\S]+?);/)[1]);

test('sponsor configuration has valid records, local logos, and available seats', () => {
  assert.deepEqual(Object.keys(config).sort(), ['chief', 'friend', 'premium', 'standard']);
  assert.ok(config.chief.length <= 1, 'chief sponsorship has one seat');
  assert.ok(config.premium.length <= 3, 'premium sponsorship has three seats');
  const ids = new Set();
  for (const [tier, sponsors] of Object.entries(config)) {
    assert.ok(Array.isArray(sponsors), `${tier} must contain a list`);
    for (const sponsor of sponsors) {
      assert.ok(typeof sponsor.id === 'string' && sponsor.id.trim(), 'each sponsor needs a stable id');
      assert.ok(!ids.has(sponsor.id), `duplicate sponsor id: ${sponsor.id}`);
      ids.add(sponsor.id);
      assert.ok(typeof sponsor.name === 'string' && sponsor.name.trim(), `${sponsor.id} needs a name`);
      if (tier !== 'friend' || sponsor.logo) {
        assert.match(sponsor.logo, /^\/img\//, `${sponsor.id} must use a local logo`);
        assert.ok(existsSync(new URL(`..${sponsor.logo}`, import.meta.url)), `${sponsor.id} logo is missing`);
      }
      if (sponsor.url) assert.equal(new URL(sponsor.url).protocol, 'https:', 'sponsor links must use HTTPS');
    }
  }
});
