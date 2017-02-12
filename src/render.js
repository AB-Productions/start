import Weapon from './models/weapon';
import Player from './models/player';
import Bullet from './models/bullet';
import KeyListener from './helpers/keylistener';

export default class Render {
  constructor(config) {
    this.config = config;
    this.resources = new Map();
    this.keys = {};
    this.player = null;
    this.shots = [];
    this.run = this.run.bind(this);
    this.update = this.update.bind(this);
    this.renderer = new PIXI.WebGLRenderer(config.width, config.height);
    this.stage = new PIXI.Container();
    this.animations = () => {};
    document.body.appendChild(this.renderer.view);
  }

  update(data) {
    // Server sends less players, than client has online
    if (data.length < this.resources.size) {
      this.findDeletedPlayer(data);
    }
    data.forEach(player => {
      if (!this.resources.has(player.key)) {
        // Server sends more players, than client has online
        this.addPlayer(player);
      } else {
        this.resources.get(player.key).x = player.value.x;
        this.resources.get(player.key).y = player.value.y;
        this.resources.get(player.key).children[
          1
        ].rotation = player.value.weapon.rotation;
      }
    });
  }

  findDeletedPlayer(data) {
    this.resources.forEach((value, key) => {
      const playerOnline = data.filter(player => player.key === key);
      if (playerOnline.length === 0) {
        this.stage.removeChild(value);
        this.resources.delete(key);
      }
    });
  }

  addPlayer(player) {
    const PlayerModel = new PIXI.Container();
    const PlayerWorm = new Player(player);
    const PlayerWeapon = new Weapon(player);
    PlayerModel.addChild(PlayerWorm);
    PlayerModel.addChild(PlayerWeapon);
    this.resources.set(player.key, PlayerModel);
    this.stage.addChild(this.resources.get(player.key));
  }

  loadResources(resources, data) {
    resources.forEach(resource => {
      PIXI.loader.add(resource.key, resource.src);
    });
    PIXI.loader.load(this.initialize.bind(this, data));
    new KeyListener(this.keys);
  }

  shoot(stats) {
    const projectile = new Bullet(stats);
    this.stage.addChild(projectile);
    this.shots.push(projectile);
  }

  initialize(players) {
    players.forEach(player => {
      this.addPlayer(player);
    });
  }

  run() {
    requestAnimationFrame(this.run);
    this.animations();
    this.shots.forEach(bullet => {
      bullet.x += Math.cos(bullet.rotation) * 5;
      bullet.y += Math.sin(bullet.rotation) * 5;
      if (bullet.x > 600) {
        this.stage.removeChild(bullet);
      }
    });
    this.renderer.render(this.stage);
  }

  setAnimations(animations) {
    this.animations = animations;
  }
}
