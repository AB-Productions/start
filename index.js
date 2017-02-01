// Create the canvas
const canvas = document.getElementById('game'),
  context = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
let left = 30, up = 10;
let keys = {};

const keysPressed = e => {
  keys[e.keyCode] = true;
};

const keysReleased = e => {
  keys[e.keyCode] = false;
};


const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillRect(10, 10, 100, 50);
  context.lineWidth = 5;
  context.fillStyle = "red";
  context.strokeRect(left, up, 70, 30);

  if (keys[65]) {
    moveLeft();
  }
  if (keys[87]) {
    moveTop();
  }
  if (keys[68]) {
    moveRight();
  }
  if (keys[83]) {
    moveBottom();
  }
  window.requestAnimationFrame(render);
},
  moveRight = () => {
    left += 2;
  },
  moveLeft = () => {
    left -= 2;
  },
  moveTop = () => {
    up -= 5;
  },
  moveBottom = () => {
    up += 2;
  };

render();

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);
