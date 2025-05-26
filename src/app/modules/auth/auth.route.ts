import express, { NextFunction, Request, Response } from "express";
import { authController } from "./auth.controller";
import { verify } from "jsonwebtoken";
import { auth } from "../../../middlewares/auth";
import { userRole } from "../../../generated/prisma";
const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.patch(
  "/change-password",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR, userRole.PATIENT),
  authController.changePassword
);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
export const authRoutes = router;
