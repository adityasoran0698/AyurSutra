// --- PatientDashboard.jsx (Responsive Version) ---
import React, { useEffect, useMemo, useState } from "react";
import Sentiment from "sentiment";
import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import ImprovementChart from "./../components/improvmentChart";
import { SyncLoader } from "react-spinners";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];
const sentimentAnalyzer = new Sentiment();

function SmallStat({ label, value, hint }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border w-full">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
        {value}
      </div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full bg-slate-100 rounded h-3 overflow-hidden">
      <div
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
      />
    </div>
  );
}

export default function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalFeedback, setModalFeedback] = useState({
    pain: 0,
    stress: 0,
    energy: 0,
    sleep: "average",
    feedbackText: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await axios.get(
        "https://ayursutra-2-tl11.onrender.com/bookings",
        {
          withCredentials: true,
        }
      );
      const data = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitModalFeedback() {
    if (!selectedSession) return;

    const { bookingId, sessionIndex } = selectedSession;
    const { feedbackText, pain, stress, energy, sleep } = modalFeedback;

    if (!feedbackText || feedbackText.trim().length < 3) {
      toast.error("Please enter at least 3 characters of feedback");
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        feedbackText: feedbackText.trim(),
        pain: Number(pain),
        stress: Number(stress),
        energy: Number(energy),
        sleep,
      };

      await axios.post(
        `https://ayursutra-2-tl11.onrender.com/bookings/${bookingId}/${sessionIndex}`,
        payload,
        { withCredentials: true }
      );

      toast.success("Feedback submitted successfully!");

      setFeedbackModalOpen(false);
      setSelectedSession(null);

      // update UI
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                sessions: b.sessions.map((s, i) =>
                  i === sessionIndex ? { ...s, ...payload } : s
                ),
              }
            : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setProcessing(false);
    }
  }

  // flatten sessions
  const allSessions = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.flatMap((b) =>
      (b.sessions || []).map((s) => ({
        ...s,
        bookingId: b._id,
        therapyName: b.therapyId?.name,
      }))
    );
  }, [bookings]);

  const calculateSessionScore = (session) => {
    const {
      pain = 5,
      stress = 5,
      energy = 5,
      sleep = "average",
      feedbackText = "",
    } = session;

    const painScore = 10 - pain;
    const stressScore = 10 - stress;
    const energyScore = energy;
    const sleepScore = sleepToNumber(sleep);

    const sentiment = sentimentAnalyzer.analyze(feedbackText);
    const sentimentScore = ((sentiment.comparative + 1) / 2) * 10;

    return (
      Math.round(
        ((painScore + stressScore + energyScore + sleepScore + sentimentScore) /
          5) *
          10
      ) / 10
    );
  };

  const improvementChartData = useMemo(() => {
    return bookings.flatMap((b) =>
      (b.sessions || []).map((s, idx) => ({
        session: idx + 1,
        Score: calculateSessionScore(s),
        feedbackText: s.feedbackText || "No feedback",
      }))
    );
  }, [bookings]);

  const completedSessionsCount = allSessions.filter(
    (s) => s.status === "completed"
  ).length;
  const scheduledSessionsCount = allSessions.filter(
    (s) => s.status === "scheduled"
  ).length;
  const missedSessionsCount = allSessions.filter(
    (s) => s.status === "missed"
  ).length;

  const pieData = [
    { name: "Completed", value: completedSessionsCount },
    { name: "Scheduled", value: scheduledSessionsCount },
    { name: "Missed", value: missedSessionsCount },
  ];

  if (loading)
    return (
      <div className="p-6">
        {" "}
        <SyncLoader color="black" size={8} />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-6 w-full lg:w-[80vw] mx-auto">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Patient Dashboard</h1>

        <button
          onClick={fetchBookings}
          className="px-3 py-1 bg-slate-200 rounded w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SmallStat label="Upcoming Sessions" value={scheduledSessionsCount} />
        <SmallStat label="Completed Sessions" value={completedSessionsCount} />
        <SmallStat label="Missed Sessions" value={missedSessionsCount} />
        <SmallStat
          label="Assigned Doctors"
          value={new Set(bookings.map((b) => b.doctorId?._id)).size}
        />
      </div>

      {/* SESSION PIE CHART */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-xl shadow w-full ">
          <h3 className="font-semibold mb-2 text-center text-lg">
            Session Status
          </h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IMPROVEMENT CHART */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">
          Patient Improvement Over Sessions
        </h3>
        <div className="overflow-x-auto">
          <ImprovementChart sessions={allSessions} title="Your Progress" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Your Bookings & Progress</h3>

        {bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet.</p>
        ) : (
          bookings.map((b) => {
            const completed = b.progress?.completedSessions || 0;
            const total = b.sessions?.length || 0;
            const percent =
              total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div key={b._id} className="border-b last:border-0 py-4">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {b.therapyId?.name || "Therapy"}
                    </div>
                    <div className="text-sm text-slate-500">
                      Doctor: {b.doctorId?.fullname || "—"} • Booked:{" "}
                      {new Date(b.createdAt).toLocaleDateString()} • Starts:{" "}
                      {b.sessions?.length > 0
                        ? new Date(
                            b.sessions[0].sessionDate
                          ).toLocaleDateString()
                        : "TBD"}
                    </div>
                  </div>

                  <div className="w-full lg:w-48">
                    <div className="text-xs text-slate-500">Progress</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full">
                        <ProgressBar value={percent} />
                      </div>
                      <div className="text-sm font-medium">{percent}%</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {completed}/{total} completed
                    </div>
                  </div>
                </div>

                
                <div className="mt-3 flex flex-col sm:flex-row justify-between gap-2">
                  <p className="text-sm text-slate-600 break-words w-full">
                    {b.notes || b.patientNotes || ""}
                  </p>

                  <button
                    onClick={() =>
                      setExpandedBookingId(
                        expandedBookingId === b._id ? null : b._id
                      )
                    }
                    className=" px-3 py-1  bg-slate-200 rounded text-sm w-full sm:w-auto whitespace-nowrap"
                  >
                    {expandedBookingId === b._id ? "Collapse" : "See Status"}
                  </button>
                </div>

               
                {expandedBookingId === b._id && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {b.sessions?.map((s, idx) => {
                        const dateStr = new Date(
                          s.sessionDate
                        ).toLocaleString();
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded border flex flex-col justify-between ${
                              s.status === "completed"
                                ? "bg-green-50 border-green-300"
                                : s.status === "missed"
                                ? "bg-red-50 border-red-300"
                                : "bg-slate-50"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-medium break-words">
                                {dateStr}
                              </div>

                              <div className="text-xs text-slate-600 mt-1">
                                Status: {s.status}
                              </div>

                              {s.feedbackText && (
                                <p className="text-xs mt-2 break-words">
                                  <strong>Your feedback:</strong>{" "}
                                  {s.feedbackText}
                                </p>
                              )}
                            </div>
                            {s.status === "completed" && (
                              <button
                                onClick={() => {
                                  if (!s.feedbackText) {
                                    setSelectedSession({
                                      bookingId: b._id,
                                      sessionIndex: idx,
                                    });
                                    setFeedbackModalOpen(true);
                                    setModalFeedback({
                                      pain: 0,
                                      stress: 0,
                                      energy: 0,
                                      sleep: "average",
                                      feedbackText: "",
                                    });
                                  }
                                }}
                                disabled={!!s.feedbackText}
                                className={`mt-2 px-3 py-1 rounded text-sm ${
                                  s.feedbackText
                                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                    : "bg-teal-600 text-white"
                                }`}
                              >
                                {s.feedbackText
                                  ? "Feedback Submitted"
                                  : "Submit Feedback"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FEEDBACK MODAL */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm sm:max-w-md">
            <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>

            <div className="space-y-3 text-sm">
              <div>
                <label>Pain (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={modalFeedback.pain}
                  onChange={(e) =>
                    setModalFeedback({
                      ...modalFeedback,
                      pain: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded p-1 mt-1"
                />
              </div>

              <div>
                <label>Stress (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={modalFeedback.stress}
                  onChange={(e) =>
                    setModalFeedback({
                      ...modalFeedback,
                      stress: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded p-1 mt-1"
                />
              </div>

              <div>
                <label>Energy (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={modalFeedback.energy}
                  onChange={(e) =>
                    setModalFeedback({
                      ...modalFeedback,
                      energy: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded p-1 mt-1"
                />
              </div>

              <div>
                <label>Sleep</label>
                <select
                  value={modalFeedback.sleep}
                  onChange={(e) =>
                    setModalFeedback({
                      ...modalFeedback,
                      sleep: e.target.value,
                    })
                  }
                  className="w-full border rounded p-1 mt-1"
                >
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                </select>
              </div>

              <div>
                <label>Feedback</label>
                <textarea
                  value={modalFeedback.feedbackText}
                  onChange={(e) =>
                    setModalFeedback({
                      ...modalFeedback,
                      feedbackText: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 mt-1"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitModalFeedback}
                className="px-3 py-1 bg-teal-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* HELPERS */
const sleepToNumber = (sleep) => {
  switch (sleep?.toLowerCase()) {
    case "poor":
      return 2;
    case "average":
      return 5;
    case "good":
      return 8;
    default:
      return 5;
  }
};
