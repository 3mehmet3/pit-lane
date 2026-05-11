export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const state = {
  current: "menu",
  currentMode: 0,
  score: 0,
  lives: 3,
  level: 1,
  bestScores: [0, 0, 0],
  trackOffset: 0
};
export const mouse = { x: 0, y: 0, clicked: false };
export const keys = { left: false, right: false };
export const particles = [];
export const floats = [];
export function spawnParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 30, maxLife: 30,
      color
    });
  }
}
export function spawnFloat(x, y, text, color) {
  floats.push({ x, y, text, color, life: 40, vy: -1.2 });
}
export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
  for (let i = floats.length - 1; i >= 0; i--) {
    const f = floats[i];
    f.y += f.vy;
    f.life--;
    if (f.life <= 0) floats.splice(i, 1);
  }
}
export function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color.replace("rgb", "rgba").replace(")", "," + alpha + ")");
    ctx.fillRect(p.x, p.y, 3, 3);
  }
  for (let i = 0; i < floats.length; i++) {
    const f = floats[i];
    const alpha = Math.min(1, f.life / 25);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = f.color;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
}
export function colorRGB(c) {
  if (c === "r") return "rgb(255,80,80)";
  if (c === "g") return "rgb(80,220,80)";
  if (c === "b") return "rgb(80,140,255)";
  return "rgb(255,255,255)";
}
export function drawStarBackground() {
  state.trackOffset = (state.trackOffset + 4) % 60;
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(60,60,60,0.4)";
  for (let i = 0; i < 50; i++) {
    const sx = (i * 73) % canvas.width;
    const sy = (i * 137 + state.trackOffset * 0.5) % canvas.height;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let y = -60 + state.trackOffset; y < canvas.height; y += 60) {
    ctx.fillRect(canvas.width / 2 - 3, y, 6, 30);
  }
  for (let y = -40 + state.trackOffset; y < canvas.height; y += 40) {
    const stripIdx = Math.floor((y + state.trackOffset) / 40);
    ctx.fillStyle = stripIdx % 2 === 0
      ? "rgba(255,40,40,0.4)"
      : "rgba(255,255,255,0.4)";
    ctx.fillRect(0, y, 18, 20);
    ctx.fillRect(canvas.width - 18, y, 18, 20);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 0);              ctx.lineTo(20, canvas.height);
  ctx.moveTo(canvas.width - 20, 0); ctx.lineTo(canvas.width - 20, canvas.height);
  ctx.stroke();
}
export function drawF1Car(cx, cy, scale, bodyColor, options) {
  options = options || {};
  ctx.save();
  ctx.translate(cx, cy);
  if (options.rotation) ctx.rotate(options.rotation);
  ctx.scale(scale, scale);
  if (options.glow !== false) {
    const cglow = ctx.createRadialGradient(0, 0, 5, 0, 0, 60);
    const glowColor = options.glowColor || bodyColor;
    cglow.addColorStop(0, glowColor.replace("rgb", "rgba").replace(")", ",0.4)"));
    cglow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cglow;
    ctx.fillRect(-60, -60, 120, 120);
  }
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(-22, -32, 8, 16);
  ctx.fillRect(14, -32, 8, 16);
  ctx.fillRect(-26, 18, 10, 18);
  ctx.fillRect(16, 18, 10, 18);
  ctx.fillStyle = "#333";
  ctx.fillRect(-21, -30, 6, 4);
  ctx.fillRect(15, -30, 6, 4);
  ctx.fillRect(-25, 20, 8, 4);
  ctx.fillRect(17, 20, 8, 4);
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.moveTo(-30, -42);
  ctx.lineTo(30, -42);
  ctx.lineTo(28, -34);
  ctx.lineTo(-28, -34);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-32, -44, 4, 12);
  ctx.fillRect(28, -44, 4, 12);
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.lineTo(-7, -18);
  ctx.lineTo(7, -18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(-9, -18);
  ctx.lineTo(-18, -2);
  ctx.lineTo(-20, 14);
  ctx.lineTo(-16, 24);
  ctx.lineTo(16, 24);
  ctx.lineTo(20, 14);
  ctx.lineTo(18, -2);
  ctx.lineTo(9, -18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = bodyColor.replace("rgb(", "rgba(").replace(")", ",0.7)");
  ctx.fillRect(-3, -18, 6, 28);
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.ellipse(0, -2, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#444";
  ctx.beginPath();
  ctx.arc(0, -3, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.arc(-2, -5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(-26, 32, 52, 8);
  ctx.fillRect(-30, 28, 5, 14);
  ctx.fillRect(25, 28, 5, 14);
  ctx.fillStyle = "#222";
  ctx.fillRect(-24, 30, 48, 4);
  ctx.fillStyle = "#000";
  ctx.fillRect(-12, 38, 24, 4);
  ctx.restore();
}
export function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + state.score, 10, 30);
  ctx.fillText("Lives: " + state.lives, 10, 55);
  ctx.fillText("Level: " + state.level, 10, 80);
  ctx.font = "12px Arial";
  ctx.fillStyle = "#aaa";
  ctx.textAlign = "right";
  ctx.fillText("ESC = menu", canvas.width - 10, 20);
}
export function endGame() {
  if (state.score > state.bestScores[state.currentMode - 1]) {
    state.bestScores[state.currentMode - 1] = state.score;
  }
  state.current = "gameover";
}
