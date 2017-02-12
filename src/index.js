import Renderer from './render';
import Socket from './sockets';
import { renderConfig, resources } from './helpers/configs';
const renderer = new Renderer(renderConfig);
import key from './helpers/keymap';

const socketConfig = {
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
    renderer.setAnimations(animations);
    renderer.run();
  }
};
const socket = new Socket(socketConfig);
const animations = () => {
  if (
    renderer.keys[key.W] ||
      renderer.keys[key.S] ||
      renderer.keys[key.D] ||
      renderer.keys[key.A] ||
      renderer.keys[key.UP] ||
      renderer.keys[key.DOWN] ||
      renderer.keys[key.CTRL]
  ) {
    const currentPlayer = renderer.resources.get(renderer.player);
    let stats = {
      player: renderer.player,
      y: currentPlayer.y,
      x: currentPlayer.x,
      weapon: {
        rotation: currentPlayer.children[1].rotation
      }
    };
    if (renderer.keys[key.W]) {
      stats.y -= 3;
    }
    if (renderer.keys[key.S]) {
      stats.y += 3;
    }
    if (renderer.keys[key.A]) {
      stats.x -= 3;
    }
    if (renderer.keys[key.D]) {
      stats.x += 3;
    }
    if (renderer.keys[key.UP]) {
      stats.weapon.rotation -= 0.1;
    }
    if (renderer.keys[key.DOWN]) {
      stats.weapon.rotation += 0.1;
    }
    if (renderer.keys[key.CTRL]) {
      renderer.shoot(stats);
    }
    socket.send({
      type: 'update',
      stats
    });
  }
};
