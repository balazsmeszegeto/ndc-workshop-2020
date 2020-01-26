import React, { Component } from "react";
import './Dishes.css';

export class Dishes extends Component {
    state = {
        dishes: this.createDishesWithQuantity(this.props.dishes)
    };

    createDishesWithQuantity(dishes) {
        if (dishes === null)
            return [];
        return dishes.map(d => ({...d, quantity: 1 }));
    }

    onQuantityInputChange(index, event) {
        this.changeQuantity(index, parseInt(event.target.value));
    }

    changeQuantity(index, quantity) {
        const dishes = this.state.dishes.slice();
        dishes[index].quantity = quantity;
        this.setState({ dishes });
    }

    addToCart(index) {
        const dish = this.state.dishes[index];
        this.props.addToCart(dish);
        this.changeQuantity(index, 1);
    }

    render() {
        const rows = this.state.dishes.map((dish, index) => {
            return <tr key={index}>
                <td>
                    <div className="main">{dish.name}</div>
                    {dish.description}
                </td>
                <td className="right-align"><span className="currency">{dish.price}</span></td>
                <td className="right-align">
                    <input type="number" min="1" placeholder="quantity" value={dish.quantity} onChange={event => this.onQuantityInputChange(index, event)}/>
                    <button onClick={() => this.addToCart(index)}>Add to cart</button>
                </td>
            </tr>
        });
        return (
            <table id="dishes">
                <thead>
                    <tr><th>name</th><th>price</th><th>add to cart</th></tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}