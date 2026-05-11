import { canvas, ctx, state, drawStarBackground, drawF1Car,
         drawHUD, drawParticles, spawnParticles, spawnFloat,
         endGame } from "./common.js";
export const mode2 = {
  car: {
    lane: 1,
    targetLane: 1,
    x: 400, y: 450,
    width: 36, height: 60,
    rotation: 0,
    targetRotation: 0
  },
  obstacles: [],
  spawnTimer: 0,
  scrollSpeed: 5,
  distance: 0
};
export function initMode2() {
  mode2.car.lane = 1;
  mode2.car.targetLane = 1;
  mode2.car.rotation = 0;
  mode2.car.targetRotation = 0;
  mode2.obstacles = [];
  mode2.spawnTimer = 30;
  mode2.scrollSpeed = 5;
  mode2.distance = 0;
}
export function laneX(lane) {
  const laneWidth = (canvas.width - 60) / 3;
  return 30 + laneWidth * lane + laneWidth / 2;
}
function spawnObstacleMode2() {
  const types = ["cone", "puddle", "debris"];
  mode2.obstacles.push({
    lane: Math.floor(Math.random() * 3),
    y: -50,
    type: types[Math.floor(Math.random() * 3)]
  });
}
export function laneChangeMode2(dir) {
  if (dir === "left"  && mode2.car.targetLane > 0) mode2.car.targetLane--;
  if (dir === "right" && mode2.car.targetLane < 2) mode2.car.targetLane++;
}
export function updateMode2() {
  const targetX = laneX(mode2.car.targetLane);
  const dx = targetX - mode2.car.x;
  mode2.car.x += dx * 0.18;
  if (Math.abs(dx) > 1) {
    mode2.car.targetRotation = (dx > 0 ? 1 : -1) * 0.18;
  } else {
    mode2.car.targetRotation = 0;
  }
  mode2.car.rotation += (mode2.car.targetRotation - mode2.car.rotation) * 0.25;
  mode2.scrollSpeed = 5 + state.level * 0.5;
  state.trackOffset = (state.trackOffset + mode2.scrollSpeed) % 60;
  mode2.distance += mode2.scrollSpeed;
  if (Math.floor(mode2.distance / 60) > Math.floor((mode2.distance - mode2.scrollSpeed) / 60)) {
    state.score++;
  }
  mode2.spawnTimer--;
  if (mode2.spawnTimer <= 0) {
    spawnObstacleMode2();
    mode2.spawnTimer = Math.max(35, 80 - state.level * 4);
  }
  for (let i = mode2.obstacles.length - 1; i >= 0; i--) {
    const o = mode2.obstacles[i];
    o.y += mode2.scrollSpeed;
    if (o.lane === mode2.car.targetLane &&
        Math.abs(o.y - mode2.car.y) < 45 &&
        Math.abs(mode2.car.x - laneX(o.lane)) < 35) {
      state.lives--;
      spawnParticles(mode2.car.x, mode2.car.y, "rgb(255,80,80)", 15);
      spawnFloat(mode2.car.x, mode2.car.y - 30, "CRASH!", "rgb(255,100,100)");
      if (state.lives <= 0) endGame();
      mode2.obstacles.splice(i, 1);
      continue;
    }
    if (o.y > canvas.height + 50) {
      state.score += 5;
      mode2.obstacles.splice(i, 1);
    }
  }
  state.level = 1 + Math.floor(state.score / 100);
}
export function drawObstacle(o) {
  const x = laneX(o.lane);
  const y = o.y;
  if (o.type === "cone") {
    ctx.fillStyle = "#ff6010";
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x - 20, y + 20);
    ctx.lineTo(x + 20, y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillRect(x - 14, y - 6, 28, 5);
    ctx.fillRect(x - 17, y + 8, 34, 5);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x - 20, y + 20);
    ctx.lineTo(x + 20, y + 20);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 22, y + 18, 44, 4);
  } else if (o.type === "puddle") {
    ctx.fillStyle = "rgba(60,180,255,0.85)";
    ctx.beginPath();
    ctx.ellipse(x, y, 36, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(180,230,255,1)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(x - 12, y - 6, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(180,230,255,0.6)";
    ctx.fillRect(x - 28, y - 14, 4, 4);
    ctx.fillRect(x + 24, y - 10, 4, 4);
    ctx.fillRect(x - 26, y + 14, 4, 4);
    ctx.fillRect(x + 22, y + 12, 4, 4);
  } else {
    ctx.fillStyle = "#bbb";
    ctx.fillRect(x - 24, y - 12, 48, 22);
    ctx.fillStyle = "#666";
    for (let dy = -10; dy < 10; dy += 4) {
      ctx.fillRect(x - 22, y + dy, 44, 2);
    }
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(x - 22, y - 4, 44, 6);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 24, y - 12, 48, 22);
  }
}
export function drawMode2() {
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
  for (let i = 0; i < mode2.obstacles.length; i++) {
    drawObstacle(mode2.obstacles[i]);
  }
  const c = mode2.car;
  drawF1Car(c.x, c.y, 1.0, "rgb(220,30,30)", {
    rotation: c.rotation,
    glowColor: "rgb(255,40,40)"
  });
  drawParticles();
  drawHUD();
  const speed = Math.round(mode2.scrollSpeed * 30);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(canvas.width - 130, 35, 120, 36);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(canvas.width - 130, 35, 120, 36);
  ctx.fillStyle = "white";
  ctx.font = "11px Arial";
  ctx.textAlign = "left";
  ctx.fillText("SPEED", canvas.width - 120, 49);
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "rgb(255,80,80)";
  ctx.fillText(speed + " km/h", canvas.width - 120, 65);
  ctx.fillStyle = "#aaa";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MODE 2: SLALOM — change lane (← →) to dodge obstacles, survive longer for points",
               canvas.width / 2, canvas.height - 8);
}
