import { APIRequest, APIResponse, APIMiddware, Board, User } from '../models/types';
import { JsonWebTokenError } from 'jsonwebtoken';

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
    console.log("You need to define a jwtSecret environment variable to continue.");
    knex.destroy();
    process.exit();
}

const verifyToken = (req: APIRequest, res: APIResponse, next: APIMiddware) => {
    console.log('verifying token')
    const token = req.headers['authorization'];
    if (!token)
        return res.status(403).send({ error: 'No token provided.' });
    jwt.verify(token, jwtSecret, (err: JsonWebTokenError, decoded: { id: number }) => {
        if (err)
            return res.status(500).send({ error: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.userID = decoded.id;
        next();
    });
}

// Login
const login = (req: APIRequest, res: APIResponse) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).send();
    knex('users').where('email', req.body.email).first().then((user: User) => {
        if (user === undefined) {
            res.status(403).send("Invalid credentials");
            throw new Error('abort');
        }
        return [bcrypt.compare(req.body.password, user.hash), user];
    }).spread((result: {}, user: User) => {
        if (result) {
            let token = jwt.sign({ id: user.id }, jwtSecret, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).json({ user: { email: user.email, first_name: user.first_name, id: user.id, last_name: user.last_name }, token });
        }
        else
            res.status(403).send("Invalid credentials");
        return;
    }).catch((error: Error) => {
        if (error.message !== 'abort') {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};

// Get my account
const  me = (req: APIRequest, res: APIResponse) => {
    knex('users').where('id', req.userID).first().select('email', 'first_name', 'last_name', 'id').then((user: User) => {
        res.status(200).json({ user: user });
    }).catch((error: Error) => {
        res.status(500).json({ error });
    });
};

// Register
const register  = (req: APIRequest, res: APIResponse) => {
    if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name)
        return res.status(400).send();
    knex('users').where('email', req.body.email).first().then((user: User) => {
        if (user !== undefined) {
            res.status(403).send("Email address already exists");
            throw new Error('abort');
        }
        return bcrypt.hash(req.body.password, saltRounds);
    }).then((hash: string) => {
        return knex('users').insert({
            email: req.body.email, hash: hash, first_name: req.body.first_name,
            last_name: req.body.last_name
        });
    }).then((ids: number[]) => {
        return knex('users').where('id', ids[0]).first().select('email', 'first_name', 'last_name', 'id');
    }).then((user: User) => {
        let token = jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: 86400 // 24 hours
        });
        res.status(200).json({ user, token });
        return;
    }).catch((error: Error) => {
        if (error.message !== 'abort') {
            console.log(error);
            res.status(500).json({ error });
        }
    });
};

module.exports = {
    register,
    login,
    me,
    verifyToken
};
