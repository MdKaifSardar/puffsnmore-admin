import React from "react";
import SubCategoryListItem from "./list.item";

type Props = {
  categories: any;
  setSubCategories: (subCategories: any) => void;
  subCategories: any;
};

const ListAllSubCategories: React.FC<Props> = ({
  subCategories,
  categories,
  setSubCategories,
}) => {
  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-[.5rem]">
      {categories &&
        subCategories?.map((subCategory: any) => (
          <SubCategoryListItem
            categories={categories}
            subCategory={subCategory}
            key={subCategory._id}
            setSubCategories={setSubCategories}
          />
        ))}
    </div>
  );
};

export default ListAllSubCategories;
