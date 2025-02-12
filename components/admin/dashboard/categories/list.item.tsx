import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCategory,
  updateCategory,
} from "@/lib/database/actions/admin/category/category.actions";
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

interface CategoryListItemProps {
  category: { _id: string; name: string };
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  setCategories,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // Add loading state
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleRemoveCategory = async (categoryId: string) => {
    try {
      setIsDeleting(true); // Set loading state to true
      const res = await deleteCategory(categoryId); // Await the API call directly
      if (res?.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId)); // Update local state to remove the category
        toast.success(res?.message || "Category deleted successfully!");
      } else {
        toast.error(res?.message || "Failed to delete category!");
      }
    } catch (error: any) {
      toast.error(error.message || "Error deleting category.");
    } finally {
      setIsDeleting(false); // Reset loading state
      setShowDeleteModal(false); // Close modal
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    try {
      const res = await updateCategory(categoryId, name);
      if (res?.success) {
        setCategories?.(res.categories);
        toast.success(res.message || "Category updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error("Failed to update category!");
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  return (
    <div className="w-full h-fit bg-blue-500">
      <div className="flex w-full items-center justify-between p-4 text-white font-semibold rounded">
        <input
          ref={inputRef}
          value={name || category.name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
          className={`w-full bg-transparent outline-none ${
            isEditing ? "bg-white text-black p-2 rounded" : "text-white"
          }`}
        />
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateCategory(category._id)}
              className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-2"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setName("");
              }}
              className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsEditing(true);
                inputRef.current?.focus();
              }}
              className="hover:text-gray-200 flex items-center"
            >
              <FaEdit className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="hover:text-gray-200 flex items-center"
            >
              <FaTrashAlt className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete this category?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRemoveCategory(category._id)}
                disabled={isDeleting} // Disable button while loading
                className={`px-4 py-2 ${
                  isDeleting ? "bg-gray-500" : "bg-red-500"
                } text-white rounded`}
              >
                {isDeleting ? (
                  <span>Loading...</span> // Display loading text or spinner
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-white bg-gray-400 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryListItem;
