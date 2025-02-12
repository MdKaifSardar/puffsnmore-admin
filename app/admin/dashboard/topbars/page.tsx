"use client";

import CreateTopBar from "@/components/admin/dashboard/topbars/create";
import ListAllTopBars from "@/components/admin/dashboard/topbars/list";
import { getAllTopBars } from "@/lib/database/actions/admin/topbar/topbar.actions";
import { useEffect, useState } from "react";
import React from "react";
import { ToastContainer } from "react-toastify";

const TopBarPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchAllTopbars = async () => {
      try {
        await getAllTopBars().then((res) => {
          if (res?.success) {
            setData(res?.topbars);
          } else {
            alert(res?.message);
          }
        });
      } catch (error: any) {
        alert(error);
      }
    };
    fetchAllTopbars();
  }, []);
  return (
    <div className="gap-[2rem] flex flex-col justify-center items-center h-git w-[70%]">
      <ToastContainer />
      <CreateTopBar setTopBar={setData} />
      <ListAllTopBars setTopBars={setData} topBars={data} />
    </div>
  );
};

export default TopBarPage;
