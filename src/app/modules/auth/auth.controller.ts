import { authService } from "./auth.service";

import { Request, Response } from "express";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        needToChangePassword: result.needTochangePassword,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
    const result = await authService.refreshToken(refreshToken);
    res.status(200).json({
      success: true,
      message: "Refresh token generated successfully",
      data: {
        needToChangePassword: result.needTochangePassword,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log("user from controller", req.body); // Assuming user is set by an authentication middleware

    const result = await authService.changePasssword(user.email, req.body);
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    console.error("Error changing password:", error);
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.forgetPassword(email);
    res.status(200).json({
      success: true,
      message: result.message,
      resetToken: result.resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    console.error("Error in forget password:", error);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const resetToken = req.headers.authorization || null;
    const { id, newPassword } = req.body;
    const result = await authService.resetPassword(
      id,
      resetToken as string,
      newPassword
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    console.error("Error resetting password:", error);
  }
};

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
