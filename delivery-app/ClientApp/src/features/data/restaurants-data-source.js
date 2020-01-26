import { HubWorkerClient } from './worker/hub-worker-client';

export class RestaurantsDataSource extends HubWorkerClient {
    constructor(onClose, onUpdated) {
        super('/restaurantsHub', onClose, ['Updated']);
        this.onUpdated = onUpdated;
    }

    /* override */ onHubEvent(eventName, data) {
        if (eventName === 'Updated')
            this.onUpdated(data);
    }

    async getTags() {
        return await this.invoke('GetTags');
    }

    async getRestaurants(selectedTagIds) {
        return await this.invoke('GetRestaurants', selectedTagIds);
    }
}