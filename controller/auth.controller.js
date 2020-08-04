const User = require('../models/user.model');
const { isValidSubmit } = require('../helpers/validation.helper');
const jwt = require('../middleware/jwt.middleware');

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Check to see if there is a user with the given username
    User.getUserByUsername(username, (err, data) => {
        // No User was found with the given username, or a server error happened
        if (err) {
            if (err.kind === "not_found") {
                res.status(404)
                    .send({message: "Invalid Login Credentials"});
            } else {
                res.status(500)
                    .send({message: "Something went terribly wrong..."});
            }
        }
        // A user withthe given username was found
        else {
            const user = data;
            User.login(username, password, user.password, (err, data) => {
                // Passwords don't match or a server error happened
                if (err) {
                    if (err.kind === "invalid_login") {
                        res.status(400)
                            .send({message: "Invalid Login Credentials"});
                    } else {
                        res.status(500)
                            .send({message: "Something went terribly wrong..."});
                    }
                }
                else {
                    // finally logged in
                    res.send({
                        id: user.id,
                        username: data.username,
                        token: jwt.generateJWToken(),
                        expiresIn: 24 * 60 * 60 * 1000
                    });
                }
            })
        }
    })
}

exports.register = (req, res) => {
    const {username, password, passwordVerify} = req.body;

    // Checks to see if the form is filed in
    if (
        !isValidSubmit(username) ||
        !isValidSubmit(password) ||
        !isValidSubmit(passwordVerify)
    ) {
        res.status(406).send({message: "Please enter your details!"});
        return;
    }

    // Check Password Confirm
    if (password !== passwordVerify) {
        res.status(406)
            .send({message: "Passwords do not match!"});
        return;
    }

    // Check to see if the given username already exists
    User.getUserByUsername(username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                const newUser = new User({
                    username: username,
                    password: password
                });
                
                // Register the user
                User.register(newUser, (err, data) => {
                    if (err) {
                        // Password is not strong enough
                        if (err.kind === 'password') {
                            res.status(406)
                                .send({message: err.errors});
                        }
                        // internal server error
                        else res.status(500).send({message: "Something went terribly wrong..."});
                    }
                    // Register was successful
                    else res.send(data);
                });

            }
            // Something went wrong in the server
            else res.status(500).send({message: "Something went terribly wrong..."});
        } 
        // The username already exists
        else res.status(406).send({message: "This username is already taken!"});
    });
}