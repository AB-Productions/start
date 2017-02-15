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
    this.shots = new Map();
    this.run = this.run.bind(this);
    this.update = this.update.bind(this);
    this.renderer = new PIXI.WebGLRenderer(config.width, config.height);
    this.stage = new PIXI.Container();
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
        const playerData = this.resources.get(player.key);
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
        this.shoot(JSON.parse(player.value.shot));
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
    PlayerModel.pos = player.value.pos;
    PlayerModel.addChild(PlayerWorm);
    PlayerModel.addChild(PlayerWeapon);
    this.resources.set(player.key, PlayerModel);
    this.stage.addChild(PlayerModel);
  }

  loadResources(resources, data) {
    resources.forEach(resource => {
      PIXI.loader.add(resource.key, resource.src);
    });
    PIXI.loader.load(this.initialize.bind(this, data));
    new KeyListener(this.keys);
  }

  shoot(stats) {
    const bullet = new Bullet(stats);
    bullet.uuid = PIXI.utils.uuid();
    this.stage.addChild(bullet);
    this.shots.set(bullet.uuid, bullet);
  }

  initialize(players) {
    players.forEach(player => {
      this.addPlayer(player);
    });
  }

  run() {
    requestAnimationFrame(this.run);
    this.renderer.render(this.stage);
  }
}
