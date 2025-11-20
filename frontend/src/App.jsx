import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Therapies from "./pages/Therapies";
import Blog from "./pages/Blog";
import BookTherapies from "./pages/BookTherapies";
import AddTherapyPage from "./pages/AddTherapy";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashbaord";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* 🔹 Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-md -z-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* 🔹 Foreground (content) */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex flex-grow justify-center items-start pt-6 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/therapies" element={<Therapies />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/book-therapies/:id" element={<BookTherapies />} />
            <Route path="/add-therapy" element={<AddTherapyPage />} />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
