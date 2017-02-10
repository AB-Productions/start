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

  remove(key) {
    return this.collection.delete(key);
  }

  getPlayers() {
    let response = [];
    for (let [key, value] of this.collection.entries()) {
      response.push({key, value});
    }
    return response;
  }

  update(payload) {
    this.add(payload.player, {
      skin: 'worm',
      x: payload.x,
      y: payload.y
    });
  }

  createPlayer() {
    const id = uuidV1(), key = `worm${id}`;
    this.add(key, {
      skin: 'worm',
      x: generateRandomNumber(),
      y: generateRandomNumber()
    });
    return key;
  }
}

module.exports = Players;
