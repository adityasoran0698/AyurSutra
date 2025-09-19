import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
      {/* Header (click to expand/collapse) */}
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

      {/* Expandable Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="border rounded-lg p-3 bg-slate-50 shadow-sm"
            >
              {/* Booking Header */}
              <div className="flex justify-between items-center">
                <div className="text-md font-semibold">{b.therapyId?.name}</div>
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
                className="mt-3 w-full border rounded p-2 text-sm"
                rows={2}
              />

              {/* Sessions */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {(b.sessions || []).map((s, idx) => (
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
                          handleUpdateSession(b._id, idx, "completed")
                        }
                        disabled={processing || s.status === "completed"}
                        className="text-xs px-2 py-1 rounded bg-green-600 text-white"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateSession(b._id, idx, "missed")
                        }
                        disabled={processing || s.status === "missed"}
                        className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                      >
                        Missed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientCard;
