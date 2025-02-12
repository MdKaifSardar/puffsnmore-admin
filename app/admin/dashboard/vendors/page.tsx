"use client";

import VendorTable from "@/components/admin/dashboard/vendors/TableComponent";
import { getAllVendors } from "@/lib/database/actions/admin/vendor.actions";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  zipCode: number;
  verified: boolean;
  image?: string; // Optional field for vendor image
}

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchVendors = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const res = await getAllVendors();
      if (res?.success) {
        setVendors(res?.vendors || []);
        toast.success("Vendors fetched successfully!");
      } else {
        toast.error(res?.message || "Failed to fetch vendors.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while fetching vendors.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="w-[70%] flex flex-col justify-center items-start">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Vendors List</h1>
      <VendorTable
        vendors={vendors}
        fetchVendors={fetchVendors}
        loading={loading}
      />
    </div>
  );
};

export default VendorsPage;
