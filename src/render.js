export default class Render {
  constructor(config) {
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
    this.animations = () => {};
    this.loader = PIXI.loader;
    document.body.appendChild(this.renderer.view);
  }

  update(data) {
    data.forEach(player => {
      if (!this.resources.has(player.key)) {
        this.addPlayer(player);
      } else {
        this.resources.get(player.key).x = player.value.x;
        this.resources.get(player.key).y = player.value.y;
      }
    });
  }

  addPlayer(player) {
    this.resources.set(player.key, new PIXI.Sprite(
      PIXI.loader.resources[player.value.skin].texture
    ));
    this.stage.addChild(this.resources.get(player.key));
  }

  loadResources(resources, data) {
    resources.forEach(resource => {
      this.loader.add(resource.key, resource.src);
    });
    this.loader.load(this.initialize.bind(this, data));
  }

  initialize(players) {
    players.forEach(player => {
      this.resources.set(player.key, new PIXI.Sprite(
        PIXI.loader.resources[player.value.skin].texture
      ));
      this.stage.addChild(this.resources.get(player.key));
    });
    this.listenKeys();
  }

  run() {
    requestAnimationFrame(this.run);
    this.animations();
    this.renderer.render(this.stage);
  }

  setAnimations(animations) {
    this.animations = animations;
  }

  addSocket(socket) {
    this.socket = socket;
  }

  listenKeys() {
    const keysPressed = e => {
      this.keys[e.keyCode] = true;
    };

    const keysReleased = e => {
      this.keys[e.keyCode] = false;
    };
    window.onkeydown = keysPressed;
    window.onkeyup = keysReleased;
  }
}
