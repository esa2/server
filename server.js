'use strict'

const express = require('express')
const cors = require('cors');
const pg = require('pg');

const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const client = new pg.Client(process.env.DATABASE_URL);
const API_KEY = process.env.YOUTUBE_API_KEY;

client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.get('/', (req, res) => res.send('testing 1,2,3'));

app.get('/api/v3/videos/find', (req, res) => {
  let url = 'https://www.googleapis.com/youtube/v3/search';
  superagent.get(url)
    .query({'q': 'javascript&maxResults=6&part=snippet'})
    .query({'key': API_KEY})
    .then(console.log(res))
    .then(arr => res.send(arr))
    .catch(console.error)
})

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));