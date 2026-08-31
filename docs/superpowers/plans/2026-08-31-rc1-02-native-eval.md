# RC1 02 Native Evaluation Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `img/rc1-highlights-v2/02-native-eval.png` with a pure-white 3:4 product infographic that combines three-generation reliability, Native-vs-Classic Token and duration reductions, and RC1-vs-Beta16 duration improvement.

**Architecture:** Generate one raster candidate from the approved copy and layout, then copy it into the existing stable asset path. Normalize neutral near-white background pixels to exact `#FFFFFF` without changing colored content, and verify dimensions, corners, text, and Git scope before committing and pushing.

**Tech Stack:** Built-in OpenAI image generation, PNG, PowerShell, .NET `System.Drawing`, Git.

## Global Constraints

- Output path is exactly `img/rc1-highlights-v2/02-native-eval.png`.
- Canvas ratio is exactly 3:4 portrait; no non-uniform scaling or vertically stretched typography.
- Background and all four corners are exact `#FFFFFF`.
- Reuse the repository Comet logo without changing its aspect ratio.
- Copy is declarative and professional; do not use rhetorical questions or “不是……而是……” constructions.
- Reliability values are Classic `89.58% / 75%`, Beta16 `95.83% / 87.5%`, and RC1 `100% / 100%` for `strict pass@1 / pass³`.
- Efficiency values are `Native vs Classic: 总 Token −76.8%, 模型耗时 −47.4%` and `RC1 vs Beta16: 平均模型耗时 −22.3%`.
- Footer is `16 个真实任务 · 每个任务运行 3 次`.
- Do not claim RC1 reduces Token versus Beta16.

---

### Task 1: Generate and select the infographic

**Files:**
- Read: `logo/favicon.png`
- Read: `img/rc1-highlights-v2/02-native-eval.png`
- Modify: `img/rc1-highlights-v2/02-native-eval.png`

**Interfaces:**
- Consumes: approved copy and layout from `docs/superpowers/specs/2026-08-31-rc1-02-native-eval-design.md`.
- Produces: a single 3:4 PNG at `img/rc1-highlights-v2/02-native-eval.png`.

- [ ] **Step 1: Inspect the current target and logo**

Use the image viewer for both files. Confirm the current target is the edit subject and `logo/favicon.png` is the brand reference.

- [ ] **Step 2: Generate one infographic candidate**

Use the built-in image generation tool with this exact production prompt:

```text
Use case: infographic-diagram
Asset type: Comet RC1 release highlight, portrait social product infographic
Primary request: Create a clean, abstract, number-led Chinese product infographic about Comet Native evaluation. Use a strict 3:4 portrait canvas and exact pure white background. The composition should feel like a polished software product launch graphic, restrained and professional.
Input images: Image 1 is the current 02 layout reference; Image 2 is the exact Comet logo reference. Preserve the logo aspect ratio and visual identity.
Composition: Place the small Comet logo at upper left. Make “约 100 行” the largest headline, with “Native Skill” and “承载复杂长程工作流” directly beside or below it. In the middle, use an abstract ascending staircase, nested bands, or stepped blocks to show three generations. Show Classic “89.58% / 75%”, Beta16 “95.83% / 87.5%”, RC1 “100% / 100%”, labeled “strict pass@1 / pass³”. Below, use two flat comparison groups: “Native vs Classic” with “总 Token −76.8%” and “模型耗时 −47.4%”; “RC1 vs Beta16” with “平均模型耗时 −22.3%”. At the bottom show “16 个真实任务 · 每个任务运行 3 次”.
Style/medium: minimal flat editorial infographic, crisp geometric shapes, generous balanced whitespace, deep ink typography, restrained Comet cyan-blue accents, gray for Classic and muted blue-gray for Beta16.
Text (verbatim): “约 100 行”; “Native Skill”; “承载复杂长程工作流”; “Classic”; “89.58% / 75%”; “Beta16”; “95.83% / 87.5%”; “RC1”; “100% / 100%”; “strict pass@1 / pass³”; “Native vs Classic”; “总 Token −76.8%”; “模型耗时 −47.4%”; “RC1 vs Beta16”; “平均模型耗时 −22.3%”; “16 个真实任务 · 每个任务运行 3 次”.
Constraints: every text string must be legible and exact; natural-width modern sans-serif typography; keep all text horizontally aligned; exact pure white #FFFFFF background; balanced margins; no non-uniform scaling; no vertically stretched letters; no additional statistics.
Avoid: beige, ivory, warm gray background, gradients covering the canvas, glass cards, dashboard UI, 3D devices, perspective distortion, timelines drawn as simple lines, decorative clutter, giant title occupying the whole page, rhetorical copy, “不是……而是……”, watermarks.
```

- [ ] **Step 3: Copy the selected generated PNG into the target path**

Run:

```powershell
$generated = Get-ChildItem -LiteralPath "$env:CODEX_HOME\generated_images" -File -Filter *.png |
  Sort-Object LastWriteTimeUtc -Descending |
  Select-Object -First 1
Copy-Item -LiteralPath $generated.FullName -Destination 'img\rc1-highlights-v2\02-native-eval.png' -Force
```

- [ ] **Step 4: Inspect the workspace copy**

Use the image viewer on `img/rc1-highlights-v2/02-native-eval.png`. Reject and regenerate if any required string is wrong, typography is vertically stretched, the composition is crowded, or the generation contains an unapproved claim.

### Task 2: Normalize, verify, commit, and push

**Files:**
- Modify: `img/rc1-highlights-v2/02-native-eval.png`
- Verify: `docs/superpowers/specs/2026-08-31-rc1-02-native-eval-design.md`

**Interfaces:**
- Consumes: selected Task 1 PNG.
- Produces: verified asset commit pushed to `origin/rc1`.

- [ ] **Step 1: Normalize neutral near-white background pixels**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
$target = (Resolve-Path 'img\rc1-highlights-v2\02-native-eval.png').Path
$temporary = "$target.normalized.png"
$source = [System.Drawing.Bitmap]::new($target)
$bitmap = [System.Drawing.Bitmap]::new($source)
$source.Dispose()
for ($y = 0; $y -lt $bitmap.Height; $y++) {
  for ($x = 0; $x -lt $bitmap.Width; $x++) {
    $pixel = $bitmap.GetPixel($x, $y)
    $max = [Math]::Max($pixel.R, [Math]::Max($pixel.G, $pixel.B))
    $min = [Math]::Min($pixel.R, [Math]::Min($pixel.G, $pixel.B))
    if ($pixel.A -eq 255 -and $min -ge 244 -and ($max - $min) -le 4) {
      $bitmap.SetPixel($x, $y, [System.Drawing.Color]::White)
    }
  }
}
$bitmap.Save($temporary, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()
Move-Item -LiteralPath $temporary -Destination $target -Force
```

- [ ] **Step 2: Verify geometry and border pixels**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
$bitmap = [System.Drawing.Bitmap]::new((Resolve-Path 'img\rc1-highlights-v2\02-native-eval.png').Path)
$corners = @(
  $bitmap.GetPixel(0, 0),
  $bitmap.GetPixel($bitmap.Width - 1, 0),
  $bitmap.GetPixel(0, $bitmap.Height - 1),
  $bitmap.GetPixel($bitmap.Width - 1, $bitmap.Height - 1)
)
[pscustomobject]@{
  Width = $bitmap.Width
  Height = $bitmap.Height
  Ratio = [Math]::Round($bitmap.Width / $bitmap.Height, 6)
  Corners = ($corners | ForEach-Object { '#{0:X2}{1:X2}{2:X2}' -f $_.R, $_.G, $_.B }) -join ', '
}
$bitmap.Dispose()
```

Expected: `Ratio` is `0.75` and `Corners` is `#FFFFFF, #FFFFFF, #FFFFFF, #FFFFFF`.

- [ ] **Step 3: Perform final visual inspection**

Use the image viewer at original detail. Verify all approved text, normal typography proportions, pure-white background, correct hierarchy, and readable comparison labels.

- [ ] **Step 4: Verify Git scope**

Run `git status --short`, `git diff --check`, and `git diff --stat`. Expected: the implementation diff contains only `img/rc1-highlights-v2/02-native-eval.png`; the already committed spec and plan do not appear as unstaged changes.

- [ ] **Step 5: Commit the image**

Run `git add -- img/rc1-highlights-v2/02-native-eval.png` and `git commit -m "fix: expand RC1 native evaluation comparison"`.

- [ ] **Step 6: Push and verify the remote head**

Run `git push origin rc1`, `git fetch origin rc1`, `git rev-parse HEAD`, `git rev-parse origin/rc1`, and `git status --short --branch`. Expected: local `HEAD` equals `origin/rc1`, and the worktree is clean.
