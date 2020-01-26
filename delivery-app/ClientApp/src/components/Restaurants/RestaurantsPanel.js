import React from 'react';
import { ConnectedComponentBase } from '../ConnectedComponentBase';
import { Loader } from '../Loader/Loader';
import { Filter } from './Filter';
import { Table } from './Table';
import { updateById } from '../../features/replace-util';

export class RestaurantsPanel extends ConnectedComponentBase {
    /* override */ dataSource = this.props.dataSources
        .createRestaurantsDataSource(restaurants => this.onRestaurantsUpdated(restaurants))
        .withReconnectCallback(() => this.onConnected());

    state = {
        restaurants: [],
        tags: [],
        loadingRestaurants: false,
        loadingTags: false,
    };

    /* override */ onConnected() {
        this.loadRestaurants();
        this.loadTags();
    }

    onRestaurantsUpdated(newRestaurants) {
        const restaurants = updateById(this.state.restaurants, newRestaurants);
        this.setState({ restaurants });
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedTagIds !== prevProps.selectedTagIds) {
            this.loadRestaurants();
        }
    }

    async loadRestaurants() {
        await this.setStateAsync({ loadingRestaurants: true });
        const restaurants = await this.dataSource.getRestaurants(this.props.selectedTagIds);
        this.setState({ restaurants, loadingRestaurants: false });
    }

    async loadTags() {
        await this.setStateAsync({ loadingTags: true });
        const tags = await this.dataSource.getTags();
        this.setState({ tags, loadingTags: false });
    }

    render() {
        return (
            <div>
                <h2>Restaurants</h2>
                <Loader loading={this.state.loadingTags}>
                    <Filter
                        tags={this.state.tags}
                        selectedTagIds={this.props.selectedTagIds}
                        changeSelectedTagIds={this.props.changeSelectedTagIds}/>
                </Loader>

                <Loader loading={this.state.loadingRestaurants}>
                    <Table
                        restaurants={this.state.restaurants}
                        handleRestaurantSelect={this.props.handleRestaurantSelect}
                        selectedRestaurantId={this.props.selectedRestaurantId}/>
                </Loader>
            </div>
        );
    }
}

