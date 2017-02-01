'use strict';

// Create the canvas
var canvas = document.getElementById('game');
var context = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
var left = 30;
var up = 10;
var keys = {};

var keysPressed = function (e) {
  keys[e.keyCode] = true;
};

var keysReleased = function (e) {
  keys[e.keyCode] = false;
};


var render = function () {
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
};
var moveRight = function () {
    left += 2;
  };
var moveLeft = function () {
    left -= 2;
  };
var moveTop = function () {
    up -= 5;
  };
var moveBottom = function () {
    up += 2;
  };

render();

window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);
