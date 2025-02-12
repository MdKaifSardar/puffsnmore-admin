import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingAnimation";
import { deleteSingleUser } from "@/lib/database/actions/admin/user/user.actions";

interface User {
  _id: string;
  clerkId: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  fetchUsers: () => Promise<void>;
  loading: boolean;
}

const headCells = [
  { id: "clerkId", label: "Clerk ID" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "image", label: "Image" },
  { id: "createdAt", label: "Created At" },
  { id: "delete", label: "Delete" },
];

const UserTable: React.FC<UserTableProps> = ({
  users,
  fetchUsers,
  loading,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ userId: string } | null>(
    null
  );

  const openModal = (userId: string) => {
    setModalContent({ userId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!modalContent) return;

    try {
      const { userId } = modalContent;
      const res = await deleteSingleUser(userId);
      if (res?.success) {
        toast.success(res.message);
        await fetchUsers();
      } else {
        toast.error(res?.message || "Failed to delete user.");
      }
    } catch (error) {
      toast.error("Error deleting user.");
    } finally {
      closeModal();
    }
  };

  const handleRowsPerPageChange = (count: number) => {
    setRowsPerPage(count);
    setCurrentPage(0);
  };

  const paginatedUsers = users.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-lg font-bold">User Management</h1>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Table"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-fit">
          <div className="w-full overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {headCells.map((cell) => (
                    <th
                      key={cell.id}
                      className="border border-gray-300 px-4 py-2 text-left text-sm md:text-base"
                    >
                      {cell.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">
                      {user.clerkId}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={user.image}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => openModal(user._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex w-full justify-between items-center mt-4">
            <div>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-200 rounded mr-2"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(users.length / rowsPerPage) - 1
                    )
                  )
                }
                disabled={
                  currentPage === Math.ceil(users.length / rowsPerPage) - 1
                }
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>
            <div>
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => handleRowsPerPageChange(count)}
                  className={`px-3 py-1 ${
                    rowsPerPage === count
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  } rounded mr-2`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
