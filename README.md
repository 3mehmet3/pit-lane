# Pit Lane

An F1-themed reflex game with three pit-crew challenges, built with vanilla JavaScript and the HTML5 Canvas API. Created as a Computer Graphics course project.

**Play:** https://YOUR-USERNAME.github.io/pit-lane/

## Modes

- **Mode 1: Tire Selector** — Switch your beam between Soft (1), Medium (2) and Hard (3) compounds, then position under the matching falling tire.
- **Mode 2: Slalom** — Race down the track and change lanes (← →) to dodge cones, puddles and debris. Speed grows with level.
- **Mode 3: Overtake** — Catch a rival car. Wait for the blue DRS zone, press **SPACE** to activate DRS, and change lanes to avoid contact. The rival evades.

## Controls

| Key | Action |
| --- | --- |
| ← → | Move / change lane |
| 1 / 2 / 3 | Switch tire compound (Mode 1) |
| SPACE | Activate DRS (Mode 3) |
| ESC | Return to menu |

## Computer Graphics Concepts Used

- **RGB color channels** (Week 1) — tire compounds and team liveries are encoded as RGB.
- **Alpha / transparency** (Week 1) — DRS zones in Mode 3 use semi-transparent overlays.
- **Transformations** (Week 3) — the car rotates (`ctx.rotate`) during lane changes; track translates downward each frame to create the scrolling-road animation.
- **Rendering primitives** — all visuals are drawn from rectangles, paths, gradients and arcs; no sprites.

## Project Structure

```
pit-lane/
├── index.html
├── style.css
├── README.md
└── js/
    ├── main.js      Entry point: gameLoop, state machine, input events
    ├── common.js    Shared state, particles, floats, F1 car drawing, track background
    ├── menu.js      Main menu and game-over screen
    ├── mode1.js     Tire Selector mode
    ├── mode2.js     Slalom mode
    └── mode3.js     Overtake mode (with DRS)
```

## Running Locally

Because the project uses ES Modules, you cannot open `index.html` directly with `file://`. Use any small HTTP server:

```bash
# Python 3
python -m http.server 8000
```

Then open <http://localhost:8000>.

Or use the **Live Server** extension in VS Code (right-click `index.html` → "Open with Live Server").
