import React from 'react';
import _ from 'lodash';
import './OrderPanel.css';
import { Summary } from './Summary';
import { DetailedCart } from './DetailedCart';
import { ConnectedComponentBase } from '../ConnectedComponentBase';
import { Loader } from '../Loader/Loader';
import { OrderHistory } from './OrderHistory';
import { updateById } from '../../features/replace-util';

export class OrderPanel extends ConnectedComponentBase {
    /* override */ dataSource = this.props.dataSources.createUserDataSource(
            orders => this.onOrdersUpdated(orders),
            orders => this.onOrdersCreated(orders),
        )
        .withReconnectCallback(() => this.onConnected());

    state = { compact: true, orders: [], orderKey: null, loading: false };

    /* override */ onConnected() {
        this.loadOrders();
    }

    onOrdersUpdated(newOrders) {
        const orders = updateById(this.state.orders, newOrders);
        this.setState({ orders, orderKey: new Date().getTime() });
    }

    onOrdersCreated(newOrders) {
        const orders = [...newOrders, ...this.state.orders];
        this.setState({ orders, orderKey: new Date().getTime() });
    }

    async loadOrders() {
        await this.setStateAsync({ loading: true });
        const orders = await this.dataSource.getOrders();
        this.setState({ orders, orderKey: new Date().getTime(), loading: false });
    }

    submit = async () => {
        const restaurantIds = _.uniq(this.props.cart.map(i => i.restaurantId));
        await this.setStateAsync({ loading: true });
        await this.dataSource.createOrders(restaurantIds);
        this.props.changeCart([]);
        this.setState({ loading: false });
    }

    async rateOrder(orderId, score) {
        await this.setStateAsync({ loading: true });
        await this.dataSource.rateOrder(orderId, score);
        this.setState({ loading: false });
    }

    render() {
        const content = _.isEmpty(this.props.cart)
            ? this.renderOrders()
            : this.renderCart();

        return (
            <div>
                <h2>Orders</h2>
                <h4>
                    Cart {_.isEmpty(this.props.cart) && <small>is empty</small>}
                </h4>
                <Loader loading={this.state.loading}>
                    {content}
                </Loader>
            </div>
        );
    }

    renderCart() {
        const submitOrder = this.props.user.loggedIn
            ? <div className="space-above"><button onClick={this.submit}>Submit order</button></div>
            : <div className="space-above"><span>Log in to submit order</span></div>;
        const detailedCart = this.state.compact
            ? null
            : <DetailedCart cart={this.props.cart} changeCart={this.props.changeCart}/>;

        return <div>
            <div>
                <Summary cart={this.props.cart}/>
                <span onClick={() => this.setState({ compact: !this.state.compact })} className="text-action">
                    {this.state.compact ? 'Show' : 'Hide'} details
                </span>
            </div>
            {detailedCart}
            {submitOrder}
        </div>
    }

    renderOrders() {
        if (!this.props.user.loggedIn)
            return null;

        return <div>
                <h4>Order history</h4>
                <OrderHistory rateOrder={(orderId, rating) => this.rateOrder(orderId, rating)} orders={this.state.orders} key={this.state.orderKey}/>
            </div>;
    }
}