import React from 'react';
import ReactDOM from 'react-dom';
import './features/component-extension';
import App from './App';
import { UserManager } from 'oidc-client';
import { oidcSettings } from './features/oidc-settings';
import { User } from './features/user';
import { restore, keyForSelectedTagIds, keyForSelectedRestaurantId, keyForCart } from './features/persisting';

async function start() {
    const userManager = new UserManager(oidcSettings);
    if (window.location.search.includes('code=')) {
        await userManager.signinRedirectCallback(window.location.href);
        const replaceUrl = new URL('/', window.location.href).href;
        window.location.replace(replaceUrl);
    }

    const token = await userManager.getUser();
    const user = new User(token);
    const initialState = {
        selectedTagIds: restore(keyForSelectedTagIds),
        selectedRestaurantId: restore(keyForSelectedRestaurantId),
        cart: restore(keyForCart),
    };
    render(user, initialState);
}

function render(user, initialState) {
    const rootElement = document.getElementById('root');
    ReactDOM.render(<App user={user} initialState={initialState}/>, rootElement);
}

start();