const uuidV1 = require('uuid/v1');
const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
};

class Players {
  constructor() {
    this.collection = new Map();
    this.createPlayer = this.createPlayer.bind(this);
  }
  add(key, value) {
    this.collection.set(key, value);
  }

  get(key) {
    return this.collection.get(key);
  }

  getPlayers() {
    let response = {};
    for (let [key, value] of this.collection.entries()) {
      response[key] = value;
    }
    return response;
  }

  update(payload) {
    this.add(payload.player, {
      skin: './images/worm.png',
      x: payload.x,
      y: payload.y
    });
  }

  createPlayer() {
    const id = uuidV1(), key = `worm${id}`;
    this.add(key, {
      skin: './images/worm.png',
      x: generateRandomNumber(),
      y: generateRandomNumber()
    });
    return key;
  }
}

module.exports = Players;
