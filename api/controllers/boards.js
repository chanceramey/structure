// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

// Get all boards
const getAllBoards = (req, res) => {
    const user_id = Number(req.params.user_id);
    if (user_id !== req.userID) {
        res.status(403).send();
        return;
    }
    console.log(`getting all boards for ${user_id}`);
    knex('boards').where({ user_id }).andWhere({ deleted: false }).then(boards => {
        res.status(200).json({ boards })
    }).catch(error => {
        res.status(500).json({ error });
    })
};

// Get a specific board
const getBoard = (req, res) => {
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
};

// Create a new board
const createBoard = (req, res) => {
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
};

const deleteBoard = (req, res) => {
    console.log('method found')
    const user_id = Number(req.params.user_id);
    if (user_id !== req.userID) {
        res.status(403).send();
        return;
    }
    const id = req.params.id;
    console.log(`deleting board ${id} for ${user_id}`);
    knex('boards').where({ user_id }).andWhere({ id }).then(boards => {
        const board = boards[0];
        if (!board) {
            throw new Error('Bad request - Sorry, we couldn\'t find that board in your list.');
        } else {
            knex('boards').where({ id }).update({ deleted: true }).then(board => {
                res.status(200).json({ board })
            })
        }
    }).catch(error => {
        res.status(500).json({ error });
    })
};

// Update a board
const updateBoard = (req, res) => {
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
            throw new Error('Bad request - Sorry, we couldn\'t find that board in your list.');
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
};

module.exports = {
    getAllBoards,
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard
}