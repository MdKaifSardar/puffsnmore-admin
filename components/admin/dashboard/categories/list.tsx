import React from "react";
import CategoryListItem from "./list.item";

const ListAllCategories = ({
  categories,
  setCategories,
}: {
  categories: any;
  setCategories: any;
}) => {
  return (
    <div className="w-full h-fit flex gap-[.5rem] flex-col justify-center items-center">
      {typeof categories !== "undefined" &&
        categories?.map((category: any) => (
          <CategoryListItem
            category={category}
            key={category._id}
            setCategories={setCategories}
          />
        ))}
    </div>
  );
};

export default ListAllCategories;
