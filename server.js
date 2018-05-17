// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/api/login', (req, res) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).send();
    knex('users').where('email', req.body.email).first().then(user => {
        if (user === undefined) {
            res.status(403).send("Invalid credentials");
            throw new Error('abort');
        }
        return [bcrypt.compare(req.body.password, user.hash), user];
    }).spread((result, user) => {
        if (result)
            res.status(200).json({ user: { email: user.email, first_name: user.first_name, id: user.id, last_name: user.last_name } });
        else
            res.status(403).send("Invalid credentials");
        return;
    }).catch(error => {
        if (error.message !== 'abort') {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});

app.post('/api/users', (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name)
        return res.status(400).send();
    knex('users').where('email', req.body.email).first().then(user => {
        if (user !== undefined) {
            res.status(403).send("Email address already exists");
            throw new Error('abort');
        }
        return bcrypt.hash(req.body.password, saltRounds);
    }).then(hash => {
        return knex('users').insert({
            email: req.body.email, hash: hash, first_name: req.body.first_name,
            last_name: req.body.last_name
        });
    }).then(ids => {
        return knex('users').where('id', ids[0]).first().select('email', 'first_name', 'last_name', 'id');
    }).then(user => {
        res.status(200).json({ user: user });
        return;
    }).catch(error => {
        if (error.message !== 'abort') {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));