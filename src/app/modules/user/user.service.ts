import { PrismaClient, userRole } from "../../../generated/prisma";
import bycrypt from "bcrypt";
import { fileUploader } from "../../../utils/fileUploader";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
  const data = JSON.parse(req.body.data);

  const file = req.file;

  // Upload file to Cloudinary
  if (file) {
    const cloudinaryResponse = (await fileUploader.uploadToCloudinary(
      file
    )) as { secure_url?: string };

    data.admin.profileImage = cloudinaryResponse.secure_url;
  }

  // password hashing

  const hashedPassword = await bycrypt.hash(data.password, 10);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const admin = await transactionClient.admin.create({
      data: data.admin,
    });
    return admin;
  });
  return result;
};
export const userService = {
  createAdmin,
};
