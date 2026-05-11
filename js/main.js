import { canvas, state, mouse, keys, updateParticles } from "./common.js";
import { drawMenu, updateMenu, drawGameOver, startMode } from "./menu.js";
import { updateMode1, drawMode1, setBeamColor } from "./mode1.js";
import { updateMode2, drawMode2, laneChangeMode2 } from "./mode2.js";
import { updateMode3, drawMode3, laneChangeMode3, tryActivateDRS } from "./mode3.js";
function gameLoop() {
  if (state.current === "menu") {
    updateMenu();
    drawMenu();
  } else if (state.current === "mode1") {
    updateMode1();
    updateParticles();
    drawMode1();
  } else if (state.current === "mode2") {
    updateMode2();
    updateParticles();
    drawMode2();
  } else if (state.current === "mode3") {
    updateMode3();
    updateParticles();
    drawMode3();
  } else if (state.current === "gameover") {
    drawGameOver();
  }
  requestAnimationFrame(gameLoop);
}
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft")  keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "Escape") {
    state.current = "menu";
  }
  if (state.current === "mode1") {
    if (e.key === "1") setBeamColor("r");
    if (e.key === "2") setBeamColor("g");
    if (e.key === "3") setBeamColor("b");
  }
  if (state.current === "mode2") {
    if (e.key === "ArrowLeft")  laneChangeMode2("left");
    if (e.key === "ArrowRight") laneChangeMode2("right");
  }
  if (state.current === "mode3") {
    if (e.key === "ArrowLeft")  laneChangeMode3("left");
    if (e.key === "ArrowRight") laneChangeMode3("right");
    if (e.key === " " || e.code === "Space") {
      tryActivateDRS();
      e.preventDefault();
    }
  }
});
document.addEventListener("keyup", function(e) {
  if (e.key === "ArrowLeft")  keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});
canvas.addEventListener("mousemove", function(e) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", function() {
  mouse.clicked = true;
});
requestAnimationFrame(gameLoop);
