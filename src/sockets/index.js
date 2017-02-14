export default class Socket {
  constructor(config) {
    this.connection = new WebSocket(config.url);
    this.connection.onopen = msg => {
      config.init();
      this.ready = true;
    };
    this.connection.onerror = this.error.bind(this);
    this.connection.onmessage = this.get.bind(this);
    this.message = config.message;
    this.ready = false;
  }
  send(message) {
    this.connection.send(JSON.stringify(message));
  }

  get(message) {
    this.message(JSON.parse(message.data));
  }

  error(err) {
    console.log(err);
  }
}
