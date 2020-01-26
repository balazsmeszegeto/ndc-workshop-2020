import React from 'react';
import { ConnectedComponentBase } from '../ConnectedComponentBase';
import { Loader } from '../Loader/Loader';
import { formatDateTime } from '../../features/formatting';
import { saveToFile } from '../../features/save-to-file';

export class DispatchPanel extends ConnectedComponentBase {
    /* override */ dataSource = this.props.dataSources.createDispatchDataSource(
            orderId => this.onOrderCompleted(orderId),
            orders => this.onPendingOrdersCreated(orders)
        )
        .withReconnectCallback(() => this.onConnected());;

    state = { orders: [], loadingTable: false, loadingStream: false };

    /* override */ onConnected() {
        this.loadOrders();
    }

    async loadOrders() {
        await this.setStateAsync({ loadingTable: true });
        const orders = await this.dataSource.getPendingOrders(this.props.selectedRestaurantId);
        this.setState({ orders, loadingTable: false });
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedRestaurantId !== prevProps.selectedRestaurantId) {
            this.loadOrders();
        }
    }

    async completeOrder(orderId) {
        await this.setStateAsync({ loadingTable: true });
        await this.dataSource.completeOrder(orderId);
        this.setState({ loadingTable: false });
    }

    onOrderCompleted(orderId) {
        const orders = this.state.orders.filter(o => o.id !== orderId);
        this.setState({ orders });
    }

    onPendingOrdersCreated(newOrders) {
        const existingOrders = this.state.orders.slice();
        this.setState({ orders: [...existingOrders, ...newOrders] });
    }

    async streamOrders() {
        await this.setStateAsync({ loadingStream: true });
        const orders = await this.dataSource.streamOrders(this.props.selectedRestaurantId);
        this.setState({ loadingStream: false });

        saveToFile(orders, `orders-${new Date().getTime()}.json`);
    }

    render() {
        const pendingOrders = this.state.orders.length === 0
            ? <span>No pending orders</span>
            : this.renderPendingOrders();

        return (
            <div>
                <header>
                    <h2>Dispatch pending orders</h2>
                </header>
                <Loader loading={this.state.loadingTable}>
                    {pendingOrders}
                </Loader>

                <h2>All orders</h2>
                <Loader loading={this.state.loadingStream}>
                    <div className="space-above">
                        <button onClick={() => this.streamOrders()}>Export all orders</button>
                    </div>
                </Loader>
            </div>
        );
    }

    renderPendingOrders() {
        const rows = this.state.orders.map((o, index) => {
            return <tr key={index}>
                <td>{o.username}</td>
                <td className="center-align">{formatDateTime(o.orderedAt)}</td>
                <td>{o.restaurantName}</td>
                <td><button onClick={() => this.completeOrder(o.id)}>Complete</button></td>
            </tr>
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th>username</th>
                        <th>ordered at</th>
                        <th>restaurant</th>
                        <th>complete</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}