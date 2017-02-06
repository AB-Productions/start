export default class Render {
  constructor(config) {
    this.config = config;
    this.items = {};
    this.keys = {};
    this.run = this.run.bind(this);
    this.renderer = PIXI.autoDetectRenderer(config.width, config.height, {
      transparent: true,
      backgroundColor: '0x86D0F2'
    });
    this.stage = new PIXI.Container();
  }

  loadResources(resources) {
    const loader = PIXI.loader;
    Object.keys(resources).forEach(key => {
      this.items[key] = {};
      loader.add(key, resources[key]);
    });
    loader.load(this.initialize.bind(this));
  }

  initialize() {
    Object.keys(this.items).forEach((key) => {
      this.items[key] = new PIXI.Sprite(PIXI.loader.resources[key].texture);
      this.stage.addChild(this.items[key]);
    });
    document.body.appendChild(this.renderer.view);
    this.listenKeys();
  }

  run() {
    requestAnimationFrame(this.run);
    this.animations();
    this.renderer.render(this.stage);
  }

  listenKeys() {
    const keysPressed = e => {
      this.keys[e.keyCode] = true;
    };

    const keysReleased = e => {
      this.keys[e.keyCode] = false;
    };
    window.addEventListener("keydown", keysPressed, false);
    window.addEventListener("keyup", keysReleased, false);
  }
}
