export class User {
    constructor(token) {
        if (token == null || token.expired) {
            this.loggedIn = false;
            return;
        }

        this.loggedIn = true;
        this.username = token.profile.sub;
        this.name = token.profile.name;
        this.dispatch = token.profile.dispatch;
        this.accessToken = token.access_token;
    }
}