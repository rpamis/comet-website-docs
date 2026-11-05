# Animation generated from the original reference alone

The sole image passed to the generation model was `img/home-lin.png`.
No previous animation sheet or redesigned character was used as a reference.
The exact generation instructions are saved in `prompt.txt`.

`spritesheet.png` contains nine newly generated frames in a 3 × 3 grid.
Larger cells retain finer graphite detail than the earlier 4 × 4 attempts.
The animation opens the palms, reveals blue stars, blinks once, then holds
with eyes open. The left body-side contour and unfinished lower arm outlines
remain visible, without a horizontal bottom closing line or blurred fade.

`build.cjs` uses the complete cells and applies the same uniform resize to
every frame. It does not patch old body parts, warp anatomy, or change the
original reference file. It normalizes only near-white neutral highlights
and exports a dithered GIF plus the lossless decoded last frame:

- `img/home-lin-entrance-original.gif`: 480 × 480, nine frames, one 2,860 ms pass.
- `img/home-lin-original-still.png`: pixel-identical to the final GIF frame.

The generated artwork uses an opaque white canvas to match the homepage.
The original reference PNG is unchanged. Unused trial GIFs and PNGs were
removed from `img/` after selecting this version.
Both homepages load the GIF first and then display the decoded tail PNG in
the same position. Reduced motion shows the PNG directly.

`comparison.png` shows the original, the preceding proportional revision,
and this version from left to right, each normalized to 480 × 480. These
generated frames are redraws: the filename denotes the sole reference,
not pixel identity with the original artwork. Local facial and hand details
still differ. Tail/PNG identity applies only to this animation's own last frame.

Rebuild with the external tooling already installed:

```powershell
$env:NODE_PATH = Join-Path $env:TEMP 'comet-home-lin-animation-tools/node_modules'
node assets/home-lin-animation-original/build.cjs
```

The build verifies the original reference hash, dimensions, one-pass timing,
exact tail/PNG equality, the left contour, and no long bottom closing stroke.
Browser checks are in `tests/browser/hero-*.test.cjs`.

Fourteen source/browser checks passed on this version, including desktop,
mobile, slow/failed loading, reduced motion, and identical layer geometry.
Actual screenshot comparison at the tail-to-PNG handoff had a mean pixel
difference of zero. The first browser attempt found that the preview server
was stopped; it passed after restarting the preview. No production validation
or deployment was performed.
