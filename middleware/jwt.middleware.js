  
const jwt = require('jsonwebtoken');
const config = require('../config/jwt.config');

exports.generateJWToken = () => {
    const expiresIn = 24 * 60 * 60 * 1000; // 1 day in ms
    const tomorrow = new Date(Date.now() + expiresIn);

    return jwt.sign(
        {"tomorrow": tomorrow},
        config.secret,
        {algorithm: 'HS256'}
    );
};

exports.isAuthenticated = (req, res, next) => {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization;

        jwt.verify(token, config.secret, {algorithm: 'HS256'}, (err, data) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized!' });
            }

            const expiresIn =  data.tomorrow;
            const expirationTime = new Date(expiresIn).getTime() - new Date().getTime();

            if (expirationTime <= 0) {
                return res.status(401).send({ message: 'Unauthorized!' });
            }

            return next();
        });
    }
    else res.status(401).send({error: 'Unauthorized!'});
}