import React, { useState } from "react";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteTopBar,
  updateTopBar,
} from "@/lib/database/actions/admin/topbar/topbar.actions";

type Props = {
  topBar: any;
  setTopBars: (topBars: any) => void;
};

const TopBarListItem: React.FC<Props> = ({ topBar, setTopBars }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    name: topBar.title,
    color: topBar.color,
    btnText: topBar.button.title,
    btnColor: topBar.button.color,
    btnLink: topBar.button.link,
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false); // Tracks if the form is editable

  const handleRemoveTopBar = async (topBarId: string) => {
    try {
      setDeleting(true);
      const res = await deleteTopBar(topBarId);
      if (res?.success) {
        setTopBars(res?.topbars);
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Error deleting topBar.");
      }
    } catch (error: any) {
      toast.error("Failed to delete topBar.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateTopBar = async (topBarId: string) => {
    if (!formValues.name || !formValues.btnText || !formValues.btnLink) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await updateTopBar(
        topBarId,
        formValues.name,
        formValues.color,
        formValues.btnText,
        formValues.btnColor,
        formValues.btnLink
      );
      if (res?.success) {
        setTopBars(res?.topbars);
        toast.success(res?.message);
        setIsEditable(false); // Disable editing after saving
      } else {
        toast.error(res?.message || "Error updating topBar.");
      }
    } catch (error: any) {
      toast.error("Failed to update topBar.");
    }
  };

  const handleAccordionToggle = () => {
    setOpen(!open); // Toggle accordion open/close
  };

  const handleEditClick = () => {
    setIsEditable(true); // Enable editing on Edit button click
    if (!open) {
      setOpen(true); // Open accordion if it is closed
    }
  };

  return (
    <div className="w-full gap-[1rem] flex flex-col p-[1rem] bg-white text-black items-center rounded-xl custom-shadow">
      <div className="w-full flex justify-between items-center bg-white">
        {/* Arrow Button */}
        <button
          onClick={handleAccordionToggle} // Only toggle accordion when clicking on the arrow button
          className="flex items-center space-x-2 cursor-pointer"
        >
          {open ? (
            <IoIosArrowDown className="w-6 h-6 text-black" />
          ) : (
            <IoIosArrowForward className="w-6 h-6 text-black" />
          )}
          <div className="text-lg">{topBar.title}</div>
        </button>

        <div className="flex space-x-4">
          {/* Edit Button */}
          <AiTwotoneEdit
            className="w-6 h-6 cursor-pointer text-black"
            onClick={handleEditClick} // Edit button opens accordion and enables editing
          />
          {/* Delete Button */}
          <AiFillDelete
            className="w-6 h-6 cursor-pointer text-black"
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {open && (
        <div className="custom-shadow rounded-xl w-full bg-white p-[1rem]">
          <div className="flex flex-col space-y-4">
            <label className="text-black text-lg">TopBar Name</label>
            <input
              type="text"
              value={formValues.name}
              onChange={(e) =>
                isEditable &&
                setFormValues({ ...formValues, name: e.target.value })
              }
              className={`p-2 rounded text-lg ${
                isEditable ? "bg-gray-200 text-black" : "bg-gray-200 text-black"
              } ${isEditable ? "outline-none" : "focus:outline-none"}`}
              readOnly={!isEditable}
            />

            <label className="text-black text-lg">TopBar Color</label>
            <input
              type="color"
              value={formValues.color}
              onChange={(e) =>
                isEditable &&
                setFormValues({ ...formValues, color: e.target.value })
              }
              className={`w-full h-10 rounded ${
                isEditable ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!isEditable}
            />

            <label className="text-black text-lg">Button Text</label>
            <input
              type="text"
              value={formValues.btnText}
              onChange={(e) =>
                isEditable &&
                setFormValues({ ...formValues, btnText: e.target.value })
              }
              placeholder="Button Text"
              className={`p-2 rounded text-lg ${
                isEditable ? "bg-gray-200 text-black" : "bg-gray-200 text-black"
              } ${isEditable ? "outline-none" : "focus:outline-none"}`}
              readOnly={!isEditable}
            />

            <label className="text-black text-lg">Button Color</label>
            <input
              type="color"
              value={formValues.btnColor}
              onChange={(e) =>
                isEditable &&
                setFormValues({ ...formValues, btnColor: e.target.value })
              }
              className={`w-full h-10 rounded ${
                isEditable ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!isEditable}
            />

            <label className="text-black text-lg">Button Link</label>
            <input
              type="text"
              value={formValues.btnLink}
              onChange={(e) =>
                isEditable &&
                setFormValues({ ...formValues, btnLink: e.target.value })
              }
              placeholder="Button Link"
              className={`p-2 ml-2 rounded ${
                isEditable ? "bg-gray-200 text-black" : "bg-gray-200 text-black"
              } ${isEditable ? "outline-none" : "focus:outline-none"}`}
              readOnly={!isEditable}
            />
          </div>

          {isEditable && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleUpdateTopBar(topBar._id)}
                className="bg-green-500 text-black p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditable(false);
                  setFormValues({
                    name: topBar.title,
                    color: topBar.color,
                    btnText: topBar.button.title,
                    btnColor: topBar.button.color,
                    btnLink: topBar.button.link,
                  });
                }}
                className="bg-red-500 text-black p-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-black text-lg mb-4">
              Are you sure you want to delete this topBar?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRemoveTopBar(topBar._id)}
                className="px-4 py-2 bg-red-500 text-black rounded"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-black bg-gray-400 hover:bg-gray-300 rounded"
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

export default TopBarListItem;
