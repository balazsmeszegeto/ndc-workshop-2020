import React, { Component } from 'react';
import './Loader.css';

export class Loader extends Component {
    render() {
        return this.props.loading
        ? (
        <div className="loader-block">
            <div className="overlay">
                <div className="loader"/>
            </div>
            <div>{this.props.children}</div>
        </div>
        )
        : this.props.children;
    }
}