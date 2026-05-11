import { canvas, ctx, state, mouse, drawStarBackground } from "./common.js";
import { initMode1 } from "./mode1.js";
import { initMode2 } from "./mode2.js";
import { initMode3 } from "./mode3.js";
const menuButtons = [
  { x: 200, y: 220, w: 400, h: 80, mode: 1, title: "MODE 1: TIRE SELECTOR",
    sub: "switch compound, hit matching tires" },
  { x: 200, y: 320, w: 400, h: 80, mode: 2, title: "MODE 2: SLALOM",
    sub: "race down the track, dodge obstacles" },
  { x: 200, y: 420, w: 400, h: 80, mode: 3, title: "MODE 3: OVERTAKE",
    sub: "use DRS in blue zones to overtake rivals" }
];
export function startMode(mode) {
  state.currentMode = mode;
  state.score = 0;
  state.lives = 3;
  state.level = 1;
  if (mode === 1) initMode1();
  if (mode === 2) initMode2();
  if (mode === 3) initMode3();
  state.current = "mode" + mode;
}
export function drawMenu() {
  drawStarBackground();
  ctx.fillStyle = "white";
  ctx.font = "bold 42px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PIT LANE", canvas.width / 2, 110);
  ctx.font = "14px Arial";
  ctx.fillStyle = "#aaa";
  ctx.fillText("F1 pit crew reflex challenge — three stations", canvas.width / 2, 140);
  for (let i = 0; i < menuButtons.length; i++) {
    const btn = menuButtons[i];
    const hover = mouse.x > btn.x && mouse.x < btn.x + btn.w &&
                  mouse.y > btn.y && mouse.y < btn.y + btn.h;
    const colorMap = ["rgb(255,80,80)", "rgb(80,220,80)", "rgb(80,140,255)"];
    const bg = hover ? colorMap[i] : "rgba(40,40,60,0.8)";
    ctx.fillStyle = bg;
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeStyle = colorMap[i];
    ctx.lineWidth = 2;
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(btn.title, btn.x + btn.w / 2, btn.y + 35);
    ctx.font = "13px Arial";
    ctx.fillStyle = hover ? "white" : "#bbb";
    ctx.fillText(btn.sub, btn.x + btn.w / 2, btn.y + 55);
    ctx.font = "11px Arial";
    ctx.fillStyle = "#ddd";
    ctx.fillText("BEST: " + state.bestScores[i], btn.x + btn.w - 50, btn.y + 70);
  }
  ctx.fillStyle = "#666";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Click a mode to start.", canvas.width / 2, 540);
}
export function updateMenu() {
  if (mouse.clicked) {
    mouse.clicked = false;
    for (let i = 0; i < menuButtons.length; i++) {
      const btn = menuButtons[i];
      if (mouse.x > btn.x && mouse.x < btn.x + btn.w &&
          mouse.y > btn.y && mouse.y < btn.y + btn.h) {
        startMode(btn.mode);
        return;
      }
    }
  }
}
export function drawGameOver() {
  drawStarBackground();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, 200);
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + state.score, canvas.width / 2, 250);
  ctx.fillText("Best: " + state.bestScores[state.currentMode - 1], canvas.width / 2, 280);
  const retryBtn = { x: 200, y: 350, w: 180, h: 50 };
  const menuBtn  = { x: 420, y: 350, w: 180, h: 50 };
  function btnDraw(btn, label, hover) {
    ctx.fillStyle = hover ? "rgba(80,140,255,0.7)" : "rgba(40,40,60,0.8)";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + 32);
  }
  const hoverRetry = mouse.x > retryBtn.x && mouse.x < retryBtn.x + retryBtn.w &&
                     mouse.y > retryBtn.y && mouse.y < retryBtn.y + retryBtn.h;
  const hoverMenu  = mouse.x > menuBtn.x && mouse.x < menuBtn.x + menuBtn.w &&
                     mouse.y > menuBtn.y && mouse.y < menuBtn.y + menuBtn.h;
  btnDraw(retryBtn, "TRY AGAIN", hoverRetry);
  btnDraw(menuBtn,  "MENU",      hoverMenu);
  if (mouse.clicked) {
    mouse.clicked = false;
    if (hoverRetry) startMode(state.currentMode);
    else if (hoverMenu) state.current = "menu";
  }
}
