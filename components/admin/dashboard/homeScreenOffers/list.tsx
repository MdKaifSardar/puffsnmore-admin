import React from "react";
import HomeScreenOfferListItem from "./list.item";

const ListHomeScreenOffers = ({
  homeScreenOffers,
  setHomeScreenOffers,
}: {
  homeScreenOffers: any;
  setHomeScreenOffers: any;
}) => {
  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-[.5rem]">
      {typeof homeScreenOffers !== "undefined" &&
        homeScreenOffers?.map((offer: any) => (
          <HomeScreenOfferListItem
            offer={offer}
            key={offer._id}
            setOffers={setHomeScreenOffers}
          />
        ))}
    </div>
  );
};

export default ListHomeScreenOffers;
