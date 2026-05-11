# Pit Lane

An F1-themed reflex game developed with vanilla JavaScript and the HTML5 Canvas API. This project was created for a Computer Graphics course and includes multiple gameplay mechanics, animations, collision systems, and real-time rendering.

**Play:** https://3mehmet3.github.io/pit-lane/

## Game Modes

- **Mode 1: Tire Selector**  
  Switch between Soft (1), Medium (2), and Hard (3) tire compounds and catch the correct falling tire.

- **Mode 2: Slalom**  
  Drive through the track and avoid cones, puddles, and obstacles while the game speed increases over time.

- **Mode 3: Overtake**  
  Use the DRS system by pressing SPACE inside the DRS zone and overtake the rival car without crashing.
_
## Controls

| Key | Action |
| --- | --- |
| ← → | Move / Change lane |
| 1 / 2 / 3 | Change tire compound |
| SPACE | Activate DRS |
| ESC | Return to menu |

## Computer Graphics Concepts

- RGB color systems
- Transparency and alpha channels
- Object transformations and rotation
- Collision detection
- Real-time rendering
- Canvas drawing primitives
- Animation loops

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Canvas API

## Project Structure

```text
pit-lane/
├── index.html
├── style.css
├── README.md
└── js/
    ├── main.js
    ├── common.js
    ├── menu.js
    ├── mode1.js
    ├── mode2.js
    └── mode3.js
