import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../snippets/capability-dither.jsx", import.meta.url), "utf8");

// Run the actual canvas renderer at fixed times and sample only the exposed
// background strips, excluding the opaque application panels.
function mount(reduce = false) {
  const canvases = [];
  let scheduled;
  let cleanup;
  const document = {
    visibilityState: "visible",
    addEventListener() {}, removeEventListener() {},
    querySelector: () => ({
      querySelector: () => ({
        querySelector: () => null,
        prepend: (canvas) => canvases.push(canvas),
      }),
    }),
    createElement: () => {
      const canvas = {
        dataset: {}, setAttribute() {}, remove() {},
        getBoundingClientRect: () => ({ width: 375, height: 382.5 }),
        getContext: () => ({
          createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
          putImageData: (image) => { canvas.pixels = image.data.slice(); },
        }),
      };
      return canvas;
    },
  };
  vm.runInNewContext(source.replace("export const", "const") + "\nCapabilityDitherController();", {
    document, performance: { now: () => 0 },
    useEffect: (effect) => { cleanup = effect(); },
    window: {
      matchMedia: () => ({ matches: reduce, addEventListener() {}, removeEventListener() {} }),
      requestAnimationFrame: (callback) => { scheduled = callback; return 1; },
      cancelAnimationFrame: () => { scheduled = null; },
    },
  });
  return {
    canvases, document, cleanup,
    tick: (time) => { const callback = scheduled; scheduled = null; callback?.(time); },
    get scheduled() { return scheduled; },
  };
}

function visibleSamples(canvas, index) {
  const values = [];
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const exposed = index === 1
        ? x / canvas.width > 0.93 || y / canvas.height > 0.92
        : x / canvas.width < 0.08 || y / canvas.height < 0.08;
      if (!exposed) continue;
      const offset = (y * canvas.width + x) * 4;
      values.push((canvas.pixels[offset] + canvas.pixels[offset + 1] + canvas.pixels[offset + 2]) / 3);
    }
  }
  return values;
}

test("all three exposed card backgrounds visibly move within a second", () => {
  const renderer = mount();
  const totals = [0, 0, 0];
  let previous = renderer.canvases.map(visibleSamples);
  for (let time = 1000; time <= 6000; time += 1000) {
    renderer.tick(time);
    renderer.canvases.forEach((canvas, index) => {
      const current = visibleSamples(canvas, index);
      totals[index] += current.reduce((sum, value, i) => sum + Math.abs(value - previous[index][i]), 0) / current.length;
      previous[index] = current;
    });
  }
  renderer.cleanup();
  totals.forEach((total, index) => assert.ok(total / 6 >= 4,
    `card ${index + 1}: one-second brightness change ${ (total / 6).toFixed(2) }/255 is too subtle`));
});

test("reduced motion keeps the texture still and hidden pages stop drawing", () => {
  const reduced = mount(true);
  assert.equal(reduced.scheduled, undefined);
  const still = reduced.canvases.map((canvas) => canvas.pixels.slice());
  reduced.tick(1000);
  reduced.canvases.forEach((canvas, index) => assert.deepEqual(canvas.pixels, still[index]));
  reduced.cleanup();

  const renderer = mount();
  renderer.document.visibilityState = "hidden";
  renderer.tick(1000);
  assert.equal(renderer.scheduled, null);
  renderer.cleanup();
});
