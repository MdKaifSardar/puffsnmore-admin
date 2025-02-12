"use client";
import CreateCategory from "@/components/admin/dashboard/categories/create";
import ListAllCategories from "@/components/admin/dashboard/categories/list";
import { getAllCategories } from "@/lib/database/actions/admin/category/category.actions";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const AdminCategories = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        await getAllCategories()
          .then((res) => {
            setData(res);
          })
          .catch((err) => alert(err));
      } catch (error: any) {
        alert(error);
      }
    };
    fetchAllCategories();
  }, []);
  return (
    <div className="gap-[2rem] flex flex-col justify-center items-center w-[70%] h-fit">
      <ToastContainer />
      <CreateCategory setCategories={setData} />
      <ListAllCategories categories={data} setCategories={setData} />
    </div>
  );
};

export default AdminCategories;
