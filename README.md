# Boba Roguelike

A simple 2D roguelike game built with Phaser 3, themed around boba tea.

## Project Structure

```
boba-roguelike/
├── index.html          # Main HTML file
├── js/
│   └── game.js         # Game logic
└── assets/             # For future assets
```

## How to Run

1. Open `index.html` in a web browser that supports HTML5 and JavaScript (e.g., Chrome, Firefox).
2. The game will start automatically.

## Controls

- **WASD**: Move the player (boba cup)
- **Spacebar**: Shoot boba pearls towards the mouse cursor
- **Mouse**: Aim the pearls

## Game Mechanics

- Player: A boba cup that moves around the screen.
- Enemies: Customers (red circles) that spawn every 2 seconds and chase the player.
- Shooting: Press space to shoot green pearls that destroy enemies on contact.
- Health: Player starts with 100 health. Colliding with enemies reduces health by 10. Game restarts when health reaches 0.
- Collision: Pearls destroy enemies. Enemies damage player on contact.

## Features

- Basic movement and shooting
- Enemy AI (chasing player)
- Collision detection
- Health system
- Simple graphics using Phaser's drawing capabilities

## Future Enhancements

- Upgrades for player (as mentioned in requirements)
- Different enemy types (shooters, duplicators)
- Levels and bosses
- UI improvements
- Asset integration