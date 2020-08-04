module.exports = app => {
    const todo = require('../controller/todos.controller');

    app.get('/api/todos', todo.getTodos);
    app.get('/api/todos/:id', todo.getTodoById);
    app.post('/api/todos', todo.addToDo);
    app.put('/api/todos/:id', todo.updateTodo);
    app.delete('/api/todos/:id', todo.deleteTodo);
}