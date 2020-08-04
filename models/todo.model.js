const sql = require('../db/db');

const Todo = function(todo) {
    this.todo = todo.todo;
    this.deadline = todo.deadline;
    this.categoryId = todo.categoryId;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
}

Todo.getTodos = callback => {
    sql.query("SELECT * FROM categories INNER JOIN todos ON todos.categoryId = categories.id", (err, res) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }

        callback(null, res);
    });
}

Todo.getTodoById = (id, callback) => {
    sql.query("SELECT * FROM todos WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log(err);
            callback(null, err);
            return;
        }
        
        if (res.length) {
            callback(null, res[0]);
            return;
        }

        callback({kind: 'not_found'}, null);
    });
}

Todo.addToDo = (newTodo, callback) => {
    sql.query(
        "INSERT INTO todos VALUES (?, ?, ?, ?, ?,?)",
        [null, newTodo.todo, newTodo.createdAt, newTodo.updatedAt, newTodo.deadline, newTodo.categoryId],
        (err, res) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }
            
            callback(null, {
                id: res.insertId,
                todo: newTodo.todo,
                createdAt: newTodo.createdAt, 
                updatedAt: newTodo.updatedAt,
                deadline: newTodo.deadline,
                categoryId: newTodo.categoryId
            });
        }            
    );
};

Todo.updateTodo = (id, todo, callback) => {
    sql.query(
        "UPDATE todos SET todo = ?, updatedAt = ?, deadline = ?, categoryId = ? WHERE id = ?",
        [todo.todo, todo.updatedAt, todo.deadline, todo.categoryId, id],
        (err, res) => {
            if (err) {
                console.log(err);
                callback(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                callback({kind: "not_found"}, null);
                return;
            }

            callback(null, {id: id, ...todo});
        }
    );
}

Todo.deleteTodo = (id, callback) => {
    sql.query("DELETE FROM todos WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log(err);
            callback(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            callback({kind: "not_found"}, null);
            return;
        }

        callback(null, res);
    });
}

module.exports = Todo;