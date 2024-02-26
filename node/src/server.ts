import express, { Express, Request, Response } from 'express';
require('dotenv').config();
import connectDB from './db/connect';

// const userRouter = require('./routes/user');

const app: Express = express();

//app.use('/api', userRouter);

app.get('/ping', (req: Request, res: Response) => {
  res.send('Pong');
});

const start = async () => {
  connectDB();
  app.listen(9090, () => {
    console.log('listening to port 9090');
  });
};

start();
