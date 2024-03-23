import express, { Express, Request, Response } from 'express';
require('dotenv').config();
import connectDB from './db/connect';
import userRouter from './routes/user';
import VitalRouter from './routes/vitals';
import ChatRouter from "./routes/chat"
import threadRouter from "./routes/threads"
import cors from 'cors';

const app: Express = express();
app.use(cors());

app.use(express.json());
app.use('/api', userRouter);
app.use('/api/vitals', VitalRouter);
app.use("/api/chat", ChatRouter)

// list of test routers
app.use('/api/threads', threadRouter)

app.get('/ping', (req: Request, res: Response) => {
  const userMessage = req.body.message
  res.send("pong")
});

const start = async () => {
  connectDB();
  app.listen(9090, () => {
    console.log('listening to port 9090');
  });
};

start();
