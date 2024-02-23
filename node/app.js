const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connect');

const userRouter = require('./routes/user');

const app = express();

app.use('/api', userRouter);

app.get('/ping', (req, res) => {
  res.send('Pong');
});

const start = async () => {
  connectDB();
  app.listen(9090, () => {
    console.log('listening to port 9090');
  });
};

start();
