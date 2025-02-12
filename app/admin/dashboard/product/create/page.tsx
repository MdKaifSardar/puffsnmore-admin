import ProductCreate from "@/components/admin/dashboard/Products/ProductCreateForm";
import React from "react";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <div className="w-[70%] flex flex-col justify-center items-center">
      <ToastContainer />
      <ProductCreate />
    </div>
  );
};

export default page;
