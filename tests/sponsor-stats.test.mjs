import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../snippets/sponsor-stats.jsx', import.meta.url), 'utf8');

function mount({ reduced = false, observerAvailable = true } = {}) {
  const nodes = [
    { textContent: '128.98K', dataset: { sponsorCount: '128.98', countDecimals: '2', countSuffix: 'K' } },
    { textContent: '58w+', dataset: { sponsorCount: '58', countSuffix: 'w+' } },
  ];
  let cleanup, notify, motionChange, nextId = 0;
  const frames = new Map();
  const motion = {
    matches: reduced,
    addEventListener: (_, callback) => { motionChange = callback; },
    removeEventListener: () => { motionChange = undefined; },
  };
  const window = {
    matchMedia: () => motion,
    requestAnimationFrame: callback => { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: observerAvailable ? class {
      constructor(callback) { notify = callback; }
      observe() {}
      unobserve() {}
      disconnect() {}
    } : undefined,
  };
  const component = new Function('useEffect', 'document', 'window',
    source.replace('export const', 'const') + '; return SponsorStats;')(
      effect => { cleanup = effect(); }, { querySelectorAll: () => nodes }, window);
  component();
  return {
    nodes, frames,
    enter: node => notify([{ target: node, isIntersecting: true }]),
    step: time => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time)); },
    reduce: () => { motion.matches = true; motionChange(); },
    cleanup: () => cleanup?.(),
  };
}

test('counts only visible metrics once and preserves decimal precision and suffixes', () => {
  const view = mount();
  assert.equal(view.frames.size, 0);
  view.enter(view.nodes[0]);
  assert.equal(view.nodes[0].textContent, '0.00K');
  assert.equal(view.nodes[1].textContent, '58w+');
  view.step(0);
  view.step(800);
  assert.equal(view.nodes[0].textContent, '112.86K');
  view.step(1600);
  assert.equal(view.nodes[0].textContent, '128.98K');
  view.enter(view.nodes[0]);
  assert.equal(view.frames.size, 0);
  view.enter(view.nodes[1]);
  view.step(2000);
  view.step(3600);
  assert.equal(view.nodes[1].textContent, '58w+');
});

test('reduced motion and missing observers keep the final values visible', () => {
  for (const options of [{ reduced: true }, { observerAvailable: false }]) {
    const view = mount(options);
    assert.deepEqual(view.nodes.map(node => node.textContent), ['128.98K', '58w+']);
    assert.equal(view.frames.size, 0);
  }
});

test('unmount and enabling reduced motion cancel frames and restore final values', () => {
  for (const stop of ['cleanup', 'reduce']) {
    const view = mount();
    view.enter(view.nodes[0]);
    view.step(0);
    view[stop]();
    assert.equal(view.frames.size, 0);
    assert.equal(view.nodes[0].textContent, '128.98K');
  }
});
