import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Therapies = () => {
  const [therapies, setTherapies] = useState([]);
  const [filteredTherapies, setFilteredTherapies] = useState([]);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch therapies and user data
  useEffect(() => {
    const fetchTherapies = async () => {
      try {
        const res = await axios.get(
          "https://ayursutra-2-tl11.onrender.com/therapy"
        );
        setTherapies(res.data.therapies);
        setFilteredTherapies(res.data.therapies);
      } catch (err) {
        toast.error("Failed to fetch therapies: " + (err.message || err));
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://ayursutra-2-tl11.onrender.com/user/me",
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    fetchTherapies();
    fetchUser();
  }, []);

  // Filter therapies by search query
  useEffect(() => {
    setFilteredTherapies(
      therapies.filter((therapy) =>
        therapy.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, therapies]);

  return (
    <div className="min-h-screen py-16 px-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-teal-700">
          Panchakarma Therapies
        </h1>
        <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
          Explore Ayurvedic therapies designed for detoxification, rejuvenation,
          and holistic healing.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search therapies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-slate-300 bg-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:font-medium"
        />
      </div>

      {/* Therapies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTherapies.map((therapy) => (
          <div
            key={therapy._id}
            className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-amber-700 mb-2">
              {therapy.name}
            </h2>
            <p className="text-slate-600 mb-4">{therapy.description}</p>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-semibold">Duration:</span>{" "}
              {therapy.duration} days
            </p>
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-semibold">Price:</span> ₹{therapy.price}
            </p>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setSelectedTherapy(therapy)}
                className="text-teal-600 font-medium hover:underline"
              >
                Learn More
              </button>

              {user?.role === "patient" && (
                <button
                  onClick={() => navigate(`/book-therapies/${therapy._id}`)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Therapy Modal */}
      {selectedTherapy && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative border-t-4 border-teal-600">
            <button
              onClick={() => setSelectedTherapy(null)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-amber-700 mb-4">
              {selectedTherapy.name}
            </h2>
            <p className="text-slate-700 mb-4">{selectedTherapy.description}</p>
            <p className="mb-2">
              <span className="font-semibold">Duration:</span>{" "}
              {selectedTherapy.duration} days
            </p>
            <p className="mb-2">
              <span className="font-semibold">Price:</span> ₹
              {selectedTherapy.price}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Therapies;
