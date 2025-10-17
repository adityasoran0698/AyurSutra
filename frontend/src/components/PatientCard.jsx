// src/components/PatientCard.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const PatientCard = ({
  patient,
  bookings,
  handleAutoSchedule,
  handleUpdateNotes,
  handleUpdateSession,
  processing,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-xl mb-4 bg-white shadow">
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 overflow-hidden"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div>
          <div className="text-lg font-semibold">{patient.fullname}</div>
          <div className="text-sm text-slate-500">
            {bookings.length} booking{bookings.length > 1 ? "s" : ""}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="text-slate-600" />
        ) : (
          <ChevronDown className="text-slate-600" />
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {bookings.map((b) => {
            const sessions = b.sessions || [];

            // Toggle logic handled here for display
            const completedCount = sessions.filter(
              (s) => s.status === "completed"
            ).length;
            const scheduledCount = sessions.filter(
              (s) => s.status === "scheduled"
            ).length;
            const missedCount = sessions.filter(
              (s) => s.status === "missed"
            ).length;

            const pieData = [
              { name: "Completed", value: completedCount },
              { name: "Scheduled", value: scheduledCount },
              { name: "Missed", value: missedCount },
            ];

            return (
              <div
                key={b._id}
                className="border rounded-lg p-3 bg-slate-50 shadow-sm"
              >
                {/* Booking Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="text-md font-semibold">
                    {b.therapyId?.name}
                  </div>
                  <div className="text-sm">
                    Progress: {b.progress?.completedSessions || 0}/
                    {b.progress?.totalSessions || 0}
                  </div>
                  <button
                    onClick={() => handleAutoSchedule(b._id)}
                    disabled={processing}
                    className="px-3 py-1 bg-amber-500 text-white rounded"
                  >
                    Auto-Schedule
                  </button>
                </div>

                {/* Doctor Notes */}
                <textarea
                  defaultValue={b.doctorNotes || ""}
                  onBlur={(e) => handleUpdateNotes(b._id, e.target.value)}
                  placeholder="Add doctor notes / pre & post-procedure precautions"
                  className="mt-2 w-full border rounded p-2 text-sm"
                  rows={2}
                />

                {/* Pie Chart */}
                <div className="mt-3 w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={60}
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

                {/* Sessions */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {sessions.map((s, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded border flex flex-col justify-between ${
                        s.status === "completed"
                          ? "bg-green-50 border-green-300"
                          : s.status === "missed"
                          ? "bg-red-50 border-red-300"
                          : "bg-white"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {new Date(s.sessionDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-600">{s.status}</div>
                      </div>
                      <div className="mt-2 flex gap-1">
                        <button
                          onClick={() =>
                            handleUpdateSession(
                              b._id,
                              idx,
                              s.status === "completed"
                                ? "scheduled"
                                : "completed"
                            )
                          }
                          disabled={processing}
                          className={`text-xs px-2 py-1 rounded ${
                            s.status === "completed"
                              ? "bg-yellow-500 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {s.status === "completed"
                            ? "Mark Incomplete"
                            : "Complete"}
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateSession(
                              b._id,
                              idx,
                              s.status === "missed" ? "scheduled" : "missed"
                            )
                          }
                          disabled={processing}
                          className={`text-xs px-2 py-1 rounded ${
                            s.status === "missed"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {s.status === "missed" ? "Mark Scheduled" : "Missed"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientCard;
