(function () {
'use strict';

var Render$1 = function Render(config) {
  this.config = config;
  this.items = {};
  this.keys = {};
  this.run = this.run.bind(this);
  this.renderer = PIXI.autoDetectRenderer(config.width, config.height, {
    transparent: true,
    backgroundColor: '0x86D0F2'
  });
  this.stage = new PIXI.Container();
};

Render$1.prototype.loadResources = function loadResources (resources) {
    var this$1 = this;

  var loader = PIXI.loader;
  Object.keys(resources).forEach(function (key) {
    this$1.items[key] = {};
    loader.add(key, resources[key]);
  });
  loader.load(this.initialize.bind(this));
};

Render$1.prototype.initialize = function initialize () {
    var this$1 = this;

  Object.keys(this.items).forEach(function (key) {
    this$1.items[key] = new PIXI.Sprite(PIXI.loader.resources[key].texture);
    this$1.stage.addChild(this$1.items[key]);
  });
  document.body.appendChild(this.renderer.view);
  this.listenKeys();
};

Render$1.prototype.run = function run () {
  requestAnimationFrame(this.run);
  this.animations();
  this.renderer.render(this.stage);
};

Render$1.prototype.listenKeys = function listenKeys () {
    var this$1 = this;

  var keysPressed = function (e) {
    this$1.keys[e.keyCode] = true;
  };

  var keysReleased = function (e) {
    this$1.keys[e.keyCode] = false;
  };
  window.addEventListener("keydown", keysPressed, false);
  window.addEventListener("keyup", keysReleased, false);
};

var config = {
  'width':1500,
  'height':900
};
var renderer = new Render$1(config);
var resources = { worm: './images/worm.png'};

renderer.loadResources(resources);

renderer.animations = function () {
  if(renderer.keys[87]) {
    //up
    renderer.items['worm'].y -= 1;
  }
  if(renderer.keys[83]) {
    //down
    renderer.items['worm'].y += 3;
  }
  if(renderer.keys[65]) {
    //left
    renderer.items['worm'].x -= 3;
  }
  if(renderer.keys[68]) {
    //right
    renderer.items['worm'].x += 3;
  }
};

renderer.run();

}());
