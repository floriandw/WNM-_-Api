const mysql = require('mysql');
const dbConfig = require('../config/db.config');

const connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
});

module.exports = connection;