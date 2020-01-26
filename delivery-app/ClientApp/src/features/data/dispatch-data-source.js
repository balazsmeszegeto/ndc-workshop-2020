import { HubWorkerClient } from './worker/hub-worker-client';

export class DispatchDataSource extends HubWorkerClient {
    constructor(user, onClose, onOrderCompleted, onPendingOrdersCreated) {
        super('/dispatchHub', onClose, ['OrderCompleted', 'PendingOrdersCreated']);
        this.user = user;
        this.canConnect = this.user.dispatch;
        this.onOrderCompleted = onOrderCompleted;
        this.onPendingOrdersCreated = onPendingOrdersCreated;
    }

    /* override */ onHubEvent(eventName, data) {
        if (eventName === 'OrderCompleted')
            this.onOrderCompleted(data);
        if (eventName === 'PendingOrdersCreated')
            this.onPendingOrdersCreated(data);
    }

    async getPendingOrders(selectedRestaurantId) {
        return await this.invoke('GetPendingOrders', selectedRestaurantId);
    }

    async completeOrder(orderId) {
        return await this.invoke('CompleteOrder', orderId);
    }

    async streamOrders(restaurantId) {
        if (!this.connected)
            return;

        return await this.worker.stream('StreamOrders', true, [restaurantId]);
    }
}