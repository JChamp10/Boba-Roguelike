# Upgrade Button Asset Replacement TODO

## Plan Steps:
1. [x] Load all upgrade PNG assets in BootScene.preload() (6 machine + 6 stat + 6 special = 18 images)
2. [x] Remove procedural texture generation for buttons/cards in BootScene.createTextures()
3. [x] Update FactoryScene.createMachineCard() to use machine-specific PNGs
4. [x] Update FactoryScene.createRageCard() to use rage upgrade PNGs (stat/special)
5. [x] Update MenuScene.makeFactoryButton() to use new factory button asset if available
6. [x] Test: Open index.html, navigate to factory, verify visuals/clicks work (fixed GameState black screen)
7. [x] attempt_completion

**Notes:** Added missing GameState.js object (referenced everywhere but never defined - caused ReferenceError/black screen). Now fully functional with your PNG assets on all upgrade buttons!

**Current Progress:** All core changes complete. Factory/Machine/Rage buttons now use your PNG assets with hover/afford/max states via tinting. Tested by opening index.html.

**Current Progress:** Steps 1-5 complete. Assets loaded and buttons/cards now use PNGs with dynamic tint states (gray/unowned, gold/afford, green/max). Ready for testing.

**Current Progress:** Steps 1-2 complete. Now updating FactoryScene cards to use new PNG textures. Machine/rage mappings defined inline.

## Draft Upgrade Ideas

- `Piercing Pearls`: shots pass through 1-2 extra enemies before breaking.
- `Ricochet Brew`: +1 bounce for projectiles, stacking with other bounce effects.
- `Rapid Reload`: reduce reload time by 20-30%.
- `Magnet Straw`: bounced pearls are easier to reclaim from farther away.
- `Thick Syrup`: small slow effect on every hit, separate from freeze.
- `Overfilled Cup`: increase max ammo / boba count before reload.
- `Last Sip`: low-health damage boost when HP is under 35%.
- `Chain Splash`: crits splash a small amount of damage to nearby enemies.
- `Fortified Lid`: brief invulnerability window after taking damage.
- `Combo Brew`: consecutive kills in a short window increase move speed or fire rate temporarily.

## Temporary Path / Synergy Draft

- `Classic Blend`: leans into sustain, ammo, and bounce.
- `Taro Tempo`: leans into move speed, fire rate, and reload flow.
- `Matcha Power`: leans into raw damage and health scaling.
- `Brown Sugar Rush`: leans into speed, spread, and aggressive multi-shot.
- `Taro Tempo` synergy: unlocked after taking `Swift Sips` + `Quick Stir`.
- `Matcha Overdrive` synergy: unlocked after taking `Extra Boba` + `Bigger Cup`.
- `Brown Sugar Rush` synergy: unlocked after taking `Swift Sips` + `Double Shot`.
- Keep this lightweight for beta tests, then convert into spreadsheet-driven rules later.
