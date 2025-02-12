"use client";
import { useState } from "react";
import { FaEdit, FaSearchPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { getSingleProductById } from "@/lib/database/actions/admin/products/products.actions";
import ProductViewModal from "../ViewProductSidebar";

const ProductRow = ({ product, index }: { product: any; index: number }) => {
  const [editProduct, setEditProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);

  // Function to handle product deletion
  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      console.log(`Deleting product: ${productId}`);
      // Implement delete API call
    }
  };

  // Fetch product details for the sidebar view
  const handleView = async (productId: string) => {
    try {
      const response = await getSingleProductById(productId);
      if (response && response.success) {
        console.log(response);
        setProductDetails(response);
        setIsSidebarOpen(true); // Open the sidebar
      } else {
        toast.error("Product details not found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product details.");
    }
  };

  const subProduct = product.subProducts?.[0] || {};
  const sizes = subProduct.sizes || [];

  return (
    <>
      <tr key={product._id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-2 border">{index + 1}</td>

        {/* Product Image */}
        <td className="px-4 py-2 border">
          <img
            src={subProduct.images?.[0]?.url || "/placeholder.png"}
            alt="product"
            className="w-12 h-12 rounded-full"
          />
        </td>

        <td className="px-4 py-2 border">{product._id}</td>
        <td className="px-4 py-2 border">{product.name}</td>
        <td className="px-4 py-2 border">{product.category?.name || "-"}</td>

        {/* Price & Sizes */}
        <td className="px-4 py-2 border">
          {sizes
            .map((size: any) => `${size.size}: ₹${size.price}`)
            .join(", ") || "-"}
        </td>
        <td className="px-4 py-2 border">
          {sizes.map((size: any) => size.size).join(", ") || "-"}
        </td>

        <td className="px-4 py-2 border">{product.vendor?.name || "-"}</td>

        {/* View Button */}
        <td className="px-4 py-2 border text-center">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleView(product._id)}
          >
            <FaSearchPlus size={18} />
          </button>
        </td>

        {/* Edit Button */}
        <td className="px-4 py-2 border text-center">
          <button
            className="text-green-600 hover:text-green-800"
            onClick={() => setEditProduct(product)}
          >
            <FaEdit size={18} />
          </button>
        </td>

        {/* Delete Button */}
        <td className="px-4 py-2 border text-center">
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(product._id)}
          >
            <RiDeleteBin6Fill size={18} />
          </button>
        </td>
      </tr>

      {/* Sidebar for Product Details */}
      {isSidebarOpen && (
        <ProductViewModal
          productDetails={productDetails}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default ProductRow;
