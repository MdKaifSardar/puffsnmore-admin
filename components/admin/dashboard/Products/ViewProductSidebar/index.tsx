// components/ProductViewModal.tsx

"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

const ProductViewModal: FC<{
  productDetails: any;
  closeSidebar: () => void;
}> = ({ productDetails, closeSidebar }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 right-0 w-full lg:w-1/2 h-full bg-white shadow-lg z-50 p-4 overflow-auto"
    >
      <button
        onClick={closeSidebar}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        X
      </button>

      {productDetails ? (
        <div>
          <h2 className="text-xl font-semibold">{productDetails.name}</h2>
          <p className="text-sm text-gray-500">{productDetails.description}</p>
          <p className="mt-4">
            <strong>Price:</strong> ₹{productDetails.price}
          </p>
          <p className="mt-4">
            <strong>Category:</strong> {productDetails.category?.name}
          </p>
          <p className="mt-4">
            <strong>Brand:</strong> {productDetails.brand}
          </p>
          <p className="mt-4">
            <strong>Color:</strong> {productDetails.color}
          </p>
          <p className="mt-4">
            <strong>Size:</strong> {productDetails.size}
          </p>
          <div className="mt-4">
            <strong>Images:</strong>
            <div className="flex space-x-2">
              {productDetails.images?.map((image: string, idx: number) => (
                <Image
                  key={idx}
                  src={image}
                  width={300}
                  height={300}
                  alt="Product Image"
                  className="w-16 h-16 rounded-md"
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </motion.div>
  );
};

export default ProductViewModal;
