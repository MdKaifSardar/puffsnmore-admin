"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/database/actions/admin/auth/logout";
import { useEffect, useState } from "react";
import { getAdminCookiesandFetchAdmin } from "@/lib/database/actions/admin/admin.actions";

import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await getAdminCookiesandFetchAdmin();
        if (res?.success) {
          setAdmin(res?.admin);
        }
      } catch (error: any) {
        console.error("Error fetching admin details:", error);
      }
    };
    fetchAdminDetails();
  }, []);

  return (
    <header className="p-4 border-b border-gray-200">
      <nav className="flex justify-between items-center">
        <Logo />
        <div className="flex space-x-4">
          {admin && admin.email ? (
            <div className="flex gap-2">
              <button
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => router.push("/admin/dashboard")}
              >
                Admin Dashboard
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={async () => {
                  try {
                    const response = await logout(); // Call the logout function
                    if (response?.message === "Successfully logged out!") {
                      router.push("/"); // Navigate to home after successful logout
                    } else {
                      console.error(
                        "Logout failed:",
                        response?.message || "Unknown error"
                      );
                    }
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => router.push("/signin")}
              >
                Sign in
              </button>
              {/* <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </button> */}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
