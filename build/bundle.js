'use strict';

var renderer = PIXI.autoDetectRenderer(600, 800, {
  transparent: true,
  backgroundColor: "0x86D0F2"
});

// 2. Append canvas element to the body
document.body.appendChild(renderer.view);

// 3. Create a container that will hold your scene
var stage = new PIXI.Container();

PIXI.loader.add("/images/worm.png").load(render);



function render() {
  var worm = new PIXI.Sprite(PIXI.loader.resources["/images/worm.png"].texture);

  stage.addChild(worm);
  renderer.render(stage);
}
