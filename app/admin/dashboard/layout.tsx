"use client";
import React, { useState, useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/database/actions/admin/auth/logout";
import { navItems } from "@/components/admin/dashboard/NavItems/NavItems";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Do you want to log out?")) {
      try {
        const response = await logout();
        if (response?.message === "Successfully logged out!") router.push("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div className="relative h-full flex w-full">
      {/* Dim Background Overlay when Sidebar is Open */}
      <AnimatePresence>
        {isSidebarOpen && !isLargeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:hidden bg-black z-[50]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`h-full z-[100] fixed lg:sticky bg-gray-800 text-white lg:w-[25%] xl:w-[20%] p-4 transition-transform md:translate-x-0 md:block ${
          isSidebarOpen ? "w-[80%]" : "w-0"
        } overflow-hidden`}
      >
        {/* Render Sidebar Content only if Open or on Large Screens */}
        {(isSidebarOpen || isLargeScreen) && (
          <div className="h-full flex flex-col">
            <Logo />
            <nav className="flex-1">
              {navItems.map(
                (item: {
                  name: string;
                  link: string;
                  icon: React.ReactNode;
                }) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                      pathname === item.link
                        ? "bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 mt-auto text-red-400 hover:bg-gray-700 rounded-md"
            >
              <IoIosLogOut />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </motion.aside>

      {/* Toggle Button (Hidden on large screens) */}
      <button
        className="fixed top-4 left-4 z-[100] lg:hidden text-white bg-gray-900 p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col h-full ">
        <div className=" w-full flex flex-col justify-center items-center">
          {children}
        </div>
      </main>
    </div>
  );
}
