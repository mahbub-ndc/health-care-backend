import { Request, Response } from "express";

import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filterItems = pick(req.query, [
      "searchTerm",
      "name",
      "email",
      "contactNumber",
    ]);

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    console.log("pagination:", options);

    const result = await adminService.getAllFromDB(filterItems, options);

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.name : "Unknown error",
    });
    console.error("Error fetching admins:", error);
  }
};

//get Single Admin From DB
const getSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.getSingleAdminFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.name : "Unknown error",
    });
    console.error("Error fetching admin:", error);
  }
};

//update admin
const updateAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateAdminFromDB(id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.name : "Unknown error",
    });
    console.error("Error updating admin:", error);
  }
};

export const adminController = {
  getAllFromDB,
  getSingleAdminFromDB,
  updateAdminFromDB,
};
