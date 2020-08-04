const Todo = require('../models/todo.model');
const { isValidSubmit } = require('../helpers/validation.helper');

exports.getTodos = (req, res) => {
    Todo.getTodos((err, data) => {
        if (err) {
            res.status(500)
                .send({ message: 'Something went terribly wrong...' });
        }
        else res.send(data);
    });
}

exports.getTodoById = (req, res) => {
    const id = req.params.id;

    Todo.getTodoById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(400)
                    .send({message: "Todo not found"});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.send({
            id: data.id,
            todo: data.todo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deadline: data.deadline,
            categoryId: data.categoryId
        });
       
    })
}

exports.addToDo = (req, res) => {
    const { todo, deadline, categoryId, userIds } = req.body;

    // Checks to see if the form is filed in
    if (
        !isValidSubmit(todo) ||
        !isValidSubmit(deadline)
    ) {
        res.status(406).send({message: "Please enter them details!"});
        return;
    }

    const newTodo = new Todo({
        todo: todo,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        deadline: new Date(deadline).toLocaleString(),
        categoryId: categoryId,
        users: userIds
    });

    Todo.addToDo(newTodo, (err, data) => {
        if (err) return res.status(500).send({message: "Something went terribly wrong..."});
        else return res.status(201).send(data);
    });
}

exports.updateTodo = (req, res) => {
    const id = req.params.id;

    if (
        !isValidSubmit(req.body.todo) ||
        !isValidSubmit(req.body.deadline)
    ) {
        res.status(406).send({message: "Please enter them details!"});
        return;
    }

    const todo = new Todo({
        todo: req.body.todo,
        updatedAt: new Date().toLocaleString(),
        deadline: new Date(req.body.deadline).toLocaleString(),
        categoryId: req.body.categoryId,
        users: req.body.userIds
    })

    Todo.updateTodo(id, todo, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404)
                    .send({message: "todo not found"});

            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.status(200).send(data);
    });
}

exports.deleteTodo = (req, res) => {
    const id = req.params.id;

    Todo.deleteTodo(id, (err, data)=> {
        if (err){
            if (err.kind === "not_found") {
                res.status(400)
                    .send({message: "todo not found"});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.status(200).send();
    });
}
