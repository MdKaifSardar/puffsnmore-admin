"use client";

import ProductRow from "../SingleProductRow";

const ProductTable = ({ products }: { products: any[] }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-300">
        {/* Table Head */}
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Product ID</th>
            <th className="px-4 py-2 border">Product Name</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Sizes</th>
            <th className="px-4 py-2 border">Vendor</th>
            <th className="px-4 py-2 border">Featured</th>
            <th className="px-4 py-2 border">View</th>
            <th className="px-4 py-2 border">Edit</th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {products.map((product, index) => (
            <ProductRow key={product._id} product={product} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
