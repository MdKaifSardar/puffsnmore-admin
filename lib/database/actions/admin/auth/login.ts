"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Admin from "@/lib/database/models/admin.model";
import { cookies } from "next/headers";

export const loginAdmin = async (email: string, password: string) => {
  try {
    await connectToDatabase();

    if (!email || !password) {
      return {
        message: "Please fill in all fields",
        success: false,
      };
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return {
        message: "Admin doesn't exist.",
        success: false,
      };
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return {
        message: "Password is incorrect.",
        success: false,
      };
    }

    const token = admin.getJWTToken();
    const cookieStore = await cookies();

    cookieStore.set("admin_token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      httpOnly: true,
      secure: true,
    });

    return {
      message: "Login Successful.",
      admin: JSON.parse(JSON.stringify(admin)),
      token,
      success: true,
    };
  } catch (error: any) {
    console.log(error);

    return {
      message: "An error occurred during login.",
      success: false,
    };
  }
};
