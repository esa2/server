'use strict'

const express = require('express')
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

<<<<<<< HEAD
// Query database for user based on username
app.get('/api/v1/users/:username', (req, res) => {
  client.query(
    `select * from users where username='${req.params.username}'`
  )
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('/api/v3/videos/find', (req, res) => {
  let url = 'https://www.googleapis.com/youtube/v3/search';
  superagent.get(url)
    .query({'q': 'javascript&maxResults=6&part=snippet'})
    .query({'key': API_KEY})
    .then(console.log(res))
    .then(arr => res.send(arr))
=======
app.get('/api/v3/videos/search', (req, res) => {
  console.log('in server get')
  superAgent.get(`https://www.googleapis.com/youtube/v3/search?q=javascript&maxResults=1&part=snippet&key=${API_KEY}`)
    .then( data => console.log(data))
>>>>>>> 7b709257a090fb7d528511d28a47b261730cb687
    .catch(console.error)
})

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
