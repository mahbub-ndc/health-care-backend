import express from "express";

import { adminController } from "./admin.controller";
import { auth } from "../../../middlewares/auth";
import { userRole } from "../../../generated/prisma";
const router = express.Router();

router.get(
  "/",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.getAllFromDB
);
router.get(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.getSingleAdminFromDB
);
router.patch(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.updateAdminFromDB
);

export const adminRoutes = router;
