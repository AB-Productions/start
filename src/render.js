export default class Render {
  constructor(config) {
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
    this.animations = () => {};
    document.body.appendChild(this.renderer.view);
    this.loader = PIXI.loader;
  }
  update(stats) {
    const data = Object.keys(stats);
    data.forEach(key => {
      if (!this.items[key]) {
        this.addResource({ key, stats: stats[key] });
      } else {
        this.items[key].x = stats[key].x;
        this.items[key].y = stats[key].y;
      }
    });
  }
  addResource(data) {
    this.items[data.key] = new PIXI.Sprite(this.worm);
    this.stage.addChild(this.items[data.key]);
  }
  loadResources(resources) {
    const models = Object.keys(resources).map(key => {
      if (!this.items[key]) {
        this.items[key] = {};
        this.loader.add(key, resources[key].skin);
        return key;
      }
    });
    this.loader.load(this.initialize.bind(this, models));
  }

  initialize(models) {
    if (models)
      models.forEach(key => {
        this.worm = PIXI.loader.resources[key].texture;
        this.items[key] = new PIXI.Sprite(PIXI.loader.resources[key].texture);
        this.stage.addChild(this.items[key]);
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
