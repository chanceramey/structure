var express = require('express');
var router = express.Router();

const Users = require("./controllers/users")
const Boards = require("./controllers/boards");

// Get all boards
router.get('/api/:user_id/boards', Users.verifyToken, Boards.getAllBoards);

// Get a specific board
router.get('/api/:user_id/boards/:board_id', Users.verifyToken, Boards.getBoard);

// Create a new board
router.post('/api/:user_id/boards', Users.verifyToken, Boards.createBoard);

router.delete('/api/:user_id/boards/:id', Users.verifyToken, Boards.deleteBoard);

// Update a board
router.put('/api/:user_id/boards/:board_id', Users.verifyToken, Boards.updateBoard);

// Login
router.post('/api/login', Users.login);

// Get my account
router.get('/api/me', Users.verifyToken, Users.me);

// Register
router.post('/api/users', Users.register);

module.exports = router;