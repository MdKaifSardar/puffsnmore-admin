"use client";
import { registerAdmin } from "@/lib/database/actions/admin/auth/register";
import React, { useState } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify

type AdminRegistrationFormProps = {
  onSuccess: () => void;
  onFailure: (message: string) => void;
};

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({
  onSuccess,
  onFailure,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [loading, setLoading] = useState(false); // Local loading state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Simple validation function
  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid Email.";
    }
    if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters long.";
    }
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await registerAdmin(email, password);
      if (res?.success) {
        toast.success("Registration successful!"); // Success notification
        onSuccess();
      } else {
        toast.error(res?.message || "Registration failed."); // Error notification
        onFailure(res?.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("An error occurred while registering."); // Error notification
      onFailure("An error occurred while registering.");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center h-fit mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-[70%]">
        <span className="w-full text-[2rem] font-semibold font-sans text-left">
          Create New Admin
        </span>
        <div className="space-y-2">
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="password" className="block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="mx-auto w-fit mt-4 px-[2rem] py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AdminRegistrationForm;
