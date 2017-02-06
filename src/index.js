import Renderer from './render';
const config = {
  'width':1500,
  'height':900
}
const renderer = new Renderer(config);
const resources = { worm: './images/worm.png'};

renderer.loadResources(resources);

renderer.animations = () => {
  if(renderer.keys[87]) {
    //up
    renderer.items['worm'].y -= 1;
  }
  if(renderer.keys[83]) {
    //down
    renderer.items['worm'].y += 3;
  }
  if(renderer.keys[65]) {
    //left
    renderer.items['worm'].x -= 3;
  }
  if(renderer.keys[68]) {
    //right
    renderer.items['worm'].x += 3;
  }
}

renderer.run();
