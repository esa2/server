'use strict'

const express = require('express')
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.get('/', (req, res) => res.send('testing 1,2,3'));

// Query database for user based on username
app.get('/api/v1/users/:username', (req, res) => {
  client.query(
    `select * from users where username='${req.params.username}'`
  )
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
