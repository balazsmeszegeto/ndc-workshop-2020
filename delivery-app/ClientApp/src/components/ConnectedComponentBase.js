import { Component } from 'react';

export /* abstract */ class ConnectedComponentBase extends Component {
    /* abstract */ dataSource;

    async componentDidMount() {
        try {
            await this.dataSource.connect();
            this.onConnected();
        } catch(error) {
            console.error('Could not connect', error);
        }
    }

    /* virtual */ onConnected() {}

    componentWillUnmount() {
        if (!this.dataSource)
            return;

        this.dataSource.stop();
    }
}