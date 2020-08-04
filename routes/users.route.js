module.exports = app => {
    const user = require('../controller/users.controller');
    const jwt = require('../middleware/jwt.middleware');

    app.get('/api/users', jwt.isAuthenticated, user.getUsers);
    app.get('/api/users/:id', jwt.isAuthenticated, user.getUserById);
    app.patch('/api/users/:id', jwt.isAuthenticated, user.resetPassword);
    app.delete('/api/users/:id', jwt.isAuthenticated, user.deleteAccount);
};