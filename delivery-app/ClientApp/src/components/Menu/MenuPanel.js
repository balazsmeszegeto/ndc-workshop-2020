import React from 'react';
import { ConnectedComponentBase } from '../ConnectedComponentBase';
import { Loader } from '../Loader/Loader';
import { Dishes } from './Dishes';

export class MenuPanel extends ConnectedComponentBase {
    /* override */ dataSource = this.props.dataSources
        .createDetailsDataSource();

    state = { restaurant: null, loading: false };

    /* override */ onConnected(): void {
        this.loadRestaurant();
    }

    async loadRestaurant(): Promise<void> {
        await this.setStateAsync({ loading: true });
        const restaurant = this.props.selectedRestaurantId === null
            ? null
            : await this.dataSource.getRestaurant(this.props.selectedRestaurantId);

        this.setState({ restaurant, loading: false });
    }

    componentDidUpdate(prevProps): void {
        if (this.props.selectedRestaurantId !== prevProps.selectedRestaurantId) {
            this.loadRestaurant();
        }
    }

    render() {
        const content = this.state.restaurant === null
            ? <div>Select a restaurant and start ordering!</div>
            : this.renderRestaurant(this.state.restaurant);
        return (
            <Loader loading={this.state.loading}>
                {content}
            </Loader>
        );
    }

    addToCart(dish) {
        this.props.addToCart({
            dishId: dish.id,
            dishName: dish.name,
            dishPrice: dish.price,
            restaurantId: this.state.restaurant.id,
            restaurantName: this.state.restaurant.name,
            quantity: dish.quantity
        });
    }

    renderRestaurant(r) {
        return (
            <div>
                <header><h2>Dishes of {r.name}</h2></header>
                <Dishes
                    dishes={r.dishes}
                    addToCart={dish => this.addToCart(dish)}
                    key={r.id}/>
            </div>
        );
    }
}