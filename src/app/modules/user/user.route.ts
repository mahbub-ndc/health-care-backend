import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { verify } from "jsonwebtoken";
import { auth } from "../../../middlewares/auth";
const router = express.Router();

router.post("/", auth("ADMIN", "SUPER_ADMIN"), userController.createAdmin);

export const userRoutes = router;
