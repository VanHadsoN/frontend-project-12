const apiPath = '/api/v1';

const routes = {
    chatPagePath: () => '/',
    loginPagePath: () => '/login',
    errorPagePath: () => '*',
    signupPagePath: () => '/signup',
    loginPath: () => [apiPath, 'login'].join('/'),
    getUserPath: () => [apiPath, 'data'].join('/'),
    signupPath: () => [apiPath, 'signup'].join('/'),
};

export default routes;