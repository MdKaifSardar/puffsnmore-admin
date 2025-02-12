import React, { useState } from "react";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteSubCategory,
  updateSubCategory,
} from "@/lib/database/actions/admin/subCategories/subcategories.actions";

type Props = {
  subCategory: any;
  categories: any;
  setSubCategories: (subCategories: any) => void;
};

const SubCategoryListItem: React.FC<Props> = ({
  subCategory,
  categories,
  setSubCategories,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    name: subCategory.name,
    parent: subCategory?.parent?._id || "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleRemoveSubCategory = async (subCategoryId: string) => {
    try {
      setDeleting(true);
      const res = await deleteSubCategory(subCategoryId);
      if (res?.success) {
        setSubCategories(res?.subCategories);
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Error deleting subcategory.");
      }
    } catch (error: any) {
      toast.error("Failed to delete subcategory.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateSubCategory = async (subCategoryId: string) => {
    // Ensure both name and parent are present
    if (!formValues.name) {
      toast.error("Please fill in all fields.");
      return;
    }

    // If parent is not changed, use the existing parent category
    const parentCategoryId = formValues.parent || subCategory?.parent?._id;

    if (!parentCategoryId) {
      toast.error("Please select a parent category.");
      return;
    }

    try {
      const res = await updateSubCategory(
        subCategoryId,
        formValues.name,
        parentCategoryId // Send the current or new parent category
      );
      if (res?.success) {
        setSubCategories(res?.subCategories);
        toast.success(res?.message);
        setOpen(false);
      } else {
        toast.error(res?.message || "Error updating subcategory.");
      }
    } catch (error: any) {
      toast.error("Failed to update subcategory.");
    }
  };

  return (
    <div className="w-full flex flex-row p-2 bg-blue-400 text-white font-bold items-center justify-between">
      <input
        type="text"
        value={formValues.name}
        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        disabled={!open}
        className={`p-2 rounded ${
          open ? "bg-white text-black" : "bg-transparent text-white"
        }`}
      />
      <select
        value={formValues.parent}
        onChange={(e) =>
          setFormValues({ ...formValues, parent: e.target.value })
        }
        disabled={!open}
        className="p-2 ml-2 rounded bg-transparent text-white"
      >
        {categories.map((category: any) => (
          <option
            className="text-gray-400 borde-0"
            value={category._id}
            key={category._id}
          >
            {category.name}
          </option>
        ))}
      </select>

      {open && (
        <div className="flex space-x-2 ml-2">
          <button
            onClick={() => handleUpdateSubCategory(subCategory._id)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Save
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setFormValues({
                name: subCategory.name,
                parent: subCategory?.parent?._id || "",
              });
            }}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {!open && (
        <div className="flex items-center space-x-4">
          <AiTwotoneEdit
            className="w-6 h-6 cursor-pointer text-white"
            onClick={() => setOpen(true)}
          />
          <AiFillDelete
            className="w-6 h-6 cursor-pointer text-white"
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-black text-lg font-bold mb-4">
              Are you sure you want to delete this subcategory?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRemoveSubCategory(subCategory._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
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

export default SubCategoryListItem;
