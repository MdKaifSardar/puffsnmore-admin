"use client";

import ProductTable from "@/components/admin/dashboard/Products/ProductDisplayTable";
import { getAllProducts } from "@/lib/database/actions/admin/products/products.actions";
import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // import styles for toast notifications

const AllProductsPage = () => {
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response && Array.isArray(response)) {
          setProducts(response);
          toast.success("Products fetched successfully!"); // Success notification
        } else {
          toast.error("No products found."); // Error notification
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to fetch products!"); // Error notification
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    console.log("All Products: ", products);
  }, [products]);

  return (
    <div className="w-[90%] flex flex-col justify-center items-center ">
      <div className="mb-[1rem] titleStyle">All Products</div>
      {Array.isArray(products) && products.length > 0 ? (
        <ProductTable products={products} /> // Pass products to ProductTable
      ) : (
        <p>No Products Found!!!</p>
      )}
    </div>
  );
};

export default AllProductsPage;
