const {hasUpperCase, trimValue} = require('./functions.helper');

module.exports = {
    isValidSubmit(value) {
        return !!trimValue(value);
    },
    checkPasswordStrength(password) {
        let errors = [];

        if (password.length < 8) {
            errors.push("Password must at least be 8 characters long!") ;
        }

        if (!hasUpperCase(password)) {
            errors.push("Password must contain at least 1 capital character!") ;
        }

        if (password.match(/^[0-9a-zA-Z]+$/)) {
            errors.push("Password must contain at least 1 non-alphanumeric character!") ;
        }

        if (errors.length > 0) return {kind: 'NOK', errors: errors};
        return {kind: "OK"};
    },
}
