"use client";

import AdminCreateForm from "@/components/AdminCreateForm/AdminCreate";
import AdminsList from "@/components/AdminDisplayComponent/AdminDIsplay";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllVendorsPage = () => {
  const [reload, setReload] = useState(false);

  const onSuccess = () => {
    setReload((prev) => !prev); // Toggle reload state
  };

  const onFailure = () => {
    toast.error("Failed to create admin!");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <AdminCreateForm onSuccess={onSuccess} onFailure={onFailure} />
      <AdminsList reload={reload} />
      <ToastContainer />
    </div>
  );
};

export default AllVendorsPage;
