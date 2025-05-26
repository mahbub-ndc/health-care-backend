import { PrismaClient, userRole } from "../../../generated/prisma";
import bycrypt from "bcrypt";

const prisma = new PrismaClient();
const createAdmin = async (data: any) => {
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
