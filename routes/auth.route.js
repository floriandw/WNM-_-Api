module.exports = app => {
    const user = require('../controller/auth.controller');

    app.post('/api/auth/login', user.login);
    app.post('/api/auth/register', user.register);
}