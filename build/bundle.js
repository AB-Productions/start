(function () {
'use strict';

var Render$1 = function Render(config) {
  this.config = config;
  this.resources = new Map();
  this.keys = {};
  this.player = null;
  this.run = this.run.bind(this);
  this.update = this.update.bind(this);
  this.renderer = PIXI.autoDetectRenderer(config.width, config.height, {
    transparent: true,
    backgroundColor: "0x86D0F2"
  });
  this.stage = new PIXI.Container();
  this.animations = function () {};
  this.loader = PIXI.loader;
  document.body.appendChild(this.renderer.view);
};

Render$1.prototype.update = function update (data) {
    var this$1 = this;

  data.forEach(function (player) {
    if (!this$1.resources.has(player.key)) {
      this$1.addPlayer(player);
    } else {
      this$1.resources.get(player.key).x = player.value.x;
      this$1.resources.get(player.key).y = player.value.y;
    }
  });
};

Render$1.prototype.addPlayer = function addPlayer (player) {
  this.resources.set(player.key, new PIXI.Sprite(
    PIXI.loader.resources[player.value.skin].texture
  ));
  this.stage.addChild(this.resources.get(player.key));
};

Render$1.prototype.loadResources = function loadResources (resources, data) {
    var this$1 = this;

  resources.forEach(function (resource) {
    this$1.loader.add(resource.key, resource.src);
  });
  this.loader.load(this.initialize.bind(this, data));
};

Render$1.prototype.initialize = function initialize (players) {
    var this$1 = this;

  players.forEach(function (player) {
    this$1.resources.set(player.key, new PIXI.Sprite(
      PIXI.loader.resources[player.value.skin].texture
    ));
    this$1.stage.addChild(this$1.resources.get(player.key));
  });
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

  this.connection = new WebSocket('ws://192.168.76.12:3000');
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

var resources = [
  { key:'worm', src:'./images/worm.png'},
  { key:'cat', src:'./images/cat.png'}
];

var socketConfig = {
  message: function (data) {
    if (data.type === 'init') {
      renderer.player = data.currentPlayer;
      renderer.loadResources(resources, data.payload);
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
    var currPlayer = renderer.resources.get(renderer.player);
    var stats = {
      player: renderer.player,
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
