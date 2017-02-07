(function () {
'use strict';

var Render$1 = function Render(config) {
  this.config = config;
  this.items = {};
  this.keys = {};
  this.currentPlayer = null;
  this.run = this.run.bind(this);
  this.update = this.update.bind(this);
  this.renderer = PIXI.autoDetectRenderer(config.width, config.height, {
    transparent: true,
    backgroundColor: '0x86D0F2'
  });
  this.stage = new PIXI.Container();
  this.animations = function () {};
  document.body.appendChild(this.renderer.view);
  this.loader = PIXI.loader;
};
Render$1.prototype.update = function update (stats) {
    var this$1 = this;

  var data = Object.keys(stats);
  data.forEach(function (key) {
    if (!this$1.items[key]) {
      this$1.addResource({ key: key, stats: stats });
    } else {
      this$1.items[key].x = stats[key].x;
      this$1.items[key].y = stats[key].y;
    }
  });
};
Render$1.prototype.addResource = function addResource (data) {
    var this$1 = this;

  this.loader.add(data.key, data.stats.skin);
  this.loader.load(function () {
    this$1.items[data.key] = new PIXI.Sprite(
      PIXI.loader.resources[data.key].texture
    );
    this$1.stage.addChild(this$1.items[data.key]);
  });
};
Render$1.prototype.loadResources = function loadResources (resources) {
    var this$1 = this;

  var models = Object.keys(resources).map(function (key) {
    if (!this$1.items[key]) {
      this$1.items[key] = {};
      this$1.loader.add(key, resources[key].skin);
      return key;
    }
  });
  this.loader.load(this.initialize.bind(this, models));
};

Render$1.prototype.initialize = function initialize (models) {
    var this$1 = this;

  if (models)
    { models.forEach(function (key) {
      this$1.items[key] = new PIXI.Sprite(PIXI.loader.resources[key].texture);
      this$1.stage.addChild(this$1.items[key]);
    }); }
  this.listenKeys();
};

Render$1.prototype.run = function run () {
  requestAnimationFrame(this.run);
  this.animations();
  this.renderer.render(this.stage);
};

Render$1.prototype.setAnimations = function setAnimations (animations) {
  this.animations = animations;
};

Render$1.prototype.addSocket = function addSocket (socket) {
  this.socket = socket;
};

Render$1.prototype.listenKeys = function listenKeys () {
    var this$1 = this;

  var keysPressed = function (e) {
    this$1.keys[e.keyCode] = true;
  };

  var keysReleased = function (e) {
    this$1.keys[e.keyCode] = false;
  };
  window.onkeydown = keysPressed;
  window.onkeyup = keysReleased;
};

var Socket = function Socket(config) {
  var this$1 = this;

  this.connection = new WebSocket('ws://localhost:3000');
  this.connection.onopen = function (msg) {
    config.init();
    this$1.ready = true;
  };
  this.connection.onerror = this.error.bind(this);
  this.connection.onmessage = this.get.bind(this);
  this.message = config.message;
  this.ready = false;
};
Socket.prototype.send = function send (message) {
  this.connection.send(JSON.stringify(message));
};

Socket.prototype.get = function get (message) {
  this.message(JSON.parse(message.data));
};

Socket.prototype.error = function error (err) {
  console.log(err);
};

var config = { width: 1500, height: 900 };
var renderer = new Render$1(config);
var socketConfig = {
  message: function (data) {
    if (data.type === 'init') {
      renderer.currentPlayer = data.currentPlayer;
      renderer.loadResources(data.payload);
    }
    if (data.type === 'update') {
      renderer.update(data.payload);
    }
  },
  init: function () {
    console.log('init');
  }
};
var socket = new Socket(socketConfig);
var animations = function () {
  if (
    renderer.keys[87] ||
      renderer.keys[83] ||
      renderer.keys[65] ||
      renderer.keys[68]
  ) {
    var currPlayer = renderer.items[renderer.currentPlayer];
    var stats = {
      player: renderer.currentPlayer,
      y: currPlayer.y,
      x: currPlayer.x
    };
    if (renderer.keys[87]) {
      stats.y -= 3;
    }
    if (renderer.keys[83]) {
      stats.y += 3;
    }
    if (renderer.keys[65]) {
      stats.x -= 3;
    }
    if (renderer.keys[68]) {
      stats.x += 3;
    }
    socket.send({
      type: 'update',
      stats: stats
    });
  }
};
renderer.addSocket(socket);
renderer.setAnimations(animations);
renderer.run();

}());
