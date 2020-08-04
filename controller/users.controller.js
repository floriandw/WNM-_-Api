const User = require('../models/user.model');
const Todo = require('../models/todo.model');

exports.getUsers = (req, res) => {
    User.getUsers((err, users) => {
        if (err) {
            res.status(500)
                .send({ message: 'Something went terribly wrong...' });
        }
        else res.send(users);
    });
}

exports.getUserById = (req, res) => {
    const id = req.params.id;

    User.getUserById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(400)
                    .send({message: "User not found"});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else {
            Todo.getTodosByUserId(id, (err, todos) => {
                if (err) res.status(500).send({message: "Something went terribly wrong..."});
                else res.send({
                        id: data.id,
                        username: data.username,
                        todos: todos
                    });
            });
        }
    });
}

exports.getUserByName = (req, res) => {   
    const username = req.params.username;

    User.getUserByName(username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(400)
                    .send({message: "User not foundd"});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.send({
            id: data.id,
            username: data.username
        });
       
    })
}

exports.resetPassword = (req, res) => {
    const id = req.params.id;

    const user = new User({
        username: null,
        password: req.body.password
    })


    User.resetPassword(id, user,(err, data) => {
        if (err){
            if (err.kind === "not_found") {
                res.status(400)
                    .send({message: "User not found"});
            }
            else if (err.kind === "password") {
                res.status(400)
                    .send({message: err.errors});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.send(data);
    })
}

exports.deleteAccount = (req, res) => {
    const id = req.params.id;

    User.deleteAccount(id, (err, data)=> {
        if (err){
            if (err.kind === "not_found") {
                res.status(400)
                    .send({message: "User not found"});
            }
            else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        else res.status(200).send();
    });
}