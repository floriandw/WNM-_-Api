module.exports = app => {
    const todo = require('../controller/todos.controller');
    const jwt = require('../middleware/jwt.middleware');
    
    app.get('/api/todos', jwt.isAuthenticated, todo.getTodos);
    app.get('/api/todos/:id', jwt.isAuthenticated, todo.getTodoById);
    app.post('/api/todos', jwt.isAuthenticated, todo.addToDo);
    app.put('/api/todos/:id', jwt.isAuthenticated, todo.updateTodo);
    app.delete('/api/todos/:id', jwt.isAuthenticated, todo.deleteTodo);
}