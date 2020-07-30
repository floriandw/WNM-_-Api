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

app.get('/', (req, res) => res.status(200).send({ pmessage: 'Hello World!'}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));