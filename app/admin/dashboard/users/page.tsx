"use client";

import UserTable from "@/components/admin/dashboard/users/UserTableComponent";
import { getAllUsers } from "@/lib/database/actions/admin/user/user.actions";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  _id: string;
  clerkId: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const res = await getAllUsers();
      if (res?.success) {
        setUsers(res?.users || []);
        toast.success("Users fetched successfully!");
      } else {
        toast.error(res?.message || "Failed to fetch users.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-[70%] flex flex-col justify-center items-start">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <UserTable users={users} fetchUsers={fetchUsers} loading={loading} />
    </div>
  );
};

export default UsersPage;
