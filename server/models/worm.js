class Worm {
  constructor(payload) {
    this.skin = 'worm';
    this.x = payload ? payload.x : this.generateRandomNumber();
    this.y = payload ? payload.y : this.generateRandomNumber();
    this.weapon = {
      skin: 'gun',
      rotation: payload ? payload.weapon.rotation : 0
    };
  }
  generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }
}

module.exports = Worm;
