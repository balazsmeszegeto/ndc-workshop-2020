export const oidcSettings = {
    authority: 'http://localhost:8192',
    redirect_uri: 'http://localhost:8686/',
    post_logout_redirect_uri: 'http://localhost:8686/',
    client_id: 'delivery.spa',
    response_type: 'code',
    scope: 'openid delivery-app-id delivery-app-api',
    filterProtocolClaims: false,
    loadUserInfo: false,
    monitorSession: false,
};