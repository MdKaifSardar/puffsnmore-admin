"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Admin from "@/lib/database/models/admin.model";
import { cookies } from "next/headers";
const bcrypt = require("bcrypt");

export const registerAdmin = async (email: string, password: string) => {
  try {
    await connectToDatabase();
    if (!email || !password) {
      return {
        message: "Please fill in all fields",
        success: false,
      };
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return {
        message: "Admin already exists.",
        success: false,
      };
    }
    if (password.length < 6) {
      return {
        message: "Password must be at least 6 characters long.",
        success: false,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await new Admin({
      email,
      password: hashedPassword,
    }).save();

    // Call the getJWTToken method on the saved admin
    const token = admin.getJWTToken();

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    });

    return {
      message: "Successfully registered new admin.",
      admin: JSON.parse(JSON.stringify(admin)),
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "An error occurred during registration.",
      success: false,
    };
  }
};
