(function () {
'use strict';

var Render$1 = function Render(config) {
  this.config = config;
  this.items = {};
  this.gameLoop = this.gameLoop.bind(this);
  this.renderer = PIXI.autoDetectRenderer(600, 800, {
    transparent: true,
    backgroundColor: '0x86D0F2'
  });
  this.stage = new PIXI.Container();
};

Render$1.prototype.loadResources = function loadResources (resources) {
  var loader = PIXI.loader;
  Object.entries(resources).forEach(function (key) {
    loader.add(key[0], key[1]);
  });
  loader.load(this.initialize.bind(this));
};

Render$1.prototype.initialize = function initialize () {
  this.items['worm'] = new PIXI.Sprite(PIXI.loader.resources['worm'].texture);
  this.stage.addChild(this.items['worm']);

  document.body.appendChild(this.renderer.view);
  this.gameLoop();
};

Render$1.prototype.gameLoop = function gameLoop (stage) {
  requestAnimationFrame(this.gameLoop);
  this.items['worm'].x += 1;
  this.renderer.render(this.stage);
};

var renderer = new Render$1();
var resources = { worm: './images/worm.png' };

renderer.loadResources(resources);

}());
