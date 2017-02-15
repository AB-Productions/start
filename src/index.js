import Renderer from './render';
import Socket from './sockets';
import { renderConfig, resources } from './helpers/configs';
const renderer = new Renderer(renderConfig);
import key from './helpers/keymap';

const socketConfig = {
  url: 'ws://localhost:3000',
  message: data => {
    if (data.type === 'init') {
      renderer.player = data.currentPlayer;
      renderer.loadResources(resources, data.payload);
    }
    if (data.type === 'update') {
      renderer.update(data.payload);
    }
  },
  init: () => {
    renderer.run();
  }
};

const socket = new Socket(socketConfig);
const animations = currentPlayer => {
  let stats = {
    player: renderer.player,
    y: currentPlayer.y,
    x: currentPlayer.x,
    pos: currentPlayer.pos,
    weapon: {
      rotation: currentPlayer.children[1].rotation
    },
    shot: null
  };
  if (renderer.keys[key.W]) {
    stats.y -= 3;
  }
  if (renderer.keys[key.S]) {
    stats.y += 3;
  }
  if (renderer.keys[key.A]) {
    stats.x -= 3;
    stats.pos = 'L';
  }
  if (renderer.keys[key.D]) {
    stats.x += 3;
    stats.pos = 'R';
  }
  if (renderer.keys[key.UP]) {
    stats.weapon.rotation -= 0.1;
  }
  if (renderer.keys[key.DOWN]) {
    stats.weapon.rotation += 0.1;
  }
  if (renderer.keys[key.SHIFT]) {
    stats.shot = JSON.stringify(stats);
  }
  socket.send({
    type: 'update',
    stats
  });
};

PIXI.ticker.shared.add(() => {
  const currentPlayer = renderer.resources.get(renderer.player);

  if (currentPlayer) {
    animations(currentPlayer);
  }
  renderer.shots.forEach(bullet => {
    bullet.x += Math.cos(bullet.rotation) * 5;
    bullet.y += Math.sin(bullet.rotation) * 5;
    if (
      bullet.x > renderConfig.width ||
      bullet.x === 0 ||
      bullet.y > renderConfig.height ||
      bullet.y === 0
    ) {
      renderer.stage.removeChild(bullet);
      renderer.shots.delete(bullet.uuid);
    }
  });
});
