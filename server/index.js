const { redisHost, redisPort, pgUser, pgHost, pgDatabase, pgPassword, pgPort } = require("./keys.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const redis = require("redis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const pgClient = new Pool({
    user: pgUser,
    host: pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort,
    // ssl: { rejectUnauthorized: false }
});

pgClient.on("connect", (client) => {
    client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((error) => console.error(error));
});

// Redis Client Setup
const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express Route Handlers
app.get('/', (req, res) => {
    return res.send("Hi");
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    return res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    console.log("entering redis");
    console.log(pgUser);
    redisClient.hgetall('values', (error, values) => {
        return res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send("Index too high!");
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    return res.send({
        working: true
    });
});

app.listen(5000, err => {
    console.log("Listening!");
});