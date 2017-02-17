(function () {
'use strict';

var Weapon = function Weapon(params) {
  this.weapon = new PIXI.Sprite(
    PIXI.loader.resources[params.value.weapon.skin + params.value.pos].texture
  );
  this.weapon.x = 20;
  this.weapon.y = 20;
  this.weapon.rotation = params.value.weapon.rotation;
  this.weapon.anchor.x = 0.2;
  this.weapon.anchor.y = 0.5;
  return this.weapon;
};

var Player = function Player(params) {
  this.player = new PIXI.Sprite(
    PIXI.loader.resources[("" + (params.value.skin) + (params.value.pos))].texture
  );
  return this.player;
};

var Bullet = function Bullet(params) {
  this.bullet = new PIXI.Sprite(PIXI.loader.resources['bullet'].texture);
  this.bullet.x = params.x +
    Math.cos(params.weapon.rotation) * 30 +
    (params.weapon.rotation < 0 ? 1 : 40);
  this.bullet.y = params.y +
    Math.sin(params.weapon.rotation) * 30 +
    (params.weapon.rotation < 0 ? 1 : 10);
  this.bullet.rotation = params.weapon.rotation;
  this.speed = 5;
  return this.bullet;
};

var ListenKeys = function ListenKeys(keys) {
  this.listenKeys(keys);
};
ListenKeys.prototype.listenKeys = function listenKeys (keys) {
  var keysPressed = function (e) {
    keys[e.keyCode] = true;
  };
  var keysReleased = function (e) {
    keys[e.keyCode] = false;
  };
  window.onkeydown = keysPressed;
  window.onkeyup = keysReleased;
};

var Render$1 = function Render(config) {
  this.config = config;
  this.resources = new Map();
  this.keys = {};
  this.player = null;
  this.shots = new Map();
  this.run = this.run.bind(this);
  this.update = this.update.bind(this);
  this.renderer = new PIXI.WebGLRenderer(config.width, config.height);
  this.stage = new PIXI.Container();
  document.body.appendChild(this.renderer.view);
};

Render$1.prototype.update = function update (data) {
    var this$1 = this;

  // Server sends less players, than client has online
  if (data.length < this.resources.size) {
    this.findDeletedPlayer(data);
  }
  data.forEach(function (player) {
    if (!this$1.resources.has(player.key)) {
      // Server sends more players, than client has online
      this$1.addPlayer(player);
    } else {
      var playerData = this$1.resources.get(player.key);
      playerData.pos = player.value.pos;
      playerData.x = player.value.x;
      playerData.y = player.value.y;
      playerData.children[0].setTexture(
        PIXI.loader.resources[player.value.skin + player.value.pos].texture
      );
      playerData.children[1].setTexture(
        PIXI.loader.resources[
          player.value.weapon.skin + player.value.pos
        ].texture
      );
      playerData.children[1].rotation = player.value.weapon.rotation;
    }
    if (player.value.shot) {
      this$1.shoot(JSON.parse(player.value.shot));
    }
  });
};

Render$1.prototype.findDeletedPlayer = function findDeletedPlayer (data) {
    var this$1 = this;

  this.resources.forEach(function (value, key) {
    var playerOnline = data.filter(function (player) { return player.key === key; });
    if (playerOnline.length === 0) {
      this$1.stage.removeChild(value);
      this$1.resources.delete(key);
    }
  });
};

Render$1.prototype.addPlayer = function addPlayer (player) {
  var PlayerModel = new PIXI.Container();
  var PlayerWorm = new Player(player);
  var PlayerWeapon = new Weapon(player);
  PlayerModel.pos = player.value.pos;
  PlayerModel.addChild(PlayerWorm);
  PlayerModel.addChild(PlayerWeapon);
  this.resources.set(player.key, PlayerModel);
  this.stage.addChild(PlayerModel);
};

Render$1.prototype.loadResources = function loadResources (resources, data) {
  resources.forEach(function (resource) {
    PIXI.loader.add(resource.key, resource.src);
  });
  PIXI.loader.load(this.initialize.bind(this, data));
  new ListenKeys(this.keys);
};

Render$1.prototype.shoot = function shoot (stats) {
  var bullet = new Bullet(stats);
  bullet.uuid = PIXI.utils.uuid();
  this.stage.addChild(bullet);
  this.shots.set(bullet.uuid, bullet);
};

Render$1.prototype.initialize = function initialize (players) {
    var this$1 = this;

  players.forEach(function (player) {
    this$1.addPlayer(player);
  });
};

Render$1.prototype.run = function run () {
  requestAnimationFrame(this.run);
  this.renderer.render(this.stage);
};

var Socket = function Socket(config) {
  var this$1 = this;

  this.connection = new WebSocket(config.url);
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

var resources = [
  { key: 'wormR', src: './images/wormR.png' },
  { key: 'wormL', src: './images/wormL.png' },
  { key: 'cat', src: './images/cat.png' },
  { key: 'gunR', src: './images/gunR.png' },
  { key: 'gunL', src: './images/gunL.png' },
  { key: 'bullet', src: './images/bullet.png' }
];
var renderConfig = { width: 1500, height: 600 };

var key = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  UP: 38,
  DOWN: 40,
  SHIFT: 16
};

var renderer = new Render$1(renderConfig);
var socketConfig = {
  url: 'ws://localhost:3000',
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
    renderer.run();
  }
};

var socket = new Socket(socketConfig);
var animations = function (currentPlayer) {
  var stats = {
    player: renderer.player,
    y: currentPlayer.y,
    x: currentPlayer.x,
    pos: currentPlayer.pos,
    weapon: {
      rotation: currentPlayer.children[1].rotation
    },
    shot: null
  };
  if (renderer.keys[key.W]) {
    stats.y -= 3;
  }
  if (renderer.keys[key.S]) {
    stats.y += 3;
  }
  if (renderer.keys[key.A]) {
    stats.x -= 3;
    stats.pos = 'L';
  }
  if (renderer.keys[key.D]) {
    stats.x += 3;
    stats.pos = 'R';
  }
  if (renderer.keys[key.UP]) {
    stats.weapon.rotation -= 0.1;
  }
  if (renderer.keys[key.DOWN]) {
    stats.weapon.rotation += 0.1;
  }
  if (renderer.keys[key.SHIFT]) {
    stats.shot = JSON.stringify(stats);
  }
  socket.send({
    type: 'update',
    stats: stats
  });
};

PIXI.ticker.shared.add(function () {
  var currentPlayer = renderer.resources.get(renderer.player);

  if (currentPlayer) {
    animations(currentPlayer);
  }
  renderer.shots.forEach(function (bullet) {
    bullet.x += Math.cos(bullet.rotation) * 5;
    bullet.y += Math.sin(bullet.rotation) * 5;
    if (
      bullet.x > renderConfig.width ||
      bullet.x === 0 ||
      bullet.y > renderConfig.height ||
      bullet.y === 0
    ) {
      renderer.stage.removeChild(bullet);
      renderer.shots.delete(bullet.uuid);
    }
  });
});

}());
