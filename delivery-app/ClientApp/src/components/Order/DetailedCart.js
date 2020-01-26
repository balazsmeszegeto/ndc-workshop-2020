import React, { Component } from 'react';
import { ReactComponent as Increase } from './increase.svg';
import { ReactComponent as Decrease } from './decrease.svg';

export class DetailedCart extends Component {
    removeFromCart = dishId => {
        if (this.props.cart === null || !this.props.cart.find(i => i.dishId === dishId))
            return;
        
        if (this.props.cart.length === 1) {
            this.props.changeCart([]);
            return;
        }

        const cart = this.props.cart.filter(i => i.dishId !== dishId);
        this.props.changeCart(cart);
    }

    changeQuantityOnCart = (dishId, newQuantity) => {
        if (newQuantity < 1 || this.props.cart === null || !this.props.cart.find(i => i.dishId === dishId))
            return;

        const cart = this.props.cart.slice();
        const item = cart.find(i => i.dishId === dishId);
        item.quantity = newQuantity;
        this.props.changeCart(cart);
    }

    render() {
        const rows = this.props.cart.map((item, index) => {
            return <tr key={index}>
                <td>{item.restaurantName}</td>
                <td>{item.dishName}</td>
                <td className="right-align">
                    <quantity-stepper
                        class={item.quantity > 1 ? '' : 'disabled'}
                        onClick={() => this.changeQuantityOnCart(item.dishId, item.quantity - 1)}>
                        <Decrease />
                    </quantity-stepper>
                    <span>{item.quantity}</span>
                    <quantity-stepper onClick={() => this.changeQuantityOnCart(item.dishId, item.quantity + 1)}>
                        <Increase />
                    </quantity-stepper>
                </td>
                <td className="right-align"><span className="currency">{item.dishPrice}</span></td>
                <td className="right-align"><span className="currency">{item.dishPrice * item.quantity}</span></td>
                <td className="right-align">
                    <button onClick={() => this.removeFromCart(item.dishId)}>Remove</button>
                </td>
            </tr>
        });
        return (
            <table id="cart">
                <thead>
                    <tr>
                        <th>restaurant</th>
                        <th>dish</th>
                        <th>quantity</th>
                        <th>unit price</th>
                        <th>item price</th>
                        <th>remove</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}