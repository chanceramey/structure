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

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
    console.log("You need to define a jwtSecret environment variable to continue.");
    knex.destroy();
    process.exit();
}

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

const verifyToken = (req, res, next) => {
    console.log('verifying token')
    const token = req.headers['authorization'];
    if (!token)
        return res.status(403).send({ error: 'No token provided.' });
    jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err)
            return res.status(500).send({ error: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.userID = decoded.id;
        next();
    });
}

// Get all boards
app.get('/api/:user_id/boards', verifyToken, (req, res) => {
    const user_id = Number(req.params.user_id);
    if (user_id !== req.userID) {
        res.status(403).send();
        return;
    }
    console.log(`getting all boards for ${user_id}`);
    knex('boards').where({ user_id }).then(boards => {
        res.status(200).json({ boards })
    }).catch(error => {
        res.status(500).json({ error });
    })
});

// Get a specific board
app.get('/api/:user_id/boards/:board_id', verifyToken, (req, res) => {
    const user_id = Number(req.params.user_id);
    if (user_id !== req.userID) {
        res.status(403).send();
        return;
    }
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
app.post('/api/:user_id/boards', verifyToken, (req, res) => {
    const user_id = Number(req.params.user_id);
    if (user_id !== req.userID) {
        res.status(403).send();
        return;
    }
    if (!req.body.structure)
        return res.status(400).send();
    console.log(`User id is ${user_id}`);
    knex('users').where({ id: user_id }).then(user => {
        console.log(`User #${user} found.`)
        return knex('boards').insert({
            user_id,
            structure: JSON.stringify(req.body.structure)
        })
    }).then(ids => {
        console.log('Inserted successfully')
        return knex('boards').where('id', ids[0]).first();
    }).then(board => {
        res.status(200).json({ board });
    }).catch(error => {
        console.log(`There was an error ${error}`);
        res.status(500).json({ error });
    });
});

// Update a board
app.put('/api/:user_id/boards/:board_id', verifyToken, (req, res) => {
    const user_id = Number(req.params.user_id);
    if (user_id !== req.userID) {
        res.status(403).send();
        return;
    }
    if (!req.body.structure)
        return res.status(400).send('You must create a structure');
    const id = req.params.board_id;
    console.log(`Saving board ${id} for user ${user_id}`)
    const structure = JSON.stringify(req.body.structure);
    console.log(`updating board ${id} for user ${user_id}`);
    knex('boards').where({ user_id }).andWhere({ id }).then(boards => {
        const board = boards[0];
        console.log(boards);
        if (!board) {
            res.status(404).send('Sorry, we couldn\'t find that board in your list.')
            throw new Error('Bad request');
        } else if (board.structure === req.body.structure) {
            res.status(304).send('Already up to date!')
            return Promise.resolve(null);
        } else {
            console.log('updating board id: ', board.id, ' with stucture: ', structure)
            return knex('boards').where({ id: board.id }).update({ structure });
        }
        res.status(200).json({ board })
    }).then(response => {
        res.status(200).json({ response })
    }).catch(error => {
        console.log(error);
        res.status(500).json({ error });
    })
})

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
        if (result) {
            let token = jwt.sign({ id: user.id }, jwtSecret, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).json({ user: { email: user.email, first_name: user.first_name, id: user.id, last_name: user.last_name }, token });
        }
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

// Get my account
app.get('/api/me', verifyToken, (req, res) => {
    knex('users').where('id', req.userID).first().select('email', 'first_name', 'last_name', 'id').then(user => {
        res.status(200).json({ user: user });
    }).catch(error => {
        res.status(500).json({ error });
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
        let token = jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: 86400 // 24 hours
        });
        res.status(200).json({ user, token });
        return;
    }).catch(error => {
        if (error.message !== 'abort') {
            console.log(error);
            res.status(500).json({ error });
        }
    });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));