// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-100 py-20 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Manage Your Panchakarma Therapies Effortlessly
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Automated scheduling, progress tracking, and patient-centric care –
            all in one platform.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
            >
              Get Started
            </Link>
            <a
              href="#about"
              className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded hover:bg-green-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About / Overview */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About AyurSutra</h2>
          <p className="text-lg max-w-2xl mx-auto">
            AyurSutra is a Panchakarma patient management software designed to
            simplify therapy scheduling, track progress, and ensure patient
            safety. It helps patients book sessions and receive reminders while
            enabling doctors to manage therapy schedules efficiently.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-green-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded shadow hover:shadow-lg transition text-center">
              <h3 className="text-xl font-semibold mb-2">
                Automated Scheduling
              </h3>
              <p>Plan and manage therapy sessions with ease.</p>
            </div>
            <div className="bg-white p-6 rounded shadow hover:shadow-lg transition text-center">
              <h3 className="text-xl font-semibold mb-2">
                Pre/Post Notifications
              </h3>
              <p>
                Get alerts about necessary precautions before and after therapy.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow hover:shadow-lg transition text-center">
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p>Monitor your recovery milestones and therapy history.</p>
            </div>
            <div className="bg-white p-6 rounded shadow hover:shadow-lg transition text-center">
              <h3 className="text-xl font-semibold mb-2">
                Feedback & Reporting
              </h3>
              <p>
                Report symptoms, side effects, and improvements after each
                session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6 border rounded">
              <h3 className="font-semibold mb-2">1. Sign Up</h3>
              <p>Create an account as a Patient or Doctor.</p>
            </div>
            <div className="p-6 border rounded">
              <h3 className="font-semibold mb-2">
                2. Book / Schedule Sessions
              </h3>
              <p>Automatically schedule therapies without conflicts.</p>
            </div>
            <div className="p-6 border rounded">
              <h3 className="font-semibold mb-2">3. Receive Notifications</h3>
              <p>Get reminders for pre- and post-procedure precautions.</p>
            </div>
            <div className="p-6 border rounded">
              <h3 className="font-semibold mb-2">4. Track Progress</h3>
              <p>Monitor your therapy and provide feedback to doctors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-green-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <p>
                "AyurSutra made therapy scheduling so simple, I never miss a
                session!"
              </p>
              <h4 className="font-semibold mt-4">– Patient A</h4>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p>"Managing patients and their progress is now effortless."</p>
              <h4 className="font-semibold mt-4">– Doctor B</h4>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p>
                "The notifications and reminders help patients follow
                precautions perfectly."
              </p>
              <h4 className="font-semibold mt-4">– Doctor C</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Join AyurSutra Today</h2>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Register as Patient
          </Link>
          <Link
            to="/register"
            className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded hover:bg-green-50 transition"
          >
            Register as Doctor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 AyurSutra. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:underline">
              Home
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#features" className="hover:underline">
              Features
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
