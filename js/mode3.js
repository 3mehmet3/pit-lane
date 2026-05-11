import { canvas, ctx, state, drawStarBackground, drawF1Car,
         drawHUD, drawParticles, spawnParticles, spawnFloat,
         endGame } from "./common.js";
export const mode3 = {
  car: {
    lane: 1,
    targetLane: 1,
    x: 400, y: 470,
    rotation: 0,
    targetRotation: 0
  },
  rival: {
    lane: 1,
    y: 200,
    targetY: 200,
    color: "rgb(80,160,255)",
    moveTimer: 0,
    targetLane: 1
  },
  drsZones: [],
  drsActive: false,
  drsTimer: 0,
  drsAvailable: false,
  scrollSpeed: 5,
  spawnTimer: 0,
  overtakeTimer: 0,
  maxOvertakeTime: 360,
  overtakesCompleted: 0
};
function laneXMode3(lane) {
  const laneWidth = (canvas.width - 60) / 3;
  return 30 + laneWidth * lane + laneWidth / 2;
}
export function initMode3() {
  mode3.car.lane = 1;
  mode3.car.targetLane = 1;
  mode3.car.x = laneXMode3(1);
  mode3.car.rotation = 0;
  mode3.car.targetRotation = 0;
  mode3.rival.lane = Math.floor(Math.random() * 3);
  mode3.rival.targetLane = mode3.rival.lane;
  mode3.rival.y = 200;
  mode3.rival.targetY = 200;
  mode3.rival.moveTimer = 90;
  mode3.drsZones = [];
  mode3.drsActive = false;
  mode3.drsTimer = 0;
  mode3.drsAvailable = false;
  mode3.scrollSpeed = 5;
  mode3.spawnTimer = 60;
  mode3.maxOvertakeTime = 360;
  mode3.overtakeTimer = mode3.maxOvertakeTime;
  mode3.overtakesCompleted = 0;
}
function spawnDrsZone() {
  mode3.drsZones.push({ y: -80, height: 120 });
}
function newRival() {
  mode3.rival.lane = Math.floor(Math.random() * 3);
  mode3.rival.targetLane = mode3.rival.lane;
  mode3.rival.y = 180;
  mode3.rival.targetY = 180;
  mode3.rival.moveTimer = Math.max(40, 100 - state.level * 6);
  mode3.maxOvertakeTime = Math.max(180, 360 - state.level * 18);
  mode3.overtakeTimer = mode3.maxOvertakeTime;
  mode3.drsActive = false;
  mode3.drsTimer = 0;
}
export function laneChangeMode3(dir) {
  if (dir === "left"  && mode3.car.targetLane > 0) mode3.car.targetLane--;
  if (dir === "right" && mode3.car.targetLane < 2) mode3.car.targetLane++;
}
export function tryActivateDRS() {
  if (mode3.drsAvailable && !mode3.drsActive) {
    mode3.drsActive = true;
    mode3.drsTimer = 90;
    spawnFloat(mode3.car.x, mode3.car.y - 40, "DRS OPEN!", "rgb(80,255,255)");
    spawnParticles(mode3.car.x, mode3.car.y, "rgb(80,255,255)", 12);
  }
}
export function updateMode3() {
  const targetX = laneXMode3(mode3.car.targetLane);
  const dx = targetX - mode3.car.x;
  mode3.car.x += dx * 0.18;
  if (Math.abs(dx) > 1) {
    mode3.car.targetRotation = (dx > 0 ? 1 : -1) * 0.18;
  } else {
    mode3.car.targetRotation = 0;
  }
  mode3.car.rotation += (mode3.car.targetRotation - mode3.car.rotation) * 0.25;
  mode3.scrollSpeed = 5 + state.level * 0.3;
  state.trackOffset = (state.trackOffset + mode3.scrollSpeed) % 60;
  if (mode3.drsActive) {
    mode3.drsTimer--;
    mode3.rival.y += 4;
    if (mode3.drsTimer <= 0) mode3.drsActive = false;
  }
  mode3.spawnTimer--;
  if (mode3.spawnTimer <= 0) {
    spawnDrsZone();
    mode3.spawnTimer = 240 + state.level * 30;
  }
  mode3.drsAvailable = false;
  for (let i = mode3.drsZones.length - 1; i >= 0; i--) {
    const z = mode3.drsZones[i];
    z.y += mode3.scrollSpeed;
    if (mode3.car.y > z.y && mode3.car.y < z.y + z.height) {
      mode3.drsAvailable = true;
    }
    if (z.y > canvas.height) {
      mode3.drsZones.splice(i, 1);
    }
  }
  mode3.rival.moveTimer--;
  if (mode3.rival.moveTimer <= 0) {
    if (mode3.rival.targetLane === mode3.car.targetLane) {
      const options = [0, 1, 2].filter(l => l !== mode3.rival.targetLane);
      mode3.rival.targetLane = options[Math.floor(Math.random() * options.length)];
    } else if (Math.random() < 0.25 + state.level * 0.04) {
      const options = [0, 1, 2].filter(l => l !== mode3.rival.targetLane);
      mode3.rival.targetLane = options[Math.floor(Math.random() * options.length)];
    }
    mode3.rival.moveTimer = Math.max(40, 100 - state.level * 6);
  }
  if (mode3.rival.lane !== mode3.rival.targetLane) {
    mode3.rival.lane = mode3.rival.targetLane;
  }
  if (mode3.rival.y >= mode3.car.y - 20) {
    if (mode3.rival.lane === mode3.car.targetLane) {
      state.lives--;
      spawnParticles(mode3.car.x, mode3.car.y, "rgb(255,80,80)", 15);
      spawnFloat(canvas.width / 2, 250, "CONTACT!", "rgb(255,80,80)");
      if (state.lives <= 0) endGame();
      newRival();
    } else {
      const timeBonus = Math.round((mode3.overtakeTimer / mode3.maxOvertakeTime) * 15);
      const points = 20 + timeBonus;
      state.score += points;
      mode3.overtakesCompleted++;
      spawnFloat(canvas.width / 2, 250, "OVERTAKE +" + points, "rgb(120,255,140)");
      spawnParticles(laneXMode3(mode3.rival.lane), mode3.rival.y,
                     "rgb(120,255,140)", 18);
      newRival();
    }
  }
  mode3.overtakeTimer--;
  if (mode3.overtakeTimer <= 0) {
    spawnFloat(canvas.width / 2, 250, "OVERTAKE FAILED", "rgb(255,150,80)");
    state.lives--;
    if (state.lives <= 0) endGame();
    newRival();
  }
  state.level = 1 + Math.floor(state.score / 100);
}
export function drawMode3() {
  drawStarBackground();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 15]);
  for (let i = 1; i < 3; i++) {
    const lx = 30 + ((canvas.width - 60) / 3) * i;
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  for (let i = 0; i < mode3.drsZones.length; i++) {
    const z = mode3.drsZones[i];
    const grad = ctx.createLinearGradient(0, z.y, 0, z.y + z.height);
    grad.addColorStop(0,   "rgba(80,160,255,0.05)");
    grad.addColorStop(0.5, "rgba(80,160,255,0.25)");
    grad.addColorStop(1,   "rgba(80,160,255,0.05)");
    ctx.fillStyle = grad;
    ctx.fillRect(20, z.y, canvas.width - 40, z.height);
    ctx.fillStyle = "rgba(80,200,255,0.8)";
    ctx.fillRect(20, z.y, canvas.width - 40, 4);
    ctx.fillRect(20, z.y + z.height - 4, canvas.width - 40, 4);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("DRS ZONE", canvas.width / 2, z.y + z.height / 2 + 8);
  }
  drawF1Car(laneXMode3(mode3.rival.lane), mode3.rival.y, 1.0,
            mode3.rival.color, { glowColor: mode3.rival.color });
  const cColor = mode3.drsActive ? "rgb(80,255,255)" : "rgb(220,30,30)";
  drawF1Car(mode3.car.x, mode3.car.y, 1.0, cColor, {
    rotation: mode3.car.rotation,
    glowColor: cColor
  });
  if (mode3.drsActive) {
    ctx.strokeStyle = "rgba(80,255,255,0.6)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const lx = mode3.car.x - 30 + Math.random() * 60;
      const ly = mode3.car.y + 30 + Math.random() * 100;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx, ly + 20);
      ctx.stroke();
    }
  }
  drawParticles();
  drawHUD();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(canvas.width - 170, 35, 160, 60);
  ctx.strokeStyle = mode3.drsActive
                    ? "rgb(80,255,255)"
                    : (mode3.drsAvailable ? "rgb(80,200,255)" : "rgba(255,255,255,0.3)");
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width - 170, 35, 160, 60);
  ctx.fillStyle = "white";
  ctx.font = "11px Arial";
  ctx.textAlign = "left";
  ctx.fillText("DRS SYSTEM", canvas.width - 162, 50);
  if (mode3.drsActive) {
    ctx.fillStyle = "rgb(80,255,255)";
    ctx.font = "bold 18px Arial";
    ctx.fillText("ACTIVE", canvas.width - 162, 72);
    ctx.font = "10px Arial";
    ctx.fillStyle = "#aaa";
    ctx.fillText(Math.ceil(mode3.drsTimer / 60 * 10) / 10 + "s", canvas.width - 162, 88);
  } else if (mode3.drsAvailable) {
    ctx.fillStyle = "rgb(80,255,80)";
    ctx.font = "bold 16px Arial";
    ctx.fillText("PRESS SPACE", canvas.width - 162, 72);
    ctx.font = "10px Arial";
    ctx.fillStyle = "#aaa";
    ctx.fillText("(in DRS zone)", canvas.width - 162, 88);
  } else {
    ctx.fillStyle = "#888";
    ctx.font = "bold 16px Arial";
    ctx.fillText("UNAVAILABLE", canvas.width - 162, 72);
    ctx.font = "10px Arial";
    ctx.fillText("wait for blue zone", canvas.width - 162, 88);
  }
  const barW = 250, barH = 8;
  const barX = canvas.width / 2 - barW / 2, barY = 12;
  ctx.fillStyle = "#222";
  ctx.fillRect(barX, barY, barW, barH);
  const ratio = Math.max(0, mode3.overtakeTimer / mode3.maxOvertakeTime);
  let barColor = "rgb(80,200,255)";
  if (ratio < 0.5)  barColor = "rgb(255,200,80)";
  if (ratio < 0.25) barColor = "rgb(255,80,80)";
  ctx.fillStyle = barColor;
  ctx.fillRect(barX, barY, barW * ratio, barH);
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
  ctx.fillStyle = "#aaa";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("TIME TO OVERTAKE", canvas.width / 2, barY - 2);
  ctx.fillStyle = "white";
  ctx.font = "13px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Overtakes: " + mode3.overtakesCompleted, 10, canvas.height - 30);
  ctx.fillStyle = "#aaa";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MODE 3: OVERTAKE — change lane (← →), press SPACE in blue DRS zone to overtake",
               canvas.width / 2, canvas.height - 8);
}
