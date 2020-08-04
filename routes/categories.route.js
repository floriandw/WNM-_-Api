module.exports = app => {
    const category = require('../controller/categories.controller');
    const jwt = require('../middleware/jwt.middleware');

    app.get('/api/categories', jwt.isAuthenticated, category.getCategories);
    app.get('/api/categories/:id', jwt.isAuthenticated, category.getCategoryById);
    app.put('/api/categories/:id', jwt.isAuthenticated, category.updateCategory);
    app.post('/api/categories/', jwt.isAuthenticated, category.addCategory);
}