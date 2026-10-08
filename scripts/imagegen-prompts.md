# Sprite generation

Generated with the built-in image_gen tool. Original PNG alpha is preserved.

## Mole and monsters

Use case: stylized-concept.
Asset type: production pixel-art sprite atlas for a GitHub profile animated banner.
Primary request: draw a true low-resolution 16-bit action-game sprite sheet, 4 columns by 4 rows, exactly 16 equal square cells, on a genuinely transparent background, no grid lines, no text.
Input image: reference only. Use ONLY the brown pixel animal avatar at the left of the supplied GitHub screenshot as the palette/character inspiration. Ignore all other UI.
Character: a small, tough, cute brown MOLE, facing RIGHT in side view, very large rounded brown head, cream muzzle, small black nose and black eyes, stubby arms, squat body, dark boots. It must look like that warm brown pixel avatar, with a confident game-hero attitude.
Style: authentic hand-placed pixel art with visible coarse square pixels, chunky dark outlines, 4 shades of brown, cream muzzle. Each 256px atlas cell represents a 64x64 logical pixel canvas, so every painted pixel is an aligned 4x4 block. NO antialiasing, NO smooth gradients, NO soft outlines, NO painterly rendering, NO vector curves. Strong compact readable silhouettes.
Atlas layout: 1024x1024 square, equal 256x256 cells. Keep every sprite completely within its own cell with generous transparent margins. Every hero's feet baseline is 220px down its cell; hero height about 152px, body width about 108px. Identical character proportions across all poses. All hero poses face RIGHT.
Row 1 cells left to right: idle pose; walk with left foot forward; walk with right foot forward; crouched cyber-sword windup, short cyan blade raised behind head.
Row 2: powerful forward sword slash with a SHORT cyan katana, maximum blade length 120px in cell, clear horizontal attack pose, no slash FX; sword follow-through crouch; aiming a SMALL compact graphite cyber pistol with tiny cyan and magenta accents, gun only about half the width of hero body; pistol firing recoil pose, gun still small, no muzzle FX.
Row 3: crouch before jump empty hands; midair forward leap empty hands; horizontal flying HEADBUTT pose with head foremost at right and compact body trailing left, empty hands; landing crouch.
Row 4: one purple alien monster facing LEFT, short squat horned armored creature with big teeth, angular silhouette, logical height 30px, menacing but playful; SAME monster recoiling from impact; SAME monster silhouette in solid warm white hit-flash with only dark outline; SAME monster collapsing into angular violet chunks.
Keep weapons proportionate and compact, do not draw oversized rifles. All cells are independent reusable sprites, no scene, no platforms, no shadows beneath sprites. Actual transparent alpha, no checkerboard printed in image.

## Combat effects and doors

Use case: stylized-concept.
Asset type: reusable transparent pixel-art combat effects and portal atlas for an 8 FPS side-view game animation.
Input image: reference only. Match the chunky pixel style and cyan/magenta/purple/warm-white palette of the supplied mole/monster sprite sheet. Do NOT redraw any mole or monsters.
Primary request: exactly 16 independent effect sprites arranged in a 4-column by 4-row regular grid, on actual transparent alpha, no visible grid, no labels. Square atlas. Equal square cells, generous clear transparent gaps, nothing touching another cell.
Authentic coarse low-resolution hand-placed pixel art. Every pixel a solid square block, no antialiasing, no smooth shapes, no gradients, no glow blur. Draw each cell as a 64x64 logical pixel game sprite upscaled with nearest-neighbor. Strong graphic silhouette and jagged stair-step edges.
Row 1: cyan crescent sword slash sweeping from upper-left to lower-right, thick white inner core with cyan/magenta edges; a wider forward cyan finishing slash crescent; compact warm-white/cyan starburst impact; smaller sharp magenta and cyan impact sparks.
Row 2: tiny cyan/white right-facing pistol muzzle flash, about 16x12 logical pixels; small cyan rightward projectile streak; a sharp warm-white impact cross with orange and purple tips; compact ring of purple angular shattered chips.
Row 3: a headbutt impact burst like a big bold white four-point strike with amber/cyan rim; wider second shock-ring frame made of square chunks; scattered purple monster armor fragments, no smoke; later sparse smaller fading purple fragments.
Row 4: CLOSED pixel sci-fi doorway, dark graphite panel in bronze frame with a small cyan light; SAME doorway OPEN with a bright cyan interior; SAME doorway HALF-CLOSED; a compact pixel dust puff in warm cream/amber.
Door sprites identical dimensions and aligned baseline, about 28 pixels wide and 42 pixels tall. All assets have visible crisp large pixels. No smooth particle trails, no realistic lighting, no painterly effects, no text, no checkerboard background.
