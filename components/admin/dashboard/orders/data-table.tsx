"use client";
import * as React from "react";
import PropTypes from "prop-types";

import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import {
  updateOrdertoOldOrder,
  updateProductOrderStatus,
} from "@/lib/database/actions/admin/orders/orders.actions";

const options = [
  { value: "Not Processed", text: "Not Processed" },
  { value: "Processing", text: "Processing" },
  { value: "Dispatched", text: "Dispatched" },
  { value: "Cancelled", text: "Cancelled" },
  { value: "Completed", text: "Completed" },
];

function Row(props: any) {
  const router = useRouter();

  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);
  const handleChange = async (e: any, productId: string, orderId: string) => {
    await updateProductOrderStatus(orderId, productId, e.target.value)
      .then((res) => {
        alert(res?.message ? res.message : "----");
        router.refresh();
      })
      .catch((err) => console.log(err));
  };

  const changeOrdertoOld = async (id: string) => {
    await updateOrdertoOldOrder(id)
      .then((res) => {
        alert(res?.message ? res.message : "");
        router.refresh();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <tr className="border-b">
        <td className="p-2">
          <button
            aria-label="expand row"
            className="text-sm p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <span className="material-icons">keyboard_arrow_up</span>
            ) : (
              <span className="material-icons">keyboard_arrow_down</span>
            )}
          </button>
        </td>
        <td className="font-bold">{row._id}</td>
        <td>{row.isNew ? "New Order" : "-"}</td>
        <td className="text-right">{row.paymentMethod}</td>
        <td className="text-left">
          {row.isPaid ? (
            <FaCheckCircle size={23} color="green" />
          ) : (
            <IoIosCloseCircle size={25} color="red" />
          )}
        </td>
        <td className="text-right">{row.couponApplied || "-"}</td>
        <td className="text-right font-bold">Rs. {row.total}</td>
      </tr>

      <tr>
        <td colSpan={6} className="px-0 py-0">
          <div
            className={`collapse ${open ? "block" : "hidden"}`}
            style={{ margin: "1rem" }}
          >
            <h2 className="text-xl font-semibold">Order for</h2>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th></th>
                  <th>Change Order</th>
                  <th>Email</th>
                  <th className="text-right">Shipping Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img
                      src={row.user.image}
                      className="rounded-full w-20 h-20 object-cover"
                      alt="User"
                    />
                  </td>
                  <td>
                    {row.isNew ? (
                      <div>
                        <span>I checked this order, change order to old</span>
                        <button
                          className="btn mt-2 bg-blue-500 text-white py-1 px-4 rounded"
                          onClick={() => changeOrdertoOld(row._id)}
                        >
                          Check
                        </button>
                      </div>
                    ) : (
                      <div>This is Old order</div>
                    )}
                  </td>
                  <td>{row.user.email}</td>
                  <td className="text-right">
                    {row.shippingAddress.firstName}{" "}
                    {row.shippingAddress.lastName} <br />
                    {row.shippingAddress.address1} <br />
                    {row.shippingAddress.address2} <br />
                    {row.shippingAddress.state}, {row.shippingAddress.city}{" "}
                    <br />
                    {row.shippingAddress.country} <br />
                    {row.shippingAddress.zipCode} <br />
                    {row.shippingAddress.phoneNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>

      <tr>
        <td colSpan={6} className="px-0 py-0">
          <div
            className={`collapse ${open ? "block" : "hidden"}`}
            style={{ margin: "1rem" }}
          >
            <h2 className="text-xl font-semibold">Order items</h2>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  {/* <th>Vendor Id</th> */}
                </tr>
              </thead>
              <tbody>
                {row.products.map((p: any) => (
                  <tr key={p._id}>
                    {/* <td>
                      <div className="relative inline-block">
                        <img src={p.image} alt={p.name} className="w-24 h-24" />
                        {p.vendor && (
                          <div className="absolute top-0 right-0 bg-[#EB4F0C] text-white text-xs p-1">
                            {p.vendor.name}
                          </div>
                        )}
                      </div>
                    </td> */}
                    <td>{p.name}</td>
                    <td>{p.size}</td>
                    <td>x{p.qty}</td>
                    <td>₹ {p.price}</td>
                    <td>
                      <span
                        className={`py-1 px-2 text-white rounded ${
                          p.status === "Not Processed"
                            ? "bg-[#e6554191]"
                            : p.status === "Processing"
                            ? "bg-[#54b7d3]"
                            : p.status === "Dispatched"
                            ? "bg-[#1e91cf]"
                            : p.status === "Cancelled"
                            ? "bg-[#e3d4d4]"
                            : p.status === "Completed"
                            ? "bg-[#4cb64c]"
                            : p.status === "Processing Refund"
                            ? "bg-red-500"
                            : ""
                        }`}
                      >
                        {p.status}
                      </span>
                      <select
                        className="mt-2 border border-gray-300 p-1"
                        value={p.status}
                        onChange={(e) => handleChange(e, p._id, row._id)}
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.text}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* <td>{p.vendor ? p.vendor._id : "-"}</td> */}
                  </tr>
                ))}

                <tr key={row._id}>
                  <td className="font-bold">TOTAL</td>
                  <td colSpan={5}></td>
                  <td className="text-left font-bold text-xl">₹ {row.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </div>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    order: PropTypes.number.isRequired,
    payment_method: PropTypes.string.isRequired,
    paid: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    coupon: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    user: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        shippingAddress: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function AllOrdersTable({
  rows,
  range,
  setRange,
  isPaid,
  setIsPaid,
  paymentMethod,
  setPaymentMethod,
}: {
  rows: any[];
  range?: any;
  setRange?: any;
  isPaid?: any;
  setIsPaid?: any;
  paymentMethod?: any;
  setPaymentMethod?: any;
}) {
  const [searchOrderText, setSearchOrderText] = React.useState<string>("");
  const [filteredRowsByText, setFilteredRowsByText] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (searchOrderText.length === 24) {
      const filteredRows = rows?.filter(
        (item) => item._id.toString() === searchOrderText.toString()
      );
      setFilteredRowsByText(filteredRows);
    } else {
      setFilteredRowsByText([]);
    }
  }, [searchOrderText, rows]);

  return (
    <>
      <div className="">
        <h1 className="text-black font-bold text-2xl">
          Total Orders - {rows?.length}
        </h1>
        <div className="p-4">
          <div className="flex gap-[10px]">
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-700">
                Search Order By ID
              </label>
              <input
                type="text"
                value={searchOrderText}
                onChange={(e) => setSearchOrderText(e.target.value)}
                className="p-2 mt-2 border border-gray-300 rounded-md bg-gray-100"
                placeholder="Enter order ID"
              />
            </div>

            <div className="flex flex-col w-1/4">
              <label className="text-sm text-gray-700">Order Range</label>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="p-2 mt-2 border border-gray-300 rounded-md bg-gray-100"
              >
                <option value="all">All Orders</option>
                <option value="today">Today</option>
                <option value="today_and_yesterday">Today and Yesterday</option>
                <option value="2d">Last 2 Days</option>
                <option value="7d">Last 7 Days</option>
                <option value="15d">Last 15 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="2m">Last 2 Months</option>
                <option value="5m">Last 5 Months</option>
                <option value="10m">Last 10 Months</option>
                <option value="12m">Last 12 Months</option>
              </select>
            </div>

            <div className="flex flex-col w-1/4">
              <label className="text-sm text-gray-700">
                Order Payment Status
              </label>
              <select
                value={isPaid}
                onChange={(e) => setIsPaid(e.target.value)}
                className="p-2 mt-2 border border-gray-300 rounded-md bg-gray-100"
              >
                <option value="-">Order Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unPaid">Not Paid</option>
              </select>
            </div>

            <div className="flex flex-col w-1/4">
              <label className="text-sm text-gray-700">
                Order Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="p-2 mt-2 border border-gray-300 rounded-md bg-gray-100"
              >
                <option value="-">Order Payment Method</option>
                <option value="cash">COD</option>
                <option value="RazorPay">RazorPay</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center px-5 py-3 bg-blue-600 text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">Orders</h2>
          </div>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#006081] text-white">
                <th className="p-2"></th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">New</th>
                <th className="p-2 text-right">Payment Method</th>
                <th className="p-2 text-right">Paid</th>
                <th className="p-2 text-right">Coupon</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(searchOrderText.length === 24 ? filteredRowsByText : rows)?.map(
                (row) => (
                  <tr key={row._id} className="border-b">
                    <td className="p-2"></td>
                    <td className="p-2 text-left">
                      <b className="text-base">{row.order}</b>
                    </td>
                    <td className="p-2 text-left">{row.new ? "Yes" : "No"}</td>
                    <td className="p-2 text-right">{row.paymentMethod}</td>
                    <td className="p-2 text-right">
                      {row.paid ? "Yes" : "No"}
                    </td>
                    <td className="p-2 text-right">
                      {row.coupon ? "Yes" : "No"}
                    </td>
                    <td className="p-2 text-right">{row.total}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
