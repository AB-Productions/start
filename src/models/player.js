export default class Player {
  constructor(params) {
    this.player = new PIXI.Sprite(
      PIXI.loader.resources[`${params.value.skin}${params.value.pos}`].texture
    );
    return this.player;
  }
}
