import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const userController = {
  createAdmin,
};
