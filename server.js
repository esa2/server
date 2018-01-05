'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express();
const superAgent = require('superagent');
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);
const API_KEY = process.env.YOUTUBE_API_KEY;

client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('testing 1,2,3'));

// Query database for user based on username
app.get('/api/v1/users/:username', (req, res) => {
  client
    .query(`select * from users where username='${req.params.username}'`)
    .then(data => {
      console.log('username:', req.params.username);
      console.log('data:', data.rows);
      res.send(data.rows);
    })
    .catch(console.error);
});

app.get('/api/v3/videos/search', (req, res) => {
  console.log('req body start here ' + req.query)
  console.log(req.query);
  superAgent.get(`https://www.googleapis.com/youtube/v3/search?q=${req.query.search}&maxResults=1&part=snippet&key=${API_KEY}`)
    .then(results => {
      res.send(JSON.parse(results.text))
    })
    .catch(console.error)
});

app.get('/api/dailymotion/videos/search', (req, res) => {
  console.log('in dm server get')
  console.log('req dm body start here ' + req.query)
  console.log(req.query);
  superAgent.get(`https://api.dailymotion.com/videos?search=${req.query.search}&limit=1&language=en`)
    .then(results => {
      res.send(JSON.parse(results.text))
    })
    .catch(console.error)
});

// Create a new user in the database
app.post('/api/v1/users', (req, res) => {
  let { realname, username, password } = req.body;
  client
    .query(`insert into users(realname, username, password)
      values($1, $2, $3)`,
      [realname, username, password])
    .then(() => res.sendStatus(201))
    .catch(console.error);
});

// Query database for 'search' terms. This is not a search.
app.get('/api/v1/users/:username/search', (req, res) => {
  client
    .query(`select * from users where username=$1;`,
      [req.params.username])
    .then((data) => data.rows[0].user_id)
    .then((user_id) => {
      return client
        .query(`select * from search where user_id=$1`,
          [user_id])
        .then(data => res.send(data.rows))
        .catch(console.error);
    })
    .catch(console.error);
});

// Create a new interest in the search table
app.post('/api/v1/users/:username/:interest/search', (req, res) => {
  client
    .query(`select * from users where username=$1;`,
      [req.params.username])
    .then((data) => data.rows[0].user_id)
    .then((user_id) => {
      client
        .query(`INSERT INTO search(search_string, user_id) VALUES($1, $2)`,
          [req.params.interest, user_id])
        .then(() => res.send('Add interest complete'))
        .catch(console.error);
    })
    .catch(console.error);
})

// Delete an interest from the search table
app.delete('/api/v1/users/:username/:interest/search', (req, res) => {
  client
    .query(`select * from users where username=$1;`,
      [req.params.username])
    .then((data) => data.rows[0].user_id)
    .then((user_id) => {
      client
        .query(`DELETE FROM search WHERE user_id=$1 AND search_string=$2`,
          [user_id, req.params.interest])
        .then(() => res.send('Delete complete'))
        .catch(console.error);
    })
    .catch(console.error);
})

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
