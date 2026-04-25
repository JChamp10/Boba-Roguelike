# Boba Roguelike Mockup Brief

## Visual Direction

- Style: pixel-art UI with anime-kawaii character energy
- Mood: sugary, chaotic, cute, high-energy arcade
- Rendering: crisp chunky pixels, soft glow accents, sticker-like charms, tiny hearts and sparkles
- Tone: adorable but a little feral, "cute boba war zone"
- Typography: bold pixel headers, rounded cute sublabels, playful all-caps buttons
- Palette:
  - Milk tea cream: `#f3dfc1`
  - Brown sugar amber: `#b96a2f`
  - Matcha mint: `#74d39b`
  - Taro lavender: `#a88ae6`
  - Strawberry pink: `#ff7fb5`
  - Rage red: `#ff5a5a`
  - TC cyan: `#74d9ff`
  - Night backdrop: `#161425`

## Global UI Rules

- Every panel should feel like a cute gacha game menu.
- Use rounded pixel cards with thick borders and tiny corner decorations.
- Add chibi boba mascots, face icons, hearts, stars, bows, and bubble sparkles.
- Keep the world readable first, adorable second.
- Currency chips should be large and unmistakable:
  - `RAGE` = warm red chip
  - `TC` = cool cyan chip

## Core Mockups To Generate

### 1. Main Menu

- Huge pixel logo: `BOBA ROGUELIKE`
- Subtitle: `Tapioca Tower Defense`
- Character carousel with four kawaii boba heroes:
  - Classic Boba
  - Taro Milk
  - Matcha Latte
  - Brown Sugar
- Right-side glowing `TAPIOCA FACTORY` button
- Cute floating pearls, stars, syrup drips, idle sparkles
- Bottom HUD strip showing `TC`, `RAGE`, and volume

### 2. Factory Screen

- Split screen layout
- Left panel: `RAGE MACHINES`
- Right panel: `TC UPGRADES`
- Large currency display at top:
  - left `RAGE`
  - right `TC | +/s`
- Machine cards should feel like kawaii vending/printer machines with mascot faces
- Upgrade cards should feel like collectible gacha badges or charms
- Tabs for `STAT` and `SPECIAL`
- Cute dangerous-industrial vibe, pastel neon factory at night

### 3. In-Run Battle HUD

- Top-left health and XP bars styled like strawberry jelly / matcha jelly bars
- Ammo counter shown as tiny boba pearls inside the cup
- Top-right shows wave, score, level
- Player is a chibi anime boba cup with expressive face
- Enemies are angry customers, also chibi and silly
- Shots are glossy tapioca pearls with trails
- Battlefield grid should feel like a cute arcade arena

### 4. Upgrade Draft Screen

- Three oversized collectible cards in the middle
- Header: `CHOOSE AN UPGRADE`
- Path badge near top:
  - `Classic Blend`
  - `Taro Tempo`
  - `Matcha Power`
  - `Brown Sugar Rush`
- Synergy cards should feel ultra special:
  - gold frame
  - sparkles
  - little animated heart/star burst motifs
- Each card should show:
  - icon
  - name
  - short description
  - path or synergy tag

### 5. Pause Menu

- Dimmed battlefield behind translucent pixel panel
- Big cute buttons:
  - `RESUME`
  - `RESTART`
  - `QUIT TO MENU`
- Small decorative mascot in the corner looking worried

### 6. Game Over Screen

- Cute tragic arcade feel, not grim
- Show:
  - `GAME OVER`
  - Wave reached
  - Final score
  - Level
  - `RAGE EARNED`
  - `TOTAL RAGE`
- Add tired/sad chibi boba hero with cracked straw and floating tears
- Buttons:
  - `PLAY AGAIN`
  - `MAIN MENU`

## Asset List

### Character Portraits

- Classic Boba: balanced brown milk tea cup, calm smile, warm caramel palette
- Taro Milk: pastel lavender, magical girl energy, speedy and mischievous
- Matcha Latte: green, elegant, focused, stronger aura
- Brown Sugar: amber tiger-stripe syrup look, chaotic and aggressive

### Enemy Concepts

- Angry office worker
- Sleep-deprived student
- Influencer with giant drink order
- Gremlin customer
- Mini boss cashier inspector

### Machine Card Concepts

- Ball Roller
- Ball Maker
- Speed Line
- Mega Press
- Auto Factory
- Quantum Gen

Each should be:
- pixelated
- cute-faced
- toy-like
- readable at card size

### Upgrade Card Concepts

- Damage
- Fire rate
- Speed
- Heal
- Health
- Multi-shot
- Ricochet
- Rapid Reload
- Overfilled Cup
- Taro Tempo synergy
- Matcha Overdrive synergy
- Brown Sugar Rush synergy

## Master Prompt

```text
Use case: ui-mockup
Asset type: full game mockup board
Primary request: a complete UI mockup sheet for a cute pixel-art anime-kawaii boba roguelike game, showing the main menu, factory screen, battle HUD, upgrade draft screen, pause menu, and game over screen
Scene/backdrop: candy-neon arcade tea shop at night, soft glow signage, bubbly atmosphere
Subject: adorable pixel UI with chibi anime boba heroes, collectible upgrade cards, cute factory machines, and playful roguelike HUD panels
Style/medium: polished pixel art game UI mockup, anime-inspired, kawaii, colorful, readable, charming, commercial indie game presentation sheet
Composition/framing: one large overview mockup board with six clearly separated screens and labeled interface areas
Lighting/mood: sugary neon glow, cozy but energetic, high contrast readability
Color palette: milk tea cream, taro lavender, matcha mint, strawberry pink, cyan, amber brown, deep night purple
Materials/textures: glossy tapioca pearls, syrup shine, chunky pixel borders, sticker-like UI ornaments, sparkles, hearts, stars
Text (verbatim): "BOBA ROGUELIKE", "TAPIOCA FACTORY", "CHOOSE AN UPGRADE", "GAME OVER", "RAGE", "TC", "STAT", "SPECIAL", "PLAY AGAIN", "MAIN MENU"
Constraints: keep everything pixelated, anime-kawaii, game-readable, and cohesive across all screens; no realistic rendering; no generic mobile UI; no watermark
Avoid: bland flat UI, realism, western grimdark styling, messy unreadable tiny text, purple-only palette
```

## Separate Prompt Pack

### Prompt A: Main Menu

```text
Use case: ui-mockup
Asset type: main menu screen
Primary request: a pixel-art anime-kawaii main menu for a boba roguelike game with a character carousel and a glowing tapioca factory button
Style/medium: cute polished pixel art UI, anime arcade vibe
Composition/framing: 16:9 game screen, centered logo, character carousel in middle, menu buttons below, currency strip visible
Lighting/mood: cozy neon tea shop glow, playful sparkles
Text (verbatim): "BOBA ROGUELIKE", "Tapioca Tower Defense", "START GAME", "CONTROLS", "TAPIOCA FACTORY", "RAGE", "TC"
Constraints: pixelated, adorable, readable, commercial indie game quality
Avoid: realism, muddy colors, generic sci-fi UI
```

### Prompt B: Factory

```text
Use case: ui-mockup
Asset type: factory management screen
Primary request: a split-layout factory shop screen for a kawaii pixel boba game, left side for rage-powered machines and right side for tc upgrades
Style/medium: pixel-art UI mockup, anime-kawaii industrial candy factory
Composition/framing: 16:9 game screen, left machine grid, right upgrade card grid, top currency bar
Lighting/mood: cute night factory with neon accents
Text (verbatim): "TAPIOCA BALL FACTORY", "RAGE", "TC", "STAT", "SPECIAL", "BACK"
Constraints: left side should read as machines, right side should read as collectible upgrades, extremely readable currency display
Avoid: clutter, muddy red-blue confusion, tiny text overload
```

### Prompt C: Battle HUD

```text
Use case: ui-mockup
Asset type: in-game combat screen
Primary request: a playable-looking battle HUD for a pixel anime boba roguelike where a chibi boba hero fights angry customer enemies
Style/medium: cute pixel action game screen, anime-kawaii arcade energy
Composition/framing: full gameplay screenshot with HUD, enemies, projectiles, health bars, xp bar, ammo display, wave and score
Lighting/mood: energetic, colorful, crisp, cute chaos
Constraints: readable HUD, expressive characters, glossy pearl projectiles, clear enemy silhouettes
Avoid: dull battlefield, washed-out UI, realistic shading
```

### Prompt D: Upgrade Draft

```text
Use case: ui-mockup
Asset type: upgrade selection screen
Primary request: a gorgeous upgrade draft screen with three giant collectible cards, path labels, and synergy callouts for a pixel anime kawaii roguelike
Style/medium: pixel-art UI with gacha-card energy
Composition/framing: centered three-card layout, big title on top, path label near top, dramatic card glow
Text (verbatim): "CHOOSE AN UPGRADE", "PATH", "SYNERGY"
Constraints: cards must feel exciting to pick, synergy card should look more premium than normal upgrades
Avoid: plain rectangles, boring loot menu look
```

### Prompt E: Game Over

```text
Use case: ui-mockup
Asset type: game over results screen
Primary request: a cute emotional game over screen for a boba roguelike with score summary and rage payout
Style/medium: pixel-art anime-kawaii results screen
Composition/framing: centered results stack, sad chibi boba hero illustration, big buttons at bottom
Text (verbatim): "GAME OVER", "RAGE EARNED", "TOTAL RAGE", "PLAY AGAIN", "MAIN MENU"
Constraints: sad but still cute, readable, arcade-polished
Avoid: grim horror tone, flat spreadsheet-like result screen
```

## Next Image Batch I Recommend

1. One full overview board using the master prompt
2. One dedicated factory screen
3. One dedicated battle HUD screen
4. One dedicated upgrade draft screen

