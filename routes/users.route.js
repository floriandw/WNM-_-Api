module.exports = app => {
    const user = require('../controller/users.controller')

    app.get('/api/users/:id', (req, res) => { res.send('get'); });
    app.patch('/api/users/:id', (req, res) => { res.send('patch'); });
    app.delete('/api/users/:id', (req, res) => { res.send('delete'); });
};