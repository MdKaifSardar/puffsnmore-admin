"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { createCategory } from "@/lib/database/actions/admin/category/category.actions";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface CreateCategoryProps {
  setCategories?: (categories: any) => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({ setCategories }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: { name: "" },
    validate: {
      name: (value) =>
        value.length < 3 || value.length > 30
          ? "Category name must be between 3 to 30 characters."
          : null,
    },
  });

  const handleImageChange = async (files: FileList | null) => {
    if (!files) return;
    const base64Images = await Promise.all(Array.from(files).map(fileToBase64));
    setImages(base64Images);
  };

  const submitHandler = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const res = await createCategory(values.name, images);
      if (res?.success) {
        setCategories?.(res.categories);
        form.reset();
        setImages([]);
        toast.success(res.message || "Category created successfully!");
      } else {
        toast.error("There was an error creating the category.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the category.");
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
        onSubmit={form.onSubmit(submitHandler)}
        className="w-full flex flex-col justify-center p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Create a Category</h2>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Category name"
            {...form.getInputProps("name")}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-600"
          >
            Upload Images for Category
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="w-full h-20 overflow-hidden rounded-md">
              <img
                src={image}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={`mx-auto w-fit py-2 px-4 text-white bg-blue-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
