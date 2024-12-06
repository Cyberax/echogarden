export class SignalChannel {
    channel;
    handlers = new Map();
    constructor() {
        this.channel = new MessageChannel();
        this.channel.port2.onmessage = (event) => {
            const signalName = event.data.signalName;
            const signalData = event.data.data;
            const handler = this.handlers.get(signalName);
            if (handler) {
                handler(signalData);
            }
        };
    }
    on(signalName, handler) {
        this.handlers.set(signalName, handler);
    }
    send(signalName, data) {
        this.channel.port1.postMessage({ signalName, data });
    }
}
//# sourceMappingURL=SignalChannel.js.map