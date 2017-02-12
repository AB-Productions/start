export default class ListenKeys {
  constructor(keys) {
    this.listenKeys(keys);
  }
  listenKeys(keys) {
    const keysPressed = e => {
      keys[e.keyCode] = true;
    };
    const keysReleased = e => {
      keys[e.keyCode] = false;
    };
    window.onkeydown = keysPressed;
    window.onkeyup = keysReleased;
  }
}
