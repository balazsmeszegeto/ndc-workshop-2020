import React from 'react';
import _ from 'lodash';

export function Summary(props) {
    const restaurantNames = _.uniq(props.cart.map(i => i.restaurantName));
    const dishCount = props.cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalPrice = props.cart.reduce((acc, curr) => acc + curr.quantity * curr.dishPrice, 0);

    if (restaurantNames.length === 1) {
        return <span>
            Order of <strong>{dishCount}</strong> dishes from <em>{restaurantNames[0]}</em>.
            <strong>Total: <span className="currency">{totalPrice}</span></strong>
        </span>;
    }

    return <span>
        Order of <strong>{dishCount}</strong> dishes from <em>{restaurantNames.join(', ')}</em>.
        Order will be dispatched to {restaurantNames.length} restaurants.
        <strong>Total: <span className="currency">{totalPrice}</span></strong>
    </span>;
}