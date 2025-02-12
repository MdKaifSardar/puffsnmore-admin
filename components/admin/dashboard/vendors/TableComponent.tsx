import {
  ChangeVerifyTagForVendor,
  deleteSingleVendor,
} from "@/lib/database/actions/admin/vendor.actions";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingAnimation";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  zipCode: number;
  verified: boolean;
  image?: string; // Optional field for vendor image
}

interface VendorTableProps {
  vendors: Vendor[];
  fetchVendors: () => Promise<void>;
  loading: boolean; // Add loading prop
}

const headCells = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone Number" },
  { id: "zipCode", label: "Zip Code" },
  { id: "verified", label: "Verified" },
  { id: "delete", label: "Delete" },
];

const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  fetchVendors,
  loading,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    action: "delete" | "verify";
    vendorId: string;
    verified?: boolean;
  } | null>(null);

  const openModal = (
    action: "delete" | "verify",
    vendorId: string,
    verified?: boolean
  ) => {
    setModalContent({ action, vendorId, verified });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const confirmAction = async () => {
    if (!modalContent) return;

    const { action, vendorId, verified } = modalContent;

    try {
      if (action === "delete") {
        const res = await deleteSingleVendor(vendorId);
        if (res?.success) {
          toast.success(res.message);
          await fetchVendors();
        } else {
          toast.error(res?.message || "Failed to delete vendor.");
        }
      } else if (action === "verify") {
        const res = await ChangeVerifyTagForVendor(vendorId, verified!);
        if (res?.success) {
          toast.success(res.message);
          await fetchVendors();
        } else {
          toast.error(res?.message || "Failed to update vendor status.");
        }
      }
    } catch (error) {
      toast.error(`Error performing ${action} action.`);
    } finally {
      closeModal();
    }
  };

  const handleRowsPerPageChange = (count: number) => {
    setRowsPerPage(count);
    setCurrentPage(0);
  };

  const paginatedVendors = vendors.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(vendors.length / rowsPerPage);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-lg font-bold">
          Vendor Management{" "}
          <span className="text-gray-500 text-lg">
            ({vendors.length} Total Vendors)
          </span>
        </h1>
        <button
          onClick={fetchVendors}
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
                {paginatedVendors.map((vendor) => (
                  <tr key={vendor._id} className="border-t border-gray-300">
                    <td className="border border-gray-300 px-4 py-2 w-0 truncate">
                      {vendor.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 w-0 truncate">
                      {vendor.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 w-0 truncate">
                      {vendor.phoneNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 w-0 truncate">
                      {vendor.zipCode}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 w-0 truncate">
                      <button
                        onClick={() =>
                          openModal("verify", vendor._id, !vendor.verified)
                        }
                        className={`px-3 py-1 rounded ${
                          vendor.verified
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {vendor.verified ? "Verified" : "Verify"}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 w-0 truncate">
                      <button
                        onClick={() => openModal("delete", vendor._id)}
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
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage + 1} of {totalPages}
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
            <h2 className="text-lg font-bold mb-4">
              {modalContent.action === "delete"
                ? "Confirm Deletion"
                : "Confirm Verification"}
            </h2>
            <p className="mb-6">
              Are you sure you want to{" "}
              {modalContent.action === "delete"
                ? "delete this vendor?"
                : modalContent.verified
                ? "mark this vendor as verified?"
                : "mark this vendor as unverified?"}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 hover:bg-gray-200/50 bg-gray-200 rounded mr-4"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 hiver:bg-blue-300 bg-blue-500 text-white rounded"
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

export default VendorTable;
