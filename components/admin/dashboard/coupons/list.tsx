import React from "react";
import CouponListItem from "./list.item";

const ListAllVendorCoupons = ({
  coupons,
  setCoupons,
}: {
  coupons: any;
  setCoupons: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-[.5rem]">
      {coupons?.map((coupon: any) => (
        <CouponListItem
          coupon={coupon}
          key={coupon._id}
          setCoupons={setCoupons}
        />
      ))}
    </div>
  );
};

export default ListAllVendorCoupons;
