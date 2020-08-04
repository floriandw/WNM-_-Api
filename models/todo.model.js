const sql = require('../db/db');

const Todo = function(todo) {
    this.todo = todo.todo;
    this.deadline = todo.deadline;
    this.categoryId = todo.categoryId;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
    this.users = todo.users;
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

Todo.getTodosByUserId = (userId, callback) => {
    sql.query(
        "SELECT * FROM todos INNER JOIN users_has_todos ON users_has_todos.todoId = todos.id WHERE users_has_todos.userId = ?", userId, 
        (err, res) => {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            callback(null, {
                todos: res
            });
        }
    );
};

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

            const todoId = res.insertId;
            const userIds = newTodo.users;

            userIds.forEach(userId => {
                sql.query(
                    "INSERT INTO users_has_todos VALUES (?, ?)",
                    [userId, todoId],
                    (err, res) => {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                            return;
                        }
                    }
                )
            });

            callback(null, {
                id: todoId,
                todo: newTodo.todo,
                createdAt: newTodo.createdAt, 
                updatedAt: newTodo.updatedAt,
                deadline: newTodo.deadline,
                categoryId: newTodo.categoryId,
                users: userIds
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

            const userIds = todo.users;

            userIds.forEach(userId => {
                sql.query(
                    "INSERT INTO users_has_todos VALUES (?, ?)",
                    [userId, id],
                    (err, res) => {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                            return;
                        }
                    }
                )
            });

            callback(null, {id: id, ...todo});
        }
    );
}

Todo.deleteTodo = (id, callback) => {
    sql.query(
        "DELETE FROM users_has_todos WHERE todoId = ?",
        id,
        (err, res) => {

            if (err) {
                console.log(err);
                callback(null, err);
                return;
            }

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
            }
        );
    })
}

module.exports = Todo;