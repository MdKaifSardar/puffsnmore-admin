"use server";
import { cookies } from "next/headers";
import { connectToDatabase } from "../../connect";
import Admin from "../../models/admin.model";
const jwt = require("jsonwebtoken");

export const getAdminCookiesandFetchAdmin = async () => {
  const cookieStore = await cookies();
  const admin_token = cookieStore.get("admin_token");
  if (!admin_token) {
    return {
      message: "Admin token is invalid!",
      admin: [],
      success: false,
    };
  }
  try {
    const decode = jwt.verify(admin_token?.value, process.env.JWT_SECRET);
    await connectToDatabase();
    const admin = await Admin.findById(decode.id);
    if (!admin) {
      cookieStore.delete("admin_token");
      return {
        message: "Admin doesn't exist.",
        admin: [],
        success: false,
      };
    }
    return {
      message: "Successfully found Admin in the database.",
      admin: JSON.parse(JSON.stringify(admin)),
      success: true,
    };
  } catch (error) {
    console.error("Error verifying admin token or fetching admin:", error);
    return {
      message: "Error occurred while verifying or fetching admin.",
      admin: [],
      success: false,
    };
  }
};

export async function deleteAdminById(id: string | null) {
  try {
    if (!id) {
      throw new Error("Admin ID is required");
    }

    await connectToDatabase();

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      throw new Error("Admin not found");
    }

    return { message: "Admin deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    throw new Error(error.message || "Unknown error");
  }
}

export async function fetchAllAdmins() {
  try {
    await connectToDatabase();

    const admins = await Admin.find();

    const formattedAdmins = admins.map((admin) => ({
      _id: admin._id.toString(), // Convert ObjectId to string
      email: admin.email,
      username: admin.username,
    }));

    return { success: true, admins: formattedAdmins };
  } catch (error: any) {
    console.error("Error fetching admins:", error);
    return { success: false, error: "Failed to fetch admins", admins: [] };
  }
}
