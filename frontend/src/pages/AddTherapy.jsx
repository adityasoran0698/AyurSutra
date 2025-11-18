import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const AddTherapyPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://ayursutra-2-tl11.onrender.com/therapies/add-therapy",

        data,
        {
          withCredentials: true, // needed if auth cookies are used
        }
      );
      toast.success(response.data.message);
      reset(); // clear form after submit
    } catch (error) {
      console.error(error);
      toast.error("Failed to add therapy");
    }
  };

  return (
    <div className="min-h-screen w-[60vh] p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Add New Therapy
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Therapy Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter therapy name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter therapy description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block font-medium mb-1">Duration (Days)</label>
            <input
              type="number"
              {...register("duration", {
                required: "Duration is required",
                min: {
                  value: 1,
                  message: "Duration must be at least 1 Day",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter duration in minutes"
            />
            {errors.duration && (
              <p className="text-red-600 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Price must be at least 1 ₹" },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Add Therapy
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTherapyPage;
