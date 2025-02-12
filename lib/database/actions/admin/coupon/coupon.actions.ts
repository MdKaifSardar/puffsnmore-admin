"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Coupon from "@/lib/database/models/coupon.model";

// create a coupon for admin
export const createCoupon = async (
  coupon: string,
  discount: number,
  startDate: any,
  endDate: any
) => {
  try {
    await connectToDatabase();

    const test = await Coupon.findOne({ coupon });
    if (test) {
      return {
        message: "Coupon already exits, try a different coupon name.",
        success: false,
      };
    }
    await new Coupon({
      coupon,
      discount,
      startDate,
      endDate,
    }).save();

    const coupons = await Coupon.find({}).sort({ updateAt: -1 }).lean();
    // Use JSON.stringify() and JSON.parse() to remove Mongoose properties
    const plainCoupons = JSON.parse(JSON.stringify(coupons));

    return {
      message: `Coupon ${coupon} has been successfully created.`,
      coupon: plainCoupons,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// delete coupon for admin
export const deleteCoupon = async (couponId: string) => {
  try {
    await connectToDatabase();

    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return {
        message: "No Coupon found with this Id!",
        success: false,
      };
    }

    const coupons = await Coupon.find({}).sort({ updateAt: -1 }).lean();
    const plainCoupons = JSON.parse(JSON.stringify(coupons));

    return {
      message: "Successfully deleted!",
      coupons: plainCoupons,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// update coupon for admin
export const updateCoupon = async (
  coupon: string,
  couponId: string,
  discount: number,
  startDate: any,
  endDate: any
) => {
  try {
    await connectToDatabase();

    const foundCoupon = await Coupon.findByIdAndUpdate(couponId, {
      coupon,
      discount,
      startDate,
      endDate,
    });
    if (!foundCoupon) {
      return {
        message: "No Coupon found with this Id.",
        success: false,
      };
    }

    // Use .lean() to return plain JavaScript objects
    const coupons = await Coupon.find({}).sort({ updateAt: -1 }).lean();
    const plainCoupons = JSON.parse(JSON.stringify(coupons));

    return {
      message: "Successfully updated!",
      coupons: plainCoupons, // Now `coupons` is a plain array of objects
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};

// get all coupons for admin
export const getAllCoupons = async () => {
  try {
    await connectToDatabase();

    const coupons = await Coupon.find({}).sort({ updatedAt: -1 }).lean();
    if (!coupons) {
      return {
        message: "No coupons found",
        success: false,
      };
    }

    // Explicitly converting the Mongoose data to plain objects
    const plainCoupons = JSON.parse(JSON.stringify(coupons));

    return {
      coupons: plainCoupons,
      message: "Successfully fetched all coupons",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
  }
};
