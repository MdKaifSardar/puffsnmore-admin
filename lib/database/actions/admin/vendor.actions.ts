"use server";
import mongoose from "mongoose";
import Vendor from "../../models/vendor.model";
import { connectToDatabase } from "./../../connect";
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Types;

// get single vendor
export const getSingleVendor = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const vendorObjectId = new ObjectId(vendorId);

    const vendor = await Vendor.findById(vendorObjectId);
    if (!vendor) {
      return {
        message: "Admin does'nt exists.",
        success: false,
        vendor: [],
      };
    }
    return {
      success: true,
      message: "Successfully Admin found",
      vendor,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// check vendor for admin
export const checkVendor = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const vendorObjectId = new ObjectId(vendorId);

    const vendor = await Vendor.findById(vendorObjectId);
    if (!vendor) {
      return {
        message: "Admin not found.",
        success: false,
      };
    }
    return {
      message: "Admin found",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// check vendor if he was verified by an admin for vendor
export const checkVendorVerified = async (vendorId: string) => {
  try {
    await connectToDatabase();
    const vendorObjectId = new ObjectId(vendorId);

    const vendor = await Vendor.findById(vendorObjectId);
    if (!vendor) {
      return {
        message: "Admin not found.",
        success: false,
      };
    }
    const isVerified = vendor.verified;
    if (isVerified) {
      return {
        message: "Admin was verified.",
        success: true,
      };
    } else {
      return {
        message: "Admin was not verified!",
        success: false,
      };
    }
  } catch (error: any) {
    console.log(error);
  }
};

// get all vendors for admin
export async function getAllVendors() {
  try {
    await connectToDatabase();
    const vendors = await Vendor.find().sort({ createdAt: -1 }).lean();
    return {
      success: true,
      vendors: JSON.parse(JSON.stringify(vendors)),
      message: "Vendors fetched successfully",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      vendors: [],
      message: "Failed to fetch vendors",
    };
  }
}

// change verify tag for vendor in admin
export async function ChangeVerifyTagForVendor(
  vendorId: string,
  value: boolean
) {
  try {
    await connectToDatabase();
    const vendor = await Vendor.findByIdAndUpdate(vendorId, {
      verified: value,
    });
    if (!vendor) {
      return {
        success: false,
        message: "No Vendor found with this ID",
      };
    }
    return {
      message: "Successfully updated Vendor",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message:
        "An error occurred while changing the verification status. Please try again later.",
      success: false,
    };
  }
}

export async function deleteSingleVendor(id: string) {
  try {
    await connectToDatabase();
    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return {
        message: "Vendor not found with this ID!",
        success: false,
      };
    }
    return {
      message: "Vendor successfully deleted.",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      message:
        "An error occurred while deleting the vendor. Please try again later.",
      success: false,
    };
  }
}
