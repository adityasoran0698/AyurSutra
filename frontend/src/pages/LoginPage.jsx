// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { SyncLoader } from "react-spinners";

const LoginPage = () => {
  const [role, setRole] = useState("patient"); // Default role
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/user/login",
        { ...data, role },
        { withCredentials: true }
      );

      toast.success(response.data);

      if (role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }

      // Reload to ensure app state updates (you used this previously)
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data || "Login failed!");
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  items-center justify-center px-4 py-8">
      <div
        className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-md md:w-[60vh] md:max-w-none"
        role="region"
        aria-labelledby="login-heading"
      >
        <h2
          id="login-heading"
          className="text-xl sm:text-2xl font-bold text-teal-700 text-center mb-5"
        >
          {role === "patient" ? "Patient Login" : "Doctor Login"}
        </h2>
        {/* Role Switch Tabs */}
        <div className="flex flex-col sm:flex-row justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole("patient")}
            aria-pressed={role === "patient"}
            className={`w-full sm:w-1/2 py-2 font-medium transition text-sm sm:font-semibold sm:text-lg
              ${
                role === "patient"
                  ? "bg-teal-600 text-white rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-b-lg sm:rounded-r-none sm:rounded-l-none"
              }`}
          >
            Login as Patient
          </button>

          <button
            type="button"
            onClick={() => setRole("doctor")}
            aria-pressed={role === "doctor"}
            className={`w-full sm:w-1/2 py-2 font-medium transition mt-2 text-sm sm:mt-0 sm:text-lg
              ${
                role === "doctor"
                  ? "bg-teal-600 text-white rounded-b-lg sm:rounded-r-lg sm:rounded-t-none"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-t-lg sm:rounded-l-none sm:rounded-r-none"
              }`}
          >
            Login as Doctor
          </button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-slate-700 font-medium mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
              placeholder="Enter your email"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p role="alert" className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-slate-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
              placeholder="Enter your password"
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p role="alert" className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition text-sm sm:text-base flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span>Logging in</span>
                <SyncLoader color="white" size={8} />
              </div>
            ) : (
              "Login"
            )}
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
