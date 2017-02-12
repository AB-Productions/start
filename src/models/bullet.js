export default class Bullet {
  constructor(params) {
    this.bullet = new PIXI.Sprite(PIXI.loader.resources['bullet'].texture);
    this.bullet.x = params.x + Math.cos(params.weapon.rotation) * 20 + 40;
    this.bullet.y = params.y + Math.cos(params.weapon.rotation) * 20 + 50;
    this.bullet.rotation = params.weapon.rotation;
    this.speed = 5;
    return this.bullet;
  }
}
