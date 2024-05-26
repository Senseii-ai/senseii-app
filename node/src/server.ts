import express, { Express, Request, Response } from 'express';
require('dotenv').config();
import connectDB from './db/connect';
import userRouter from './routes/user';
import VitalRouter from './routes/vitals';
import ChatRouter from "./routes/chat"
import threadRouter from "./routes/threads"
import cors from 'cors';
import swaggerDocs from './utils/swagger';
const app: Express = express();
app.use(cors());
const port = 9090

app.use(express.json());
app.use('/api', userRouter);
app.use('/api/vitals', VitalRouter);
app.use("/api/chat", ChatRouter)

// list of test routers
app.use('/api/threads', threadRouter)

app.get('/ping', (req: Request, res: Response) => {
  res.send("pong")
});

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log('listening to port 9090');
  });

  swaggerDocs(app, port)
};

start();
