import React, { Component } from 'react';
import { UserManager } from 'oidc-client';
import { oidcSettings } from '../../features/oidc-settings';

export class Header extends Component {
    userManager = new UserManager(oidcSettings);

    async handleLogin() {
        const request = await this.userManager.createSigninRequest({ prompt: 'login' });
        window.location = request.url;
    }

    handleLogout() {
        this.userManager.signoutRedirect();
    }

    render() {
        const userArea = this.props.user.loggedIn
            ? this.renderLoggedIn()
            : this.renderNotLoggedIn();
        return (
            <header id="header">
                <h1>Delivery app</h1>
                <user-menu>
                    {userArea}
                </user-menu>
            </header>
        );
    }

    renderNotLoggedIn() {
        return <span>
            Not logged in <button onClick={() => this.handleLogin()}>Log in</button>
        </span>;
    }

    renderLoggedIn() {
        const isDispatch = this.props.user.dispatch
            ? '(dispatch)'
            : null;
        return <span>Logged in as {this.props.user.name} {isDispatch} <button onClick={() => this.handleLogout()}>Log out</button></span>;
    }
}
