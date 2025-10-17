import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [role, setRole] = useState("patient"); // Default role is patient
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://https://ayursutra-panchakarma.onrender.com//user/login",
        { ...data, role },
        { withCredentials: true }
      );
      toast.success(response.data);
      {
        role === "patient"
          ? navigate("/patient-dashboard")
          : navigate("/doctor-dashboard");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data);
      reset();
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[60vh] shadow-black">
        {/* Role Switch Tabs */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`w-1/2 py-2 font-semibold rounded-l-lg transition ${
              role === "patient"
                ? "bg-teal-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Login as Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`w-1/2 py-2 font-semibold rounded-r-lg transition ${
              role === "doctor"
                ? "bg-teal-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Login as Doctor
          </button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold text-teal-700 text-center mb-4">
            {role === "patient" ? "Patient Login" : "Doctor Login"}
          </h2>

          {/* Email */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Login
          </button>

          {/* Redirect to Register */}
          <div>
            <p className="text-sm text-slate-600 text-center">
              Don't have an account?{" "}
              <a href="/register" className="text-teal-600 hover:underline">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
