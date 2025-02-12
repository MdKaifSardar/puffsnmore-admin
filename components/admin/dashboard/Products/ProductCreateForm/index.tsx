"use client";

import { getAllCategories } from "@/lib/database/actions/admin/category/category.actions";
import { createProduct } from "@/lib/database/actions/admin/products/products.actions";
import { getSubCategoriesByCategoryParent } from "@/lib/database/actions/admin/subCategories/subcategories.actions";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  id: string;
  name: string;
}

const ProductCreate = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ qty: number; price: number }[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [details, setDetails] = useState<{ name: string; value: string }[]>([]);
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<{ name: string }[]>([]);
  const [parent, setParent] = useState<string | null>(null);
  const [featured, setFeatured] = useState<boolean>(false);
  const [benefits, setBenefits] = useState<{ name: string }[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<
    { name: string; _id: string }[]
  >([]);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      //   setLoading(true); // Set loading to true before fetching
      const categories = await getAllCategories();
      if (categories) {
        setCategories(
          categories.map((category: any) => ({
            id: category._id,
            name: category.name,
          }))
        );
      } else {
        toast.error("No categories found.");
      }
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      toast.error(
        error.message || "An error occurred while fetching categories."
      );
    } finally {
      //   setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchSubCategories = async (category: string) => {
    try {
      //   setLoading(true); // Set loading to true before fetching
      if (!category) {
        toast.error("Please select a category.");
        return;
      }

      const res = await getSubCategoriesByCategoryParent(category);
      if (res?.success) {
        setAvailableSubCategories(res.results);
      } else {
        toast.error(res?.message || "Failed to fetch subcategories.");
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while fetching subcategories."
      );
    } finally {
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const base64Images = await Promise.all(
      files.map((file) => convertFileToBase64(file))
    );

    setImages(base64Images);
  };

  const handleFeaturedToggle = () => {
    setFeatured((prev) => !prev); // Toggle the featured state
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setCategory(selectedCategoryId);
    fetchSubCategories(selectedCategoryId);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setSubCategories((prev) => {
      const updatedSubCategories = checked
        ? [...new Set([...prev, value])]
        : prev.filter((id) => id !== value);
      return updatedSubCategories;
    });
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { qty: 0, price: 0 }]);
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleAddDetails = () => {
    setDetails([...details, { name: "", value: "" }]);
  };

  const handleRemoveDetails = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { name: "" }]);
  };

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleProductCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createProduct(
        images,
        sizes,
        discount,
        name,
        description,
        longDescription,
        brand,
        details,
        questions,
        category,
        subCategories,
        benefits,
        ingredients,
        parent,
        featured
      );

      if (result.success) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while creating the product.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form
        onSubmit={handleProductCreateSubmit}
        className="w-full flex flex-col justify-center items-start"
      >
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategories */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subcategories
          </label>
          <div className="mt-1">
            {availableSubCategories.map((subcat, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subcat._id}
                  checked={subCategories.includes(subcat._id)}
                  onChange={handleSubCategoryChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor={subcat._id} className="text-sm text-gray-700">
                  {subcat.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sizes
          </label>
          {sizes.map((size, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="number"
                value={size.qty}
                onChange={(e) => handleSizeChange(index, "qty", e.target.value)}
                placeholder="Quantity"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
              <input
                type="number"
                value={size.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
                placeholder="Price"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveSize(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSize}
            className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
          >
            Add Size
          </button>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Details
          </label>
          {details.map((detail, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={detail.name}
                onChange={(e) =>
                  setDetails([
                    ...details.slice(0, index),
                    { ...detail, name: e.target.value },
                    ...details.slice(index + 1),
                  ])
                }
                placeholder="Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                value={detail.value}
                onChange={(e) =>
                  setDetails([
                    ...details.slice(0, index),
                    { ...detail, value: e.target.value },
                    ...details.slice(index + 1),
                  ])
                }
                placeholder="Value"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveDetails(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDetails}
            className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
          >
            Add Detail
          </button>
        </div>

        {/* benifits */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Benefits
          </label>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={benefit.name}
                onChange={(e) =>
                  setBenefits([
                    ...benefits.slice(0, index),
                    { ...benefit, name: e.target.value },
                    ...benefits.slice(index + 1),
                  ])
                }
                placeholder="Benefit Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveBenefit(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddBenefit}
            className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
          >
            Add Benefit
          </button>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  setIngredients([
                    ...ingredients.slice(0, index),
                    { ...ingredient, name: e.target.value },
                    ...ingredients.slice(index + 1),
                  ])
                }
                placeholder="Ingredient Name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
          >
            Add Ingredient
          </button>
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Questions
          </label>
          {questions.map((q, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  setQuestions([
                    ...questions.slice(0, index),
                    { ...q, question: e.target.value },
                    ...questions.slice(index + 1),
                  ])
                }
                placeholder="Question"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                value={q.answer}
                onChange={(e) =>
                  setQuestions([
                    ...questions.slice(0, index),
                    { ...q, answer: e.target.value },
                    ...questions.slice(index + 1),
                  ])
                }
                placeholder="Answer"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
          >
            Add Question
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Long Description
          </label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* featured */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured
          </label>
          <div className="flex items-center space-x-3">
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleFeaturedToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                featured ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  featured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

            {/* State Indicator */}
            <span className="text-sm font-medium text-gray-700">
              {featured ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />

          {/* Previews */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="w-24 h-24">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Uploaded Images */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {images.map((url, index) => (
              <div key={index} className="w-24 h-24">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
