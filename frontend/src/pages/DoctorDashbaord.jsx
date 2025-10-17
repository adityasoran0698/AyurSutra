// src/pages/DoctorDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"]; // green, yellow, red

function KPI({ title, value, hint }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

export default function DoctorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDoctorBookings();
  }, []);

  async function fetchDoctorBookings() {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://https://ayursutra-panchakarma.onrender.com//user/patients",
        {
          withCredentials: true,
        }
      );
      const data = res.data.patients || res.data.bookings || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch doctor bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }
  // Group bookings by patient
  const groupedPatients = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const patientId = b.patientId?._id;
      if (!patientId) return;
      if (!map[patientId]) {
        map[patientId] = {
          patient: b.patientId,
          bookings: [],
        };
      }
      map[patientId].bookings.push(b);
    });
    return Object.values(map);
  }, [bookings]);

  // Flatten sessions for charts & stats
  const allSessions = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.flatMap((b) =>
      (b.sessions || []).map((s) => ({
        ...s,
        bookingId: b._id,
        therapyName: b.therapyId?.name,
        patient: b.patientId,
      }))
    );
  }, [bookings]);

  const completedCount = allSessions.filter(
    (s) => s.status === "completed"
  ).length;
  const scheduledCount = allSessions.filter(
    (s) => s.status === "scheduled"
  ).length;
  const missedCount = allSessions.filter((s) => s.status === "missed").length;

  const pieData = [
    { name: "Completed", value: completedCount },
    { name: "Scheduled", value: scheduledCount },
    { name: "Missed", value: missedCount },
  ];

  // sessions grouped by day
  // Sessions grouped by day for next 14 days, future sessions only
  const sessionsByDay = useMemo(() => {
    const days = 14;
    const now = new Date();
    const map = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const key = `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`; // dd/mm/yyyy
      map[key] = 0;
    }

    allSessions.forEach((s) => {
      const sessionDate = new Date(s.sessionDate);
      if (sessionDate >= now) {
        const key = `${String(sessionDate.getDate()).padStart(2, "0")}/${String(
          sessionDate.getMonth() + 1
        ).padStart(2, "0")}/${sessionDate.getFullYear()}`;
        if (key in map) map[key] += 1;
      }
    });

    return Object.keys(map).map((k) => ({ date: k, sessions: map[k] }));
  }, [allSessions]);

  async function handleUpdateSession(bookingId, sessionIndex, newStatus) {
    try {
      setProcessing(true);
      const booking = bookings.find((b) => b._id === bookingId);
      if (!booking) throw new Error("Booking not found");

      const updatedSessions = booking.sessions.map((s, idx) =>
        idx === sessionIndex ? { ...s, status: newStatus } : s
      );
      const completedSessions = updatedSessions.filter(
        (s) => s.status === "completed"
      ).length;
      const newProgress = {
        completedSessions,
        totalSessions: updatedSessions.length,
      };

      const res = await axios.patch(
        `http://https://ayursutra-panchakarma.onrender.com//bookings/update/${bookingId}`,
        { sessions: updatedSessions, progress: newProgress },
        { withCredentials: true }
      );

      const updated = res.data.booking || res.data;
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updated : b))
      );
    } catch (err) {
      console.error("Failed to update session", err);
      alert("Failed to update session.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleAutoSchedule(bookingId) {
    try {
      setProcessing(true);
      const res = await axios.patch(
        `http://https://ayursutra-panchakarma.onrender.com//bookings/${bookingId}/auto-schedule`,
        {},
        { withCredentials: true }
      );
      const updated = res.data.booking || res.data;
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? updated : b))
      );
    } catch (err) {
      console.error("Auto-schedule failed", err);
      alert("Auto-schedule failed.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleUpdateNotes(bookingId, notes) {
    try {
      await axios.patch(
        `http://https://ayursutra-panchakarma.onrender.com//bookings/update/${bookingId}`,
        { doctorNotes: notes },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to save doctor notes", err);
    }
  }
  const uniquePatientCount = useMemo(() => {
    const ids = new Set();
    bookings.forEach((b) => {
      if (b.patientId?._id) ids.add(b.patientId._id);
    });
    return ids.size;
  }, [bookings]);
  if (loading) return <div className="p-6">Loading doctor dashboard...</div>;

  return (
    <div className="p-6 space-y-6 w-[80vw]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <button
          onClick={fetchDoctorBookings}
          disabled={processing}
          className="px-3 py-1 bg-slate-200 rounded"
        >
          Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI title="Patients" value={uniquePatientCount} />
        <KPI
          title="Total Sessions"
          value={allSessions.length}
          hint={`${scheduledCount} scheduled`}
        />
        <KPI
          title="Completion Rate"
          value={
            allSessions.length
              ? `${Math.round((completedCount / allSessions.length) * 100)}%`
              : "0%"
          }
        />
        <KPI title="Missed Sessions" value={missedCount} />
      </div>

      {/* Charts */}
      <div className="w-[100%] bg-white p-4 rounded-xl shadow  ">
        <div className="w-full">
          <h3 className="font-semibold mb-2">Upcoming Sessions</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionsByDay}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#22c55e"
                  fill="#bbf7d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Patients & Bookings */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3 ">Patients & Bookings</h3>
        {groupedPatients.length === 0 ? (
          <div className="text-sm text-slate-500">No patients assigned.</div>
        ) : (
          groupedPatients.map((gp) => (
            <PatientCard
              key={gp.patient._id}
              patient={gp.patient}
              bookings={gp.bookings}
              handleAutoSchedule={handleAutoSchedule}
              handleUpdateNotes={handleUpdateNotes}
              handleUpdateSession={handleUpdateSession}
              processing={processing}
            />
          ))
        )}
      </div>
    </div>
  );
}
function isoDate(d) {
  const dd = new Date(d);
  return dd.toISOString().slice(0, 10);
}
