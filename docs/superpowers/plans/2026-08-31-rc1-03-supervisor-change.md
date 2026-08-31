# RC1 03 Supervisor Change Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `img/rc1-highlights-v2/03-supervisor-change.png` with a pure-white 3:4 abstract infographic showing one complex goal splitting into independently verified child streams and reuniting in a final verified delivery.

**Architecture:** Generate one image from the approved flat orchestration-track concept while using 02, 06, and 07 as positive v2 style references, the current 03 as the replacement target, 08 as an exclusion reference, and the repository favicon as the brand reference. Copy the selected PNG into the stable 03 path, normalize neutral near-white background pixels to exact white, then verify geometry, visual semantics, copy, and Git scope before committing and pushing.

**Tech Stack:** Built-in OpenAI image generation, PNG, PowerShell, .NET `System.Drawing`, Git.

## Global Constraints

- Output path is exactly `img/rc1-highlights-v2/03-supervisor-change.png`.
- Canvas ratio is exactly 3:4 portrait; no non-uniform scaling or vertically stretched typography.
- Background and all four corners are exact `#FFFFFF`.
- Reuse `logo/favicon.png` without changing its aspect ratio.
- Primary copy is `Supervisor Change`, `复杂目标，一次统筹交付`, and `拆分独立成果 · 管理依赖 · 并行验证 · 汇聚验收`.
- The visual reads as one goal, three independently progressing child streams, dependency-aware verification, convergence, and final verification.
- Use v2's flat blue outlines, white interiors, circular status nodes, restrained arrows, deep-navy typography, and a small green final-verification accent.
- Do not use glow, volumetric light, floating rings, 3D spheres or cubes, glass effects, or conceptual technology-poster styling.
- Do not use platform icon rings, Skills/Rules/Hooks layers, a dark lower-right planet, pixel dispersion, dashboard cards, or four repeated child process columns.
- Do not add Agent counts, speed claims, success rates, or other unsupported metrics.

---

### Task 1: Generate and select the abstract Supervisor image

**Files:**
- Read: `logo/favicon.png`
- Read: `img/rc1-highlights-v2/03-supervisor-change.png`
- Read: `img/rc1-highlights-v2/08-platforms.png`
- Read: `img/rc1-highlights-v2/02-native-eval.png`
- Read: `img/rc1-highlights-v2/06-skill-eval-loop.png`
- Read: `img/rc1-highlights-v2/07-recoverable-runtime.png`
- Modify: `img/rc1-highlights-v2/03-supervisor-change.png`

**Interfaces:**
- Consumes: approved design in `docs/superpowers/specs/2026-08-31-rc1-03-supervisor-change-design.md`.
- Produces: one selected 3:4 PNG at `img/rc1-highlights-v2/03-supervisor-change.png`.

- [ ] **Step 1: Inspect the current 03, the exclusion reference 08, and the Comet logo**

Use the image viewer at original detail for all three files. Treat 03 as the replacement target, 08 as the visual language to avoid, and the favicon as the exact brand reference.

- [ ] **Step 2: Generate one candidate with the approved prompt**

Use the built-in image generation tool with this exact prompt:

```text
Use case: infographic-diagram
Asset type: Comet RC1 release highlight, portrait product infographic
Primary request: Create a flat, productized Chinese infographic for Comet Supervisor Change in the same visual family as the approved v2 release images. Show one complex Goal entering a wide flat Supervisor band, splitting into three clean two-dimensional execution tracks for Child A, Child B, and Child C. Use staggered starts and one or two short cross-track connectors to communicate dependency order. Each track reaches a flat outlined verification node, then the three tracks merge into one complete delivery band ending in a flat outlined Final Verify symbol. The image must look like a refined product architecture graphic, not a science-fiction concept poster.
Input images: Image 1 is the current 03 replacement target and should be fully replaced. Image 2 is 08 and is an exclusion reference: do not repeat its orbital platform network, central number, pixel planet, or lower-right dark arc. Images 3, 4, and 5 are positive v2 style references: match their flat blue outlines, deep-navy typography, white modules, circular nodes, restrained arrows, and small green verification accents. Image 6 is the exact Comet logo reference; preserve its identity and aspect ratio.
Scene/backdrop: exact pure white #FFFFFF canvas.
Composition: strict 3:4 portrait. Small Comet logo at upper left. At the top, place “Supervisor Change”, then “复杂目标，一次统筹交付” and the concise line “拆分独立成果 · 管理依赖 · 并行验证 · 汇聚验收”. Use the middle and lower area for a spacious top-to-bottom flat orchestration map. Place Goal and Supervisor as compact flat modules, branch into three offset tracks, and merge near the lower center. Optional small structural labels are “Goal”, “Supervisor”, “Child A”, “Child B”, “Child C”, “Verified”, and “Final Verify”.
Style/medium: minimal flat editorial product infographic, crisp vector-like strokes, consistent line weight, white interiors, subtle local blue fills only, generous whitespace, premium software product launch aesthetic aligned with images 3, 4, and 5.
Color palette: deep navy typography, Comet blue outlines and tracks, pale blue-gray supporting lines, and one restrained green final-verification accent.
Text (verbatim): “Supervisor Change”; “复杂目标，一次统筹交付”; “拆分独立成果 · 管理依赖 · 并行验证 · 汇聚验收”; optional “Goal”; optional “Child A”; optional “Child B”; optional “Child C”; optional “Final Verify”.
Constraints: all text must be exact and legible; natural-width sans-serif typography; keep every letter horizontally aligned; exact white background; no non-uniform scaling; no vertically stretched text; no unsupported numbers or claims.
Avoid: glow, luminous tubes, volumetric light, floating halos, floating rings, 3D spheres, 3D cubes, translucent glass, heavy shadows, science-fiction concept art, rhetorical questions, negative comparison copy, “不是……而是……”, platform logos, orbit rings, Skills/Rules/Hooks, dark planet or dark lower-right mass, pixel-square dispersion, dashboard cards, repeated child columns, dense arrow-node networks, warm beige, ivory, warm gray background, watermark.
```

- [ ] **Step 3: Copy the newest generated PNG into the target path**

Run:

```powershell
$generated = Get-ChildItem -LiteralPath "$env:CODEX_HOME\generated_images" -File -Filter *.png -Recurse |
  Sort-Object LastWriteTimeUtc -Descending |
  Select-Object -First 1
Copy-Item -LiteralPath $generated.FullName -Destination 'img\rc1-highlights-v2\03-supervisor-change.png' -Force
```

- [ ] **Step 4: Inspect and accept or regenerate**

Use the image viewer on the workspace target. Regenerate with one targeted correction if the text is wrong, the split-and-converge meaning is unclear, typography is stretched, or the output repeats 08's ring, platform, pixel-planet, or dark-arc language.

### Task 2: Normalize, verify, commit, and push

**Files:**
- Modify: `img/rc1-highlights-v2/03-supervisor-change.png`
- Verify: `docs/superpowers/specs/2026-08-31-rc1-03-supervisor-change-design.md`

**Interfaces:**
- Consumes: selected Task 1 PNG.
- Produces: verified `rc1` commit synchronized to `origin/rc1`.

- [ ] **Step 1: Normalize neutral near-white pixels**

Use `System.Drawing.Bitmap.LockBits` and a BGRA byte buffer. Change only opaque pixels whose RGB channels are all at least 244 and whose maximum channel difference is at most 4 to `255,255,255`. Save through `03-supervisor-change.png.normalized.png`, replace only the target, then remove the temporary file.

- [ ] **Step 2: Verify PNG geometry and white boundary**

Load the target through `System.Drawing.Bitmap` and print format, width, height, rounded width/height ratio, all four corner colors, and the count of non-white pixels on the full outer border. Expected: PNG, ratio `0.75`, four `#FFFFFF` corners, and `0` non-white border pixels.

- [ ] **Step 3: Perform final original-detail visual review**

Confirm exact primary copy, natural typography, a clear one-to-many-to-one narrative, visible dependency and verification cues, balanced whitespace, visual consistency with v2, no glow or 3D effect, and no visual vocabulary copied from 08.

- [ ] **Step 4: Verify repository scope**

Run `git diff --check`, `git status --short`, and `git diff --stat`. Expected: the implementation diff contains only `img/rc1-highlights-v2/03-supervisor-change.png`.

- [ ] **Step 5: Commit the image**

Run `git add -- img/rc1-highlights-v2/03-supervisor-change.png` and `git commit -m "fix: abstract RC1 supervisor visual"`.

- [ ] **Step 6: Push and verify the remote head**

Run `git push origin rc1`, `git fetch origin rc1`, `git rev-parse HEAD`, `git rev-parse origin/rc1`, and `git status --short --branch`. Expected: local `HEAD` equals `origin/rc1`, and the worktree is clean.
