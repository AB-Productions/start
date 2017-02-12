export default class Player {
  constructor(params) {
    this.player = new PIXI.Sprite(
      PIXI.loader.resources[params.value.skin].texture
    );
    return this.player;
  }
}
