export default class Render {
  constructor(config) {
    this.config = config;
    this.items = {};
    this.gameLoop = this.gameLoop.bind(this);
    this.renderer = PIXI.autoDetectRenderer(600, 800, {
      transparent: true,
      backgroundColor: '0x86D0F2'
    });
    this.stage = new PIXI.Container();
  }

  loadResources(resources) {
    const loader = PIXI.loader;
    Object.entries(resources).forEach(key => {
      loader.add(key[0], key[1]);
    });
    loader.load(this.initialize.bind(this));
  }

  initialize() {
    this.items['worm'] = new PIXI.Sprite(PIXI.loader.resources['worm'].texture);
    this.stage.addChild(this.items['worm']);

    document.body.appendChild(this.renderer.view);
    this.gameLoop();
  }

  gameLoop(stage) {
    requestAnimationFrame(this.gameLoop);
    this.items['worm'].x += 1;
    this.renderer.render(this.stage);
  }
}
