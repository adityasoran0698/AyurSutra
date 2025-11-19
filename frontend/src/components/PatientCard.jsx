import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ImprovementChart from "./improvmentChart";
import axios from "axios";
import { toast } from "react-toastify";

const PatientCard = ({
  patient,
  bookings,
  handleUpdateSession,
  processing,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/bookings/delete/${bookingId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error deleting booking");
    }
  };

  return (
    <>
      {/* CARD HEADER */}
      <div
        onClick={() => setOpenDialog(true)}
        className="border rounded-xl mb-4 bg-white shadow p-4 cursor-pointer hover:bg-slate-50"
      >
        <div className="text-lg font-semibold">{patient.fullname}</div>
        <div className="text-sm text-slate-500">
          {bookings.length} booking{bookings.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* FULL SCREEN DIALOG */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white w-full h-full md:w-[80%] md:h-[90%] md:rounded-xl shadow-xl overflow-y-scroll">
            {/* DIALOG HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">{patient.fullname}</h2>

              <button
                onClick={() => setOpenDialog(false)}
                className="p-2 bg-slate-200 rounded-full"
              >
                <X className="text-slate-700" />
              </button>
            </div>

            {/* DIALOG CONTENT */}
            <div className="p-4 space-y-6">
              {bookings.map((b) => {
                const sessions = b.sessions || [];
                const completed = sessions.filter(
                  (s) => s.status === "completed"
                ).length;
                const scheduled = sessions.filter(
                  (s) => s.status === "scheduled"
                ).length;
                const missed = sessions.filter(
                  (s) => s.status === "missed"
                ).length;

                const pieData = [
                  { name: "Completed", value: completed },
                  { name: "Scheduled", value: scheduled },
                  { name: "Missed", value: missed },
                ];

                return (
                  <div
                    key={b._id}
                    className="border rounded-xl p-4 bg-slate-50 shadow-sm"
                  >
                    {/* BOOKING HEADER */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                      <div className="text-md font-semibold">
                        {b.therapyId?.name}
                      </div>

                      <div className="text-sm">
                        Progress: {b.progress?.completedSessions || 0}/
                        {b.progress?.totalSessions || 0}
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        className="text-sm bg-amber-700 text-white px-3 py-1 rounded"
                      >
                        Delete Booking
                      </button>
                    </div>

                    {/* CHART SECTION */}
                    <div className="mt-3 flex flex-col md:flex-row gap-6 w-full">
                      {/* PIE CHART */}
                      <div className="md:w-1/3 w-full bg-white border rounded-xl shadow-sm p-4 h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={70}
                              label
                            >
                              {pieData.map((entry, idx) => (
                                <Cell
                                  key={idx}
                                  fill={["#22c55e", "#f59e0b", "#ef4444"][idx]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* IMPROVEMENT CHART */}
                      <div className="md:w-2/3 w-full">
                        <ImprovementChart
                          sessions={sessions}
                          title="Patient Progress"
                        />
                      </div>
                    </div>

                    {/* SESSION CARDS */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {sessions.map((s, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded border text-sm ${
                            s.status === "completed"
                              ? "bg-green-50 border-green-300"
                              : s.status === "missed"
                              ? "bg-red-50 border-red-300"
                              : "bg-white"
                          }`}
                        >
                          <div>
                            <div className="font-medium">
                              {new Date(s.sessionDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-600">
                              {s.status}
                            </div>
                          </div>

                          {/* BUTTONS */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            <button
                              onClick={() =>
                                handleUpdateSession(
                                  b._id,
                                  i,
                                  s.status === "completed"
                                    ? "scheduled"
                                    : "completed"
                                )
                              }
                              className={`text-xs px-2 py-1 rounded ${
                                s.status === "completed"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-green-600 text-white"
                              }`}
                            >
                              {s.status === "completed" ? "Undo" : "Complete"}
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateSession(
                                  b._id,
                                  i,
                                  s.status === "missed" ? "scheduled" : "missed"
                                )
                              }
                              className={`text-xs px-2 py-1 rounded ${
                                s.status === "missed"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {s.status === "missed" ? "Undo" : "Missed"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientCard;
