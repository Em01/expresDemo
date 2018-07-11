const mongoose = require('mongoose')
// const Joi = require('joi');
const express = require('express');
const app = express();
const genres = require('./routes/genres');

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connnected to mongodb'))
  .catch((err) => console.error('could not connect to mongodb', err));


app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
