import { PrismaClient, userStatus } from "../../../generated/prisma";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: userStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bycrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "30d",
    }
  );

  const userData = {
    needTochangePassword: user.needToChangePassword,
    accessToken,
    refreshToken,
  };
  return userData;
};

const refreshToken = async (refreshToken: any) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string; email: string; role: string };
  const user = await prisma.user.findUnique({
    where: {
      email: decoded.email,
      status: userStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return {
    accessToken: newAccessToken,
    needTochangePassword: user.needToChangePassword,
  };
};

const changePasssword = async (email: string, payload: any) => {
  console.log("payload", payload);
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: userStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bycrypt.compare(
    payload.oldPassword,
    user.password
  );
  if (!isPasswordValid) {
    throw new Error("Invalid old password, please provide the correct one");
  }

  const hashedPassword = await bycrypt.hash(payload.newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
      needToChangePassword: false,
    },
  });
  return {
    message: "Password changed successfully",
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  };
};

const forgetPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: userStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const resetToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_RESET_PASSWORD_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?userId=${user.id}token=${resetToken}`;
  console.log("Reset link:", resetLink);

  const nodemailer = require("nodemailer");

  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mahbubndc1@gmail.com",
      pass: "ldhqbqkugkjclmky",
    },
  });

  // Wrap in an async IIFE so we can use await.
  (async () => {
    const info = await transporter.sendMail({
      from: '"Health Care Server" <mahubndc1@gmail.com>',
      to: user.email, // list of receivers
      subject: "Your Password Reset Link", // Subject line
      text: "Hello world?", // plain‑text body
      html: `
      <b>
      Your rest password Link: <a href=${resetLink}>Reset Password</a>
      </b>
      
      `, // HTML body
    });

    console.log("Message sent:", info.messageId);
  })();

  return {
    message: "Reset token generated successfully",
    resetToken,
  };
};

const resetPassword = async (
  userId: string,
  token: string,
  newPassword: string
) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_RESET_PASSWORD_SECRET as string
  ) as { id: string; email: string; role: string };
  if (decoded.id !== userId) {
    throw new Error("Invalid token");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      status: userStatus.ACTIVE,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bycrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
      needToChangePassword: false,
    },
  });
  return {
    message: "Password reset successfully",
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  };
};

export const authService = {
  loginUser,
  refreshToken,
  changePasssword,
  forgetPassword,
  resetPassword,
};
