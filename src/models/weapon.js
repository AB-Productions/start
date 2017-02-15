export default class Weapon {
  constructor(params) {
    this.weapon = new PIXI.Sprite(
      PIXI.loader.resources[params.value.weapon.skin + params.value.pos].texture
    );
    this.weapon.x = 20;
    this.weapon.y = 20;
    this.weapon.rotation = params.value.weapon.rotation;
    this.weapon.anchor.x = 0.2;
    this.weapon.anchor.y = 0.5;
    return this.weapon;
  }
}
