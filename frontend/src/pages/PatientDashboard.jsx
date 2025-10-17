// src/pages/PatientDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sentiment from "sentiment";
import api from "../api"; // ✅ centralized API import

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

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"]; // completed, scheduled, missed
const sentimentAnalyzer = new Sentiment();

function SmallStat({ label, value, hint }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function ProgressBar({ value = 0 }) {
  // value: 0-100
  return (
    <div className="w-full bg-slate-100 rounded h-3 overflow-hidden">
      <div
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
        aria-valuenow={value}
      />
    </div>
  );
}

export default function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null); // { bookingId, sessionIndex }
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
      setLoading(true);
      const res = await api.get("/bookings", {
        withCredentials: true,
      });
      const data = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
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

      const res = await api.post(
        `bookings/${bookingId}/${sessionIndex}`,
        payload,
        { withCredentials: true }
      );

      toast.success("Feedback submitted successfully!");
      setFeedbackModalOpen(false);
      setSelectedSession(null);

      // update UI locally
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                sessions: b.sessions.map((s, i) =>
                  i === sessionIndex
                    ? {
                        ...s,
                        feedbackText: feedbackText.trim(),
                        pain: Number(pain),
                        stress: Number(stress),
                        energy: Number(energy),
                        sleep,
                      }
                    : s
                ),
              }
            : b
        )
      );
    } catch (err) {
      console.error("Feedback submit error", err);
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setProcessing(false);
    }
  }

  // Derived data: flatten sessions for charts/metrics
  const allSessions = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.flatMap((b) =>
      (b.sessions || []).map((s) => ({
        ...s,
        bookingId: b._id,
        therapyName: b.therapyId?.name,
        doctor: b.doctorId,
      }))
    );
  }, [bookings]);
  // Prepare feedback for visualization
  const calculateSessionScore = (session) => {
    const {
      pain = 5,
      stress = 5,
      energy = 5,
      sleep = "average",
      feedbackText = "",
    } = session;

    // Normalize numeric fields to 0-10
    const painScore = 10 - pain; // less pain = better
    const stressScore = 10 - stress; // less stress = better
    const energyScore = energy; // higher energy = better
    const sleepScore = sleepToNumber(sleep);

    // Analyze textual feedback using sentiment
    const sentiment = sentimentAnalyzer.analyze(feedbackText);
    const sentimentScore = ((sentiment.comparative + 1) / 2) * 10; // -1 to 1 -> 0 to 10

    // Average all metrics
    const totalScore =
      (painScore + stressScore + energyScore + sleepScore + sentimentScore) / 5;

    return Math.round(totalScore * 10) / 10; // round to 1 decimal
  };
  // AI-based improvement chart
  const improvementChartData = useMemo(() => {
    return bookings.flatMap((b) =>
      (b.sessions || []).map((s, idx) => ({
        session: idx + 1,
        Score: calculateSessionScore(s),
        feedbackText: s.feedbackText || "No feedback",
      }))
    );
  }, [bookings]);

  const completedSessionsCount = useMemo(
    () => allSessions.filter((s) => s.status === "completed").length,
    [allSessions]
  );
  const scheduledSessionsCount = useMemo(
    () => allSessions.filter((s) => s.status === "scheduled").length,
    [allSessions]
  );
  const missedSessionsCount = useMemo(
    () => allSessions.filter((s) => s.status === "missed").length,
    [allSessions]
  );

  // Upcoming sessions list (future scheduled sessions)
  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return allSessions
      .filter(
        (s) =>
          s.status === "scheduled" && new Date(s.sessionDate) >= startOfDay(now)
      )
      .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
  }, [allSessions]);

  // Chart data (upcoming sessions by day for next N days) — keep small horizon such as 14
  const sessionsByDay = useMemo(() => {
    const days = 14;
    const now = new Date();
    const map = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      map[isoDate(d)] = 0;
    }
    for (const s of allSessions) {
      if (s.status !== "scheduled") continue;
      const key = isoDate(s.sessionDate);
      if (key in map) map[key] += 1;
    }
    return Object.keys(map).map((k) => ({ date: k, sessions: map[k] }));
  }, [allSessions]);

  const pieData = [
    { name: "Completed", value: completedSessionsCount },
    { name: "Scheduled", value: scheduledSessionsCount },
    { name: "Missed", value: missedSessionsCount },
  ];

  if (loading) return <div className="p-6">Loading patient dashboard...</div>;

  return (
    <div className="p-6 space-y-6 w-[80vw]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchBookings}
            className="px-3 py-1 bg-slate-200 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SmallStat label="Upcoming Sessions" value={scheduledSessionsCount} />
        <SmallStat label="Completed Sessions" value={completedSessionsCount} />
        <SmallStat label="Missed Sessions" value={missedSessionsCount} />
        <SmallStat
          label="Assigned Doctors"
          value={new Set(bookings.map((b) => b.doctorId?._id)).size}
        />
      </div>

      {/* charts + next session */}
      <div className="flex  w-full items-center justify-center">
        <div className="bg-white p-4 rounded-xl shadow w-full ">
          <h3 className="font-semibold mb-2 text-center text-lg">
            Session Status
          </h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
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
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">
          Patient Improvement Over Sessions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={improvementChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Gradient for the line */}
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              {/* Gradient for area under line */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="session"
              label={{
                value: "Session",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              domain={[0, 10]}
              label={{
                value: "Feedback Score",
                angle: -90,
                position: "outsideRight",
              }}
            />

            <Tooltip
              content={({ active, payload, label }) =>
                active && payload && payload.length ? (
                  <div className="bg-white p-3 rounded shadow border text-sm">
                    <div>
                      <strong>Session:</strong> {label}
                    </div>

                    <div className="mt-1">
                      <strong>Feedback:</strong>{" "}
                      {payload[0].payload.feedbackText}
                    </div>
                  </div>
                ) : null
              }
            />

            <Legend />

            {/* Smooth line with gradient stroke */}
            <Line
              type="monotone"
              dataKey="Score"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={getScoreColor(payload.Score)}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />

            {/* Area under the curve */}
            <Area
              type="monotone"
              stroke="none"
              fill="url(#areaGradient)"
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* bookings list with per-booking progress + sessions grid + feedback */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Your Bookings & Progress</h3>

        {bookings.length === 0 ? (
          <div className="text-sm text-slate-500">No bookings yet.</div>
        ) : (
          bookings.map((b) => {
            const completed = b.progress?.completedSessions || 0;
            const total =
              b.progress?.totalSessions || (b.sessions ? b.sessions.length : 0);
            const percent =
              total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div key={b._id} className="border-b last:border-0 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {b.therapyId?.name || "Therapy"}
                    </div>
                    <div className="text-sm text-slate-500">
                      Doctor: {b.doctorId?.fullname || "—"} • Booked on:{" "}
                      {new Date(b.createdAt).toLocaleDateString()} • Starts on:{" "}
                      {b.sessions && b.sessions.length > 0
                        ? new Date(
                            b.sessions[0].sessionDate
                          ).toLocaleDateString()
                        : "TBD"}
                    </div>
                  </div>

                  <div className="w-48">
                    <div className="text-xs text-slate-500">Progress</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full">
                        <ProgressBar value={percent} />
                      </div>
                      <div className="text-sm font-medium">{percent}%</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {completed}/{total} sessions completed
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    {b.notes || b.patientNotes || ""}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setExpandedBookingId(
                          expandedBookingId === b._id ? null : b._id
                        )
                      }
                      className="px-2 py-1 bg-slate-200 rounded text-sm"
                    >
                      {expandedBookingId === b._id ? "Collapse" : "See Status"}
                    </button>
                  </div>
                </div>

                {/* expanded session manager */}
                {/* expanded session manager */}
                {expandedBookingId === b._id && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(b.sessions || []).map((s, idx) => {
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
                              <div className="text-sm font-medium">
                                {dateStr}
                              </div>
                              <div className="text-xs text-slate-600 mt-1 font-medium">
                                Status: {s.status}
                              </div>
                              {s.feedbackText && (
                                <div className="text-xs text-slate-700 mt-2 break-words">
                                  <strong>Your feedback:</strong>{" "}
                                  {s.feedbackText}
                                </div>
                              )}
                            </div>

                            {/* Feedback button only if completed and no feedback yet */}
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
                                disabled={s.feedbackText} // disable if feedback exists
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
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
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
                onClick={() => handleSubmitModalFeedback()}
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

/* helpers */
function isoDate(d) {
  const dd = new Date(d);
  return dd.toISOString().slice(0, 10);
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
const sleepToNumber = (sleep) => {
  switch ((sleep || "").toLowerCase()) {
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
const getScoreColor = (score) => {
  if (score >= 7) return "#22c55e"; // green = good improvement
  if (score >= 4) return "#f59e0b"; // yellow/amber = medium
  return "#ef4444"; // red = low
};
