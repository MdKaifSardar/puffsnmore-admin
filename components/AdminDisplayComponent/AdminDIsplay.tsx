import {
  deleteAdminById,
  fetchAllAdmins,
} from "@/lib/database/actions/admin/admin.actions";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Admin {
  _id: string;
  email: string;
  username: string;
}

interface AdminDisplayProps {
  reload: boolean;
}

const AdminDisplay: React.FC<AdminDisplayProps> = ({ reload }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllAdmins();
      if (result.success) {
        setAdmins(result.admins);
      } else {
        setError(result.error || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("An error occurred while fetching admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdminId) return;

    setDeleting(true);
    try {
      await deleteAdminById(selectedAdminId);
      setAdmins((prev) =>
        prev.filter((admin) => admin._id !== selectedAdminId)
      );
      toast.success("Admin deleted successfully!");
    } catch (err) {
      console.error("Error deleting admin:", err);
      toast.error("Failed to delete admin.");
    } finally {
      setDeleting(false);
      setSelectedAdminId(null);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [reload]);

  return (
    <div className="flex flex-col w-full md:w-[70%] h-fit mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Admin List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {admins.length === 0 ? (
            <p>No admins found.</p>
          ) : (
            admins.map((admin) => (
              <div
                key={admin._id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
              >
                <div>
                  <p className="font-medium">{admin.username}</p>
                  <p className="text-gray-600">{admin.email}</p>
                </div>
                <button
                  onClick={() => setSelectedAdminId(admin._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedAdminId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this admin?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedAdminId(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                disabled={deleting}
                className={`${
                  deleting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                } text-white px-4 py-2 rounded-lg transition`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisplay;
