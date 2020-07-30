const sql = require('../db/db');
const bcrypt = require('bcrypt');
const { createUUID } = require('../helpers/functions.helper');
const { checkPasswordStrength } = require('../helpers/validation.helper');

const User = function(user) {
    this.username = user.username;
    this.password = user.password;
}

User.getUserByUsername = (username, callback) => {
    sql.query("SELECT * FROM users WHERE username = ?", username, (err, res) => {
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
    })
}

User.login = (username, plainTextPassword, hashedPassword, callback) => {
    bcrypt.compare(plainTextPassword, hashedPassword, (err, match) => {
        if (match) 
            callback(null, {
                username: username
                // jwt + expiresIn
            });
        else callback({kind: "invalid_login"}, null);
    });
}

User.register = (newUser, callback) => {
    const passwordStrength = checkPasswordStrength(newUser.password);

    if(passwordStrength.kind === "NOK") {
        callback({kind: 'password', errors: passwordStrength.errors});
        return;
    }

    const id = createUUID();
    // jwt + expiresIn

    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        sql.query(
            "INSERT INTO users VALUES (?, ?, ?)",
            [id, newUser.username, newUser.password],
            (err, res) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                }

                callback(null, {
                    username: newUser.username
                    // jwt + expiresIn
                });
            }            
        );
    });
};

module.exports = User;