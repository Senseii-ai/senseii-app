import express, { Express, Request, Response } from 'express';
require('dotenv').config();
import connectDB from './db/connect';
import userRouter from './routes/user';
import VitalRouter from './routes/vitals';
import ChatRouter from "./routes/chat"

const app: Express = express();

app.use(express.json());
app.use('/api', userRouter);
app.use('/api/vitals', VitalRouter);
app.use("/api/chat", ChatRouter)

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
