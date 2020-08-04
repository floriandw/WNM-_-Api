module.exports = app => {
    const user = require('../controller/users.controller')

    app.get('/api/users', user.getUsers);
    app.get('/api/users/:id', user.getUserById);
    app.patch('/api/users/:id', user.resetPassword);
    app.delete('/api/users/:id', user.deleteAccount);
};