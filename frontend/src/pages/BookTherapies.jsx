import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { SyncLoader } from "react-spinners";

const BookTherapies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [therapy, setTherapy] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // Fetch therapy
  useEffect(() => {
    async function fetchTherapy() {
      try {
        const res = await axios.get(`http://localhost:8000/therapy/${id}`);
        setTherapy(res.data.therapy);
      } catch (err) {
        toast.error("Failed to load therapy details");
      } finally {
        setLoading(false);
      }
    }
    fetchTherapy();
  }, [id]);

  // Fetch doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await axios.get("http://localhost:8000/user/doctors", {
          withCredentials: true,
        });
        setDoctors(res.data.doctors || []);
      } catch (err) {
        toast.error("Failed to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, []);

  async function handleBooking(e) {
    e.preventDefault();

    if (!selectedDoctor) {
      toast.error("Please select a doctor.");
      return;
    }

    setIsBooking(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/bookings",
        {
          therapyId: therapy._id,
          doctorId: selectedDoctor,
          notes,
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Therapy booked successfully!");
        navigate("/therapies");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed!");
    } finally {
      setIsBooking(false);
    }
  }

  // Loading screens
  if (loading || loadingDoctors) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 p-4 text-center">
        <SyncLoader color="#14b8a6" size={12} />
        <p className="text-lg text-slate-700">
          {loading ? "Loading therapy details..." : "Loading doctors..."}
        </p>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <p className="text-lg text-red-600">Therapy not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-10 px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          Book Therapy
        </h1>

        <form onSubmit={handleBooking} className="space-y-4">
          {/* Therapy Name */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Therapy Name
            </label>
            <input
              type="text"
              value={therapy.name}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Duration (days)
            </label>
            <input
              type="text"
              value={therapy.duration}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Price (₹)
            </label>
            <input
              type="text"
              value={therapy.price}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Select Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">-- Choose a Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.fullname} ({doc.specialization}, {doc.qualification},{" "}
                  {doc.experience} yrs)
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special request or health condition"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isBooking}
            className={`w-full flex justify-center items-center gap-2 bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition ${
              isBooking ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isBooking ? (
              <>
                <SyncLoader color="white" size={8} />
                Booking...
              </>
            ) : (
              "Book Therapy"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTherapies;
