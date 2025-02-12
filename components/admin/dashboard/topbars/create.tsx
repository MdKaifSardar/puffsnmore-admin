import { createTopBar } from "@/lib/database/actions/admin/topbar/topbar.actions";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTopBar = ({ setTopBar }: { setTopBar: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [btnText, setBtnText] = useState<string>("");
  const [btnColor, setBtnColor] = useState<string>("");
  const [btnLink, setBtnLink] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.length < 5) {
      toast.error("TopBar name must be at least 5 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await createTopBar(name, color, btnText, btnColor, btnLink); // Call the createTopBar function

      if (res?.success) {
        setTopBar(res.topbars); // Update the topbars state with the response data
        setName("");
        setColor("");
        setBtnText("");
        setBtnColor("");
        setBtnLink("");
        toast.success(res.message); // Show success message
      } else {
        toast.error(res?.message || "Something went wrong!"); // Handle error message
      }
    } catch (error) {
      toast.error("Error: " + error); // Handle unexpected errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-fit">
      {loading && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="text-white">Loading...</div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Create a TopBar</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            TopBar Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="TopBar text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ backgroundColor: color }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Button Text
          </label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Button text"
            value={btnText}
            onChange={(e) => setBtnText(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Button Color
          </label>
          <input
            type="color"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={btnColor}
            onChange={(e) => setBtnColor(e.target.value)}
            style={{ backgroundColor: btnColor }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Button Link
          </label>
          <input
            type="url"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Button link"
            value={btnLink}
            onChange={(e) => setBtnLink(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mx-auto w-fit py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Add TopBar
        </button>
      </form>
    </div>
  );
};

export default CreateTopBar;
