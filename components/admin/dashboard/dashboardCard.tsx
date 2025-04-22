"use client";
import { GiTakeMyMoney } from "react-icons/gi";
import { SiProducthunt } from "react-icons/si";
import { SlHandbag } from "react-icons/sl";
import React from "react";

const DashboardCard = ({ data }: { data: any }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className={"titleStyle"}>Dashboard</div>
      <div className="w-full flex flex-wrap justify-center gap-4 md:gap-8">
        <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] shadow-2xl bg-green-400 flex flex-col justify-center items-center rounded-3xl text-center">
          <SlHandbag size={35} />
          <span className="text-sm md:text-base">+ {data.orders.length} Total Orders</span>
        </div>
        <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] shadow-2xl bg-orange-400 flex flex-col justify-center items-center rounded-3xl text-center">
          <SiProducthunt size={35} />
          <span className="text-sm md:text-base">+ {data.products.length} Total Products</span>
        </div>
        <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] shadow-2xl bg-pink-400 flex flex-col justify-center items-center rounded-3xl text-center">
          <GiTakeMyMoney size={35} />
          <div className="text-sm md:text-base">
            + ${data.orders.reduce((a: any, val: any) => a + val.total, 0)}{" "}
            <span>
              - ${" "}
              {data.orders
                .filter((o: any) => !o.isPaid)
                .reduce((a: any, val: any) => a + val.total, 0)
                .toFixed(2)}{" "}
              Unpaid yet.
            </span>
            Total Earnings.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
