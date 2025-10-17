import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api"; // ✅ centralized API import

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");
  const selectedRole = watch("role");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    try {
      // ✅ Use centralized API
      const response = await api.post("/user/register", data);
      toast.success(response.data);
      navigate("/"); // redirect to login
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen mt-5">
      <div className="shadow-xl rounded-xl p-8 w-[70vh] bg-white shadow-black">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullname", { required: "Full Name is required" })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter your full name"
            />
            {errors.fullname && (
              <p className="text-red-600 text-sm mt-1">
                {errors.fullname.message}
              </p>
            )}
          </div>

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

          {/* Phone */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-indigo-500 hover:text-indigo-700 text-sm cursor-pointer font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-indigo-500 hover:text-indigo-700 text-sm cursor-pointer font-medium"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Register As
            </label>
            <select
              {...register("role", { required: "Please select a role" })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">Select Role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Doctor Fields (conditional) */}
          {selectedRole === "doctor" && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-teal-600">
                Doctor Details
              </h3>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  {...register("specialization", {
                    required: "Specialization is required",
                  })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g. Panchakarma, Ayurveda"
                />
                {errors.specialization && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  {...register("qualification", {
                    required: "Qualification is required",
                  })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g. BAMS, MD"
                />
                {errors.qualification && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.qualification.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  {...register("experience", {
                    required: "Experience is required",
                    min: { value: 0, message: "Must be 0 or greater" },
                  })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g. 5"
                />
                {errors.experience && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Register
          </button>

          <p className="text-sm text-slate-600 text-center">
            Already have an Account?{" "}
            <a href="/login" className="text-teal-600 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
