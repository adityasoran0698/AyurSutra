// src/pages/PatientDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import API from "../api"; // centralized API helper
import Sentiment from "sentiment";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
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
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalFeedback, setModalFeedback] = useState({
    pain: 0,
    stress: 0,
    energy: 0,
    sleep: "average",
    feedbackText: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await API.get("/bookings", { withCredentials: true });
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

      await API.post(`/bookings/${bookingId}/${sessionIndex}`, payload, {
        withCredentials: true,
      });

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
                  i === sessionIndex ? { ...s, ...payload } : s
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

  const allSessions = useMemo(
    () =>
      bookings.flatMap((b) =>
        (b.sessions || []).map((s) => ({
          ...s,
          bookingId: b._id,
          therapyName: b.therapyId?.name,
          doctor: b.doctorId,
        }))
      ),
    [bookings]
  );

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
    const sentimentScore =
      ((sentimentAnalyzer.analyze(feedbackText).comparative + 1) / 2) * 10;
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

  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return allSessions
      .filter(
        (s) =>
          s.status === "scheduled" && new Date(s.sessionDate) >= startOfDay(now)
      )
      .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
  }, [allSessions]);

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
      {/* Top header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <button
          onClick={fetchBookings}
          className="px-3 py-1 bg-slate-200 rounded"
        >
          Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SmallStat label="Upcoming Sessions" value={scheduledSessionsCount} />
        <SmallStat label="Completed Sessions" value={completedSessionsCount} />
        <SmallStat label="Missed Sessions" value={missedSessionsCount} />
        <SmallStat
          label="Assigned Doctors"
          value={new Set(bookings.map((b) => b.doctorId?._id)).size}
        />
      </div>

      {/* Charts and improvement */}
      {/* ...keep your PieChart and LineChart components unchanged... */}

      {/* Bookings list + progress + feedback */}
      {/* ...keep your bookings mapping unchanged... */}

      {/* Feedback modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>
            {/* Inputs for pain, stress, energy, sleep, feedbackText */}
            {/* ...keep modal form unchanged... */}
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
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
};
