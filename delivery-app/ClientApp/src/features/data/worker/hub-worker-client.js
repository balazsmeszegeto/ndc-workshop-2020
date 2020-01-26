import HubWorker from 'workerize-loader!./hub-worker'; // eslint-disable-line import/no-webpack-loader-syntax

export class HubWorkerClient {
    user;
    canConnect = true;
    connected = false;

    constructor(endpoint, onClose, eventsToHandle) {
        this.endpoint = endpoint;
        this.onClose = onClose;
        this.eventsToHandle = eventsToHandle;
        this.worker = this.createWorker();
        this.worker.addEventListener('message', message => this.onMessage(message.data));
    }

    withReconnectCallback(callback) {
        this.reconnectedCallback = callback;
        return this;
    }

    /* virtual */ createWorker() {
        return new HubWorker();
    }

    async connect() {
        if (!this.canConnect)
            return;

        await this.worker.connect(this.endpoint, this.user && this.user.accessToken, this.eventsToHandle);
        this.connected = true;
    }

    async stop() {
        await this.worker.stop();
        this.connected = false;
    }

    async invoke(method, ...args) {
        if (!this.connected)
            return;

        return await this.worker.invoke(method, args);
    }

    onMessage({ type, eventName, data }) {
        if (type === 'hubevent')
            this.onHubEvent(eventName, data);
        if (type === 'connection' && eventName === 'close') {
            this.connected = false;
            this.onClose(this);
        }

    }

    /* virtual */ onHubEvent(eventName, data) {}
}