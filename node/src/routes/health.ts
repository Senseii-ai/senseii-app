import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

const healthcheckRouteHandler = (req: Request, res: Response) => {
  res.status(200).json({ message: "Pong" });
};

const testThreads = [
  { name: "Hello this is one" },
  { name: "Hello this is Two" },
];

const demoThreads = (req: Request, res: Response) => {
  res.json({ message: testThreads });
};

router.route("/").get(healthcheckRouteHandler);
router.route("/threads").get(demoThreads);

export default router;
