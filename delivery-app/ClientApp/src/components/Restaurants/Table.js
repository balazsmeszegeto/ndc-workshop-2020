import React, { Component } from 'react';
import './Table.css';
import { formatFloat } from '../../features/formatting';

export class Table extends Component {

    render() {
        const rows = this.props.restaurants.map((r, index) => {
            return <tr key={index} onClick={() => this.props.handleRestaurantSelect(r.id)} className={r.id === this.props.selectedRestaurantId ? 'selected' : ''}>
                <td>
                    <div className="main">{r.name}</div>
                    <div className="tags">{this.renderTags(r.tags)}</div>
                </td>
                <td className="right-align">{r.distance}m</td>
                <td className="right-align">{this.renderRating(r)}</td>
                <td className="right-align">{r.pendingOrders}</td>
                <td className="right-align">{r.completedOrders}</td>
            </tr>;
          });

        return <table id="restaurants">
                <thead>
                    <tr><th>name / tags</th><th>distance</th><th>rating</th><th>pending</th><th>completed</th></tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>;
    }

    renderRating(restaurant: RestaurantListing) {
        if (restaurant.ratingCount === 0)
            return <span>No rating yet</span>;

        const rating = formatFloat(restaurant.ratingSum / restaurant.ratingCount);
        return <span>{rating} ({restaurant.ratingCount})</span>
    }

    renderTags(tags) {
        return (tags || []).map((tag, index) => {
            return <tag-bar key={index}>{tag}</tag-bar>;
        });
    }
}