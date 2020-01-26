import React, { Component } from 'react';
import { formatDateTime } from '../../features/formatting';

export class OrderHistory extends Component {
    state = {
        orders: this.createOrdersWithRatingInput(this.props.orders)
    };

    createOrdersWithRatingInput(orders) {
        if (orders === null)
            return [];
        return orders.map(o => ({...o, ratingInput: 5 }));
    }

    onRatingInputChange(index, event) {
        const orders = this.state.orders.slice();
        orders[index].ratingInput = parseInt(event.target.value);
        this.setState({ orders });
    }


    render() {
        if (this.state.orders.length === 0)
            return <span>No order history</span>

        return this.renderTable();
    }

    renderTable() {
        const rows = this.state.orders.map((o, index) => {
            return <tr key={index}>
                <td className="center-align">{formatDateTime(o.orderedAt)}</td>
                <td>{o.restaurantName}</td>
                <td className="center-align">
                    {formatDateTime(o.completedAt)}
                    {!o.completedAt && 'Not completed'}
                </td>
                <td className="right-align">
                    {o.rating}
                    {!o.rating && o.completedAt &&
                        <span>
                            <input type="number" min="0" max="5" value={o.ratingInput} onChange={event => this.onRatingInputChange(index, event)}/>
                            <button onClick={() => this.props.rateOrder(o.id, o.ratingInput)}>Rate</button>
                        </span>
                    }
                </td>
            </tr>
        });

        return (
            <table id="history">
                <thead>
                    <tr>
                        <th>ordered at</th>
                        <th>restaurant</th>
                        <th>completed at</th>
                        <th>rating</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}