"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import { logout } from "@/lib/database/actions/admin/auth/logout";
import { navItems } from "@/components/admin/dashboard/NavItems/NavItems";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobileOpened, setMobileOpened] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Do you want to log out?");
    if (confirmLogout) {
      try {
        const response = await logout();
        if (response?.message === "Successfully logged out!") {
          router.push("/"); // Navigate to home after successful logout
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div className="flex h-fit w-full flex-row justify-between items-start">
      <div className="p-[1rem] bg-gray-900 gap-[1rem] w-[20%] flex flex-col justify-center items-center h-fit">
        <div className="w-full px-[.5rem] text-xl font-semibold text-white">
          Logo
        </div>

        {/* Navigation links */}
        <div className="w-full flex flex-col justify-center items-start gap-[.5rem]">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="flex flex-row justify-start items-center text-white w-full gap-4 p-[.5rem] rounded-md hover:bg-gray-700"
            >
              <Link href={item.link} className="flex items-center gap-4">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="cursor-pointer flex items-center gap-4 p-2 rounded-md hover:bg-gray-700 mt-6"
        >
          <IoIosLogOut size={20} />
          <span>Logout</span>
        </div>
      </div>

      {/* Main content */}
      <div className="py-[4rem] w-full flex-col flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
