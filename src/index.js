import Renderer from './render';
import Socket from './sockets';
const config = { width: 1500, height: 900 };
const renderer = new Renderer(config);

const resources = [
  { key:'worm', src:'./images/worm.png'},
  { key:'cat', src:'./images/cat.png'}
]

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
    console.log('init');
  }
};
const socket = new Socket(socketConfig);
const animations = () => {
  if (
    renderer.keys[87] ||
      renderer.keys[83] ||
      renderer.keys[65] ||
      renderer.keys[68]
  ) {
    const currPlayer = renderer.resources.get(renderer.player);
    let stats = {
      player: renderer.player,
      y: currPlayer.y,
      x: currPlayer.x
    };
    if (renderer.keys[87]) {
      stats.y -= 3;
    }
    if (renderer.keys[83]) {
      stats.y += 3;
    }
    if (renderer.keys[65]) {
      stats.x -= 3;
    }
    if (renderer.keys[68]) {
      stats.x += 3;
    }
    socket.send({
      type: 'update',
      stats
    });
  }
};
renderer.addSocket(socket);
renderer.setAnimations(animations);
renderer.run();
