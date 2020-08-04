module.exports = app => {
    const category = require('../controller/categories.controller');

    app.get('/api/categories', category.getCategories);
    app.get('/api/categories/:id', category.getCategoryById);
    app.put('/api/categories/:id', category.updateCategory);
    app.post('/api/categories/', category.addCategory);
    app.delete('/api/categories/:id', category.deleteCategory);
}