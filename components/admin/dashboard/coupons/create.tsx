import { useEffect, useState } from "react";
import { createCoupon } from "@/lib/database/actions/admin/coupon/coupon.actions";
import { getAdminCookiesandFetchAdmin } from "@/lib/database/actions/admin/admin.actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCoupon = ({ setCoupons }: { setCoupons: any }) => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const res = await getAdminCookiesandFetchAdmin();
        if (res.success) setVendor(res.admin);
      } catch (error) {
        toast.error("Error fetching vendor details!");
      }
    };
    fetchVendorDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !discount || !startDate || !endDate) {
      toast.error("All fields are required!");
      return;
    }
    if (name.length < 5 || name.length > 10) {
      toast.error("Coupon name must be between 5 to 10 characters.");
      return;
    }
    if (discount < 1 || discount > 99) {
      toast.error("Discount must be between 1% to 99%.");
      return;
    }
    if (startDate.getTime() === endDate.getTime()) {
      toast.error("You can't pick the same dates!");
      return;
    }
    if (endDate.getTime() < startDate.getTime()) {
      toast.error("Start Date cannot be later than End Date!");
      return;
    }

    setLoading(true);
    try {
      const res = await createCoupon(name, discount, startDate, endDate);
      if (res?.success) {
        setCoupons(res?.coupon);
        setName("");
        setDiscount(0);
        setStartDate(null);
        setEndDate(null);
        toast.success(res?.message);
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-fit px-4 sm:px-6 lg:px-8">
      {loading && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="text-white">Loading...</div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col justify-center p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Create a Coupon</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Coupon Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Coupon name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Discount (%)
          </label>
          <input
            type="number"
            min={1}
            max={99}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="mx-auto w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
