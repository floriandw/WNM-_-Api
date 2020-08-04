const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: true
    })
);

app.options('*', cors());

//TODO: Define Routes
require('./routes/auth.route')(app);
require('./routes/users.route')(app);
require('./routes/categories.route')(app);
require('./routes/todos.route')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));