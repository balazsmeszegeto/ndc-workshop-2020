import { HubWorkerClient } from './worker/hub-worker-client';

export class UserDataSource extends HubWorkerClient {
    constructor(user, onClose, onUpdated, onCreated) {
        super('/userHub', onClose, ['Updated', 'Created']);
        this.user = user;
        this.canConnect = user.loggedIn;
        this.onUpdated = onUpdated;
        this.onCreated = onCreated;
    }

    /* override */ onHubEvent(eventName, data) {
        if (eventName === 'Updated')
            this.onUpdated(data);
        if (eventName === 'Created')
            this.onCreated(data);
    }

    async createOrders(restaurantIds) {
        return await this.invoke('CreateOrders', restaurantIds);
    }

    async getOrders() {
        return await this.invoke('GetOrders');
    }

    async rateOrder(orderId, score) {
        return await this.invoke('RateOrder', orderId, score);
    }
}