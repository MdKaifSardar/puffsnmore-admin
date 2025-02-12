import { createSubCategory } from "@/lib/database/actions/admin/subCategories/subcategories.actions";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  setSubCategories?: (categories: any) => void;
  categories?: { _id: string; name: string }[];
};

const fletobase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CreateSubCategory: React.FC<Props> = ({
  setSubCategories,
  categories,
}) => {
  const [name, setName] = useState<string>("");
  const [parent, setParent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const base64Images = await Promise.all(fileArray.map(fletobase64));
    setImages(base64Images);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !parent || images.length === 0) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await createSubCategory(name, parent, images); // Call the API function

      // Check if res is defined before accessing its properties
      if (res?.success) {
        setSubCategories?.(res.subCategories);
        setName("");
        setParent("");
        setImages([]);
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Error: " + error);
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
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Create a Subcategory</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Subcategory name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Parent Category
          </label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
          >
            <option value="" disabled>
              Select parent category
            </option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              e.target.files && handleImageChange(e.target.files)
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
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Subcategory"}
        </button>
      </form>
    </div>
  );
};

export default CreateSubCategory;
