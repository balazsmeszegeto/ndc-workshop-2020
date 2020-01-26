import React, { Component } from 'react';
import _ from 'lodash';
import { Header } from './components/Header/Header';
import { Body } from './components/Body/Body';
import { Footer } from './components/Footer/Footer';
import { Reconnect } from './components/Reconnect/Reconnect';
import { persist, keyForSelectedTagIds, keyForSelectedRestaurantId, keyForCart } from './features/persisting';
import { DataSources } from './features/data/data-sources';
import './App.css'

export default class App extends Component {
    dataSources = new DataSources(this.props.user, online => this.setState({ online }));

    state = {
        selectedTagIds: this.props.initialState.selectedTagIds || [],
        selectedRestaurantId: this.props.initialState.selectedRestaurantId,
        cart: this.props.initialState.cart,
        online: true,
    };

    toggleRestaurantSelect = restaurantId => {
        const selectedRestaurantId = (this.state.selectedRestaurantId === restaurantId)
            ? null
            : restaurantId;

        persist(keyForSelectedRestaurantId, selectedRestaurantId);
        this.setState({ selectedRestaurantId });
    }

    changeSelectedTagIds = selectedTagIds => {
        persist(keyForSelectedTagIds, selectedTagIds);
        this.setState({ selectedTagIds });
    }

    addToCart = item => {
        const cart = _.isEmpty(this.state.cart)
            ? []
            : this.state.cart.slice();
        
        const existingItem = cart.find(i => i.dishId === item.dishId);
        if (existingItem)
            existingItem.quantity += item.quantity;
        else
            cart.push(item);

        this.changeCart(cart);
    }

    changeCart = cart => {
        persist(keyForCart, cart);
        this.setState({ cart });
    }

    render() {
        return (
            <app-layout>
                <Header user={this.props.user} />
                <Body
                    selectedTagIds={this.state.selectedTagIds}
                    changeSelectedTagIds={this.changeSelectedTagIds}
                    selectedRestaurantId={this.state.selectedRestaurantId}
                    handleRestaurantSelect={this.toggleRestaurantSelect}
                    dataSources={this.dataSources}
                    user={this.props.user}
                    addToCart={this.addToCart}/>

                <Footer
                    cart={this.state.cart}
                    changeCart={this.changeCart}
                    user={this.props.user}
                    dataSources={this.dataSources}/>

                <Reconnect online={this.state.online} />

            </app-layout>
        );
    }
}
