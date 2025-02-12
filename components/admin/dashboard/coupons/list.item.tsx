import React, { useEffect, useState } from "react";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  deleteCoupon,
  updateCoupon,
} from "@/lib/database/actions/admin/coupon/coupon.actions";
import { getAdminCookiesandFetchAdmin } from "@/lib/database/actions/admin/admin.actions";

const CouponListItem = ({
  coupon,
  setCoupons,
}: {
  coupon: any;
  setCoupons: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    name: coupon.coupon,
    discount: coupon.discount,
    dateRange: [new Date(coupon.startDate), new Date(coupon.endDate)] as [
      Date,
      Date
    ],
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // Modal state
  const [deleting, setDeleting] = useState<boolean>(false); // Track deletion state

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        await getAdminCookiesandFetchAdmin().then((res) => {
          if (res.success) {
            setLoading(false);
          }
        });
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchVendorDetails();
  }, []);

  const validateForm = () => {
    if (formValues.name.length < 5 || formValues.name.length > 10) {
      toast.error("Coupon name must be between 5 to 10 characters.");
      return false;
    }
    if (formValues.discount < 1 || formValues.discount > 99) {
      toast.error("Discount must be between 1% to 99%.");
      return false;
    }
    const [startDate, endDate] = formValues.dateRange;
    if (!startDate || !endDate) {
      toast.error("Both start and end dates are required.");
      return false;
    }
    if (startDate.getTime() === endDate.getTime()) {
      toast.error("You can't pick the same dates!");
      return false;
    }
    if (endDate.getTime() < startDate.getTime()) {
      toast.error("Start Date cannot be later than End Date!");
      return false;
    }
    return true;
  };

  const handleRemoveCoupon = async (couponId: string) => {
    try {
      setDeleting(true); // Set deleting state to true
      const res = await deleteCoupon(couponId);
      if (res?.success) {
        setCoupons(res?.coupons);
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Error deleting coupon.");
      }
    } catch (error: any) {
      toast.error("Failed to delete coupon.");
    } finally {
      setDeleting(false); // Reset deleting state
      setShowDeleteModal(false); // Close the modal
    }
  };

  const handleUpdateCoupon = async (couponId: string) => {
    if (!validateForm()) return;

    const { name, discount, dateRange } = formValues;
    const [startDate, endDate] = dateRange;
    try {
      const res = await updateCoupon(
        name,
        couponId,
        discount,
        startDate,
        endDate
      );
      if (res?.success) {
        setCoupons(res?.coupons);
        setOpen(false);
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Error updating coupon.");
      }
    } catch (error: any) {
      toast.error("Failed to update coupon.");
    }
  };

  return (
    <div className="w-full flex flex-row p-2 bg-blue-400 text-white font-bold items-center justify-between">
      <input
        type="text"
        value={formValues.name}
        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        disabled={!open}
        className={`p-2 rounded ${
          open ? "bg-white text-black" : "bg-transparent text-white"
        }`}
      />

      {open && (
        <div className="flex space-x-2">
          <input
            type="number"
            value={formValues.discount}
            onChange={(e) =>
              setFormValues({ ...formValues, discount: Number(e.target.value) })
            }
            min={1}
            max={99}
            className="p-2 rounded bg-white text-black"
          />
          <input
            type="date"
            value={formValues.dateRange[0]?.toISOString().split("T")[0] || ""}
            onChange={(e) => {
              const newStartDate = new Date(e.target.value);
              setFormValues({
                ...formValues,
                dateRange: [newStartDate, formValues.dateRange[1]],
              });
            }}
            min={new Date().toISOString().split("T")[0]}
            className="p-2 rounded bg-white text-black"
          />
          <input
            type="date"
            value={formValues.dateRange[1]?.toISOString().split("T")[0] || ""}
            onChange={(e) => {
              const newEndDate = new Date(e.target.value);
              setFormValues({
                ...formValues,
                dateRange: [formValues.dateRange[0], newEndDate],
              });
            }}
            min={formValues.dateRange[0]?.toISOString().split("T")[0] || ""}
            className="p-2 rounded bg-white text-black"
          />
          <button
            onClick={() => handleUpdateCoupon(coupon._id)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Save
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setFormValues({
                name: coupon.coupon,
                discount: coupon.discount,
                dateRange: [
                  new Date(coupon.startDate),
                  new Date(coupon.endDate),
                ],
              });
            }}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {!open && (
        <div className="flex items-center space-x-4">
          <span>{formValues.discount}%</span>
          <AiTwotoneEdit
            className="w-6 h-6 cursor-pointer text-white"
            onClick={() => setOpen(true)}
          />
          <AiFillDelete
            className="w-6 h-6 cursor-pointer text-white"
            onClick={() => setShowDeleteModal(true)} // Show modal on delete click
          />
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-black text-lg font-bold mb-4">
              Are you sure you want to delete this coupon?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRemoveCoupon(coupon._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={deleting} // Disable button during deletion
              >
                {deleting ? "Deleting..." : "Yes, Delete"}{" "}
                {/* Show loading text */}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-white bg-gray-400 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponListItem;
