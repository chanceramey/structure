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

// Get all boards
app.get('/api/:user_id/boards', (req, res) => {
    const user_id = req.params.user_id;
    console.log(`getting all boards for ${user_id}`);
    knex('boards').where({ user_id }).then(boards => {
        res.status(200).json({ boards })
    }).catch(error => {
        res.status(500).json({ error });
    })
});

// Get a specific board
app.get('/api/:user_id/boards/:board_id', (req, res) => {
    const user_id = req.params.user_id;
    const id = req.params.board_id;
    console.log(`getting board ${id} for ${user_id}`);
    knex('boards').where({ user_id }).andWhere({ id }).then(boards => {
        const board = boards[0];
        res.status(200).json({ board })
    }).catch(error => {
        res.status(500).json({ error });
    })
});

// Create a new board
app.post('/api/:user_id/boards', (req, res) => {
    if (!req.body.title)
        return res.status(400).send();
    let user_id = parseInt(req.params.id);
    knex('users').where({ id: user_id }).first().then(user => {
        return knex('boards').insert({
            user_id,
            title: req.body.title,
            description: req.body.description,
            tree: req.body.tree
        })
    }).then(ids => {
        return knex('boards').where('id', ids[0]).first();
    }).then(board => {
        res.status(200).json({ board });
    }).catch(error => {
        res.status(500).json({ error });
    });
});

// Update a board

// Login
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


// Register
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