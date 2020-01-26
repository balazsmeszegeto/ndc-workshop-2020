import { RestaurantsDataSource } from './restaurants-data-source';
import { DishesDataSource } from './dishes-data-source';
import { DispatchDataSource } from './dispatch-data-source';
import { UserDataSource } from './user-data-source';

function setTimeoutAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class DataSources {
    dataSources = [];
    online = true;

    onClose = async dataSource => {
        console.log('Disconnected', dataSource.endpoint);
        this.checkConnections();

        await setTimeoutAsync(5000);

        try {
            console.log('Attempting to reconnect', dataSource.endpoint);
            await dataSource.connect();
            console.log('Reconnected', dataSource.endpoint);
            if (dataSource.reconnectedCallback)
                dataSource.reconnectedCallback();

            this.checkConnections();
        } catch {
            this.onClose(dataSource);
        }

    };

    constructor(user, setOnline) {
        this.user = user;
        this.setOnline = setOnline;
    }

    createRestaurantsDataSource(updatedCallback) {
        const ds = new RestaurantsDataSource(this.onClose, updatedCallback);
        this.dataSources.push(ds)
        return ds;
    }

    createDetailsDataSource() {
        const ds = new DishesDataSource(this.onClose);
        this.dataSources.push(ds)
        return ds;
    }

    createDispatchDataSource(onOrderCompleted, onPendingOrdersCreated) {
        const ds = new DispatchDataSource(this.user, this.onClose, onOrderCompleted, onPendingOrdersCreated);
        this.dataSources.push(ds)
        return ds;
    }

    createUserDataSource(onUpdated, onCreated) {
        const ds = new UserDataSource(this.user, this.onClose, onUpdated, onCreated);
        this.dataSources.push(ds)
        return ds;
    }

    checkConnections() {
        if (this.dataSources.some(ds => ds.canConnect && !ds.connected) && this.online) {
            this.online = false;
            console.log('App went temporary offline');
            this.setOnline(false);
        }

        if (this.dataSources.every(ds => !ds.canConnect || (ds.canConnect && ds.connected)) && !this.online) {
            this.online = true;
            console.log('App went back online');
            this.setOnline(true);
        }
    }
}