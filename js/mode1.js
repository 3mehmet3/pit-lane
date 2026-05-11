import { canvas, ctx, state, keys, drawStarBackground, drawF1Car,
         drawHUD, drawParticles, spawnParticles, spawnFloat,
         colorRGB, endGame } from "./common.js";
export const mode1 = {
  prism: { x: 400, y: 520, size: 35, vx: 0, speed: 6 },
  beamColor: "r",
  targets: [],
  spawnTimer: 0,
  combo: 0
};
export function initMode1() {
  mode1.prism.x = 400;
  mode1.targets = [];
  mode1.beamColor = "r";
  mode1.spawnTimer = 30;
  mode1.combo = 0;
}
function spawnTargetMode1() {
  const colors = ["r", "g", "b"];
  mode1.targets.push({
    x: 50 + Math.random() * 700,
    y: -25,
    radius: 22,
    speed: 1.8 + state.level * 0.35,
    color: colors[Math.floor(Math.random() * 3)]
  });
}
export function setBeamColor(c) {
  mode1.beamColor = c;
}
export function updateMode1() {
  if (keys.left) mode1.prism.vx = -mode1.prism.speed;
  else if (keys.right) mode1.prism.vx = mode1.prism.speed;
  else mode1.prism.vx = 0;
  mode1.prism.x += mode1.prism.vx;
  if (mode1.prism.x < mode1.prism.size) mode1.prism.x = mode1.prism.size;
  if (mode1.prism.x > canvas.width - mode1.prism.size) {
    mode1.prism.x = canvas.width - mode1.prism.size;
  }
  mode1.spawnTimer--;
  if (mode1.spawnTimer <= 0) {
    spawnTargetMode1();
    mode1.spawnTimer = Math.max(90, 180 - state.level * 8);
  }
  const beamX = mode1.prism.x;
  const beamHalfWidth = 6;
  for (let i = mode1.targets.length - 1; i >= 0; i--) {
    const t = mode1.targets[i];
    t.y += t.speed;
    if (Math.abs(t.x - beamX) < t.radius + beamHalfWidth &&
        t.y < mode1.prism.y - mode1.prism.size) {
      if (t.color === mode1.beamColor) {
        state.score += 10;
        mode1.combo++;
        if (mode1.combo > 1) {
          state.score += mode1.combo;
          spawnFloat(t.x, t.y, "+10 x" + mode1.combo, "rgb(255,200,100)");
        } else {
          spawnFloat(t.x, t.y, "+10", "rgb(120,255,140)");
        }
        spawnParticles(t.x, t.y, colorRGB(t.color), 18);
      } else {
        state.lives--;
        mode1.combo = 0;
        spawnParticles(t.x, t.y, "rgb(255,80,80)", 12);
        spawnFloat(t.x, t.y, "WRONG COLOR", "rgb(255,100,100)");
        if (state.lives <= 0) endGame();
      }
      mode1.targets.splice(i, 1);
      continue;
    }
    if (t.y > mode1.prism.y + mode1.prism.size) {
      state.lives--;
      mode1.combo = 0;
      spawnFloat(t.x, mode1.prism.y, "MISSED", "rgb(255,150,80)");
      if (state.lives <= 0) endGame();
      mode1.targets.splice(i, 1);
    }
  }
  state.level = 1 + Math.floor(state.score / 60);
}
export function drawMode1() {
  drawStarBackground();
  const p = mode1.prism;
  const beamX = p.x;
  const beamColor = colorRGB(mode1.beamColor);
  ctx.strokeStyle = beamColor.replace("rgb", "rgba").replace(")", ",0.25)");
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(beamX, p.y - p.size);
  ctx.lineTo(beamX, 0);
  ctx.stroke();
  ctx.strokeStyle = beamColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(beamX, p.y - p.size);
  ctx.lineTo(beamX, 0);
  ctx.stroke();
  for (let i = 0; i < mode1.targets.length; i++) {
    const t = mode1.targets[i];
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = colorRGB(t.color);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#aaa";
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.stroke();
    const letter = t.color === "r" ? "S" : t.color === "g" ? "M" : "H";
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(letter, t.x, t.y + 5);
  }
  drawF1Car(p.x, p.y, 0.95, beamColor, { glowColor: beamColor });
  drawParticles();
  drawHUD();
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(canvas.width/2 - 165, 35, 330, 36);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(canvas.width/2 - 165, 35, 330, 36);
  const slots = [
    { key: "1", c: "r", label: "SOFT",   x: canvas.width/2 - 100 },
    { key: "2", c: "g", label: "MEDIUM", x: canvas.width/2 },
    { key: "3", c: "b", label: "HARD",   x: canvas.width/2 + 100 }
  ];
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    const active = mode1.beamColor === s.c;
    if (active) {
      ctx.fillStyle = colorRGB(s.c);
      ctx.fillRect(s.x - 45, 41, 90, 24);
    }
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = active ? "white" : colorRGB(s.c);
    ctx.fillText("[" + s.key + "] " + s.label, s.x, 58);
  }
  if (mode1.combo > 1) {
    ctx.fillStyle = "rgb(255,200,100)";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "right";
    ctx.fillText("COMBO x" + mode1.combo, canvas.width - 10, 105);
  }
  ctx.fillStyle = "#aaa";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MODE 1: TIRE SELECTOR — match compound (1=Soft 2=Medium 3=Hard) to incoming tires",
               canvas.width / 2, canvas.height - 8);
}
