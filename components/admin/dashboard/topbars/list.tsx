import React from "react";
import TopBarListItem from "./list.item";

const ListAllTopBars = ({
  topBars,
  setTopBars,
}: {
  topBars: any;
  setTopBars: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-[.5rem]">
      {topBars?.map((topBar: any) => (
        <TopBarListItem
          topBar={topBar}
          key={topBar._id}
          setTopBars={setTopBars}
        />
      ))}
    </div>
  );
};

export default ListAllTopBars;
