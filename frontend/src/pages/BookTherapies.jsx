import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BookTherapies = () => {
  const { id } = useParams(); // Therapy id from URL
  const navigate = useNavigate();

  const [therapy, setTherapy] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch therapy details
  useEffect(() => {
    async function fetchTherapy() {
      try {
        const res = await fetch(
          `https://ayursutra-panchakarma.onrender.com//therapy/${id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTherapy(data.therapy);
        }
      } catch (err) {
        console.error("Error fetching therapy:", err);
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
        const res = await fetch(
          "https://ayursutra-panchakarma.onrender.com//user/doctors"
        );
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    }
    fetchDoctors();
  }, []);

  async function handleBooking(e) {
    e.preventDefault();

    if (!selectedDoctor) {
      toast.error("Please select a doctor before booking.");
      return;
    }

    try {
      const response = await axios.post(
        "https://ayursutra-panchakarma.onrender.com//bookings",
        {
          therapyId: therapy._id,
          doctorId: selectedDoctor,
          notes,
        },
        {
          withCredentials: true, // ✅ If you are using cookies for auth
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Therapy booked successfully!");
        navigate("/therapies");
      }
    } catch (err) {
      console.error("Error booking therapy:", err);
      toast.error(
        err.response?.data?.message || "Booking failed! Please try again."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-slate-700">Loading therapy details...</p>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">Therapy not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen justify-center py-10 px-4 w-[75vh]">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full border border-slate-200">
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
            className="w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTherapies;
