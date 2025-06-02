import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { auth } from "../../../middlewares/auth";
import { fileUploader } from "../../../utils/fileUploader";

const router = express.Router();

router.post(
  "/",

  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  userController.createAdmin
);

export const userRoutes = router;
