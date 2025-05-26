import express, { Application, Response, Request } from "express";
import cors from "cors";

import { routes } from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Health care server is running");
});

// Import routes
app.use("/api/v1/", routes);

export default app;
