import { useState } from "react";
import { createOffer } from "@/lib/database/actions/admin/homescreenoffers/home.screen.offers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fletobase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CreateHomeScreenOffer = ({
  setHomeScreenOffers,
}: {
  setHomeScreenOffers: any;
}) => {
  const [title, setTitle] = useState<string>("");
  const [offerType, setOfferType] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = async (files: File[]) => {
    const base64Images = await Promise.all(files.map(fletobase64));
    setImages(base64Images);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !offerType || images.length === 0) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await createOffer(title, offerType, images);
      if (res?.success) {
        setHomeScreenOffers(res?.offers);
        setTitle("");
        setOfferType("");
        setImages([]);
        toast.success(res?.message || "Offer created successfully!");
      } else {
        toast.error(res?.message || "Failed to create offer.");
      }
    } catch (error: any) {
      toast.error("An error occurred while creating the offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-fit">
      {loading && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="text-white">Loading...</div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Create a Home Screen Offer</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Offer title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Offer Type
          </label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
          >
            <option value="" disabled>
              Select offer type
            </option>
            <option value="specialCombo">Special Combo</option>
            <option value="crazyDeal">Crazy Deal</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Upload Images for Offer
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              e.target.files && handleImageChange(Array.from(e.target.files))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="w-full">
              <img
                src={image}
                alt={`Uploaded image ${index + 1}`}
                className="rounded border border-gray-300"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mx-auto w-fit py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 mt-4"
        >
          Add Offer
        </button>
      </form>
    </div>
  );
};

export default CreateHomeScreenOffer;
