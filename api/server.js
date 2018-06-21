// Express Setup
const express = require('express');
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// jwt setup
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
    console.log("You need to define a jwtSecret environment variable to continue.");
    knex.destroy();
    process.exit();
}

// Get all boards
app.use(router);

app.listen(3000, () => console.log('Server listening on port 3000!'));