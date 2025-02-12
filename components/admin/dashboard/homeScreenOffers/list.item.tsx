import {
  deleteOffer,
  updateOffer,
} from "@/lib/database/actions/admin/homescreenoffers/home.screen.offers";
import React, { useState } from "react";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeScreenOfferListItem = ({
  offer,
  setOffers,
}: {
  offer: any;
  setOffers: any;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    title: offer.title,
    offerType: offer.offerType,
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // Modal state
  const [deleting, setDeleting] = useState<boolean>(false); // Track deletion state

  const handleRemoveOffer = async (offerId: string) => {
    try {
      setDeleting(true); // Set deleting state to true
      const res = await deleteOffer(offerId); // Delete offer from DB
      if (res?.success) {
        setOffers(res?.offers); // Update offers list after deletion
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Error deleting offer.");
      }
    } catch (error: any) {
      toast.error("Failed to delete offer.");
    } finally {
      setDeleting(false); // Reset deleting state
      setShowDeleteModal(false); // Close the modal
    }
  };

  const handleUpdateOffer = async (offerId: string) => {
    if (!formValues.title || !formValues.offerType) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const res = await updateOffer(
        offerId,
        formValues.title,
        formValues.offerType
      );
      if (res?.success) {
        setOffers(res?.offers); // Update the offers list after the update
        toast.success(res?.message);
        setOpen(false); // Close the edit form
      } else {
        toast.error(res?.message || "Error updating offer.");
      }
    } catch (error: any) {
      toast.error("Failed to update offer.");
    }
  };

  return (
    <div className="rounded-xl custom-shadow w-full flex flex-col md:flex-row p-2 bg-white text-black font-bold items-center gap-[.5rem] md:gap-[1rem] justify-center">
      <div className="px-[.5rem] flex flex-col md:flex-row justify-center md:justify-between items-center w-full">
        <input
          type="text"
          value={formValues.title}
          onChange={(e) =>
            setFormValues({ ...formValues, title: e.target.value })
          }
          disabled={!open}
          className={`text-center md:text-left w-fit p-2 rounded-lg ${
            open ? "bg-gray-200 text-black" : "bg-transparent text-black"
          }`}
        />
        <select
          value={formValues.offerType}
          onChange={(e) =>
            setFormValues({ ...formValues, offerType: e.target.value })
          }
          disabled={!open}
          className="rounded bg-transparent text-black"
        >
          <option value="specialCombo">Special Combo</option>
          <option value="crazyDeal">Crazy Deal</option>
        </select>
      </div>

      <div className="flex flex-row justify-center items-center w-fit">
        {open && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleUpdateOffer(offer._id)}
              className="bg-green-500 text-black p-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setFormValues({
                  title: offer.title,
                  offerType: offer.offerType,
                });
              }}
              className="bg-red-500 text-black p-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {!open && (
          <div className="flex items-center space-x-4">
            <AiTwotoneEdit
              className="w-6 h-6 cursor-pointer text-black"
              onClick={() => setOpen(true)}
            />
            <AiFillDelete
              className="w-6 h-6 cursor-pointer text-black"
              onClick={() => setShowDeleteModal(true)} // Show modal on delete click
            />
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-black text-lg font-bold mb-4">
              Are you sure you want to delete this offer?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRemoveOffer(offer._id)}
                className="px-4 py-2 bg-red-500 text-black rounded"
                disabled={deleting} // Disable button during deletion
              >
                {deleting ? "Deleting..." : "Yes, Delete"}{" "}
                {/* Show loading text */}
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

export default HomeScreenOfferListItem;
