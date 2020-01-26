import { Component } from 'react';

Component.prototype.setStateAsync = function(state) {
    return new Promise(resolve => {
        this.setState(state, resolve);
    });
}