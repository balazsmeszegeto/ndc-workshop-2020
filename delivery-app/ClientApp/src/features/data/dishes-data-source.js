import DishesHubWorker from 'workerize-loader!./worker/dishes-hub-worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { HubWorkerClient } from './worker/hub-worker-client';

export class DishesDataSource extends HubWorkerClient {
    constructor(onClose) {
        super('/dishesHub', onClose);
    }

    /* override */ createWorker() {
        return new DishesHubWorker();
    }

    async getRestaurant(selectedRestaurantId) {
        return await this.invoke('GetRestaurant', selectedRestaurantId);
    }
}