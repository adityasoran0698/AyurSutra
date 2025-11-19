import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full font-sans text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-green-100 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Manage Your Panchakarma Therapies Effortlessly
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Automated scheduling, progress tracking, and patient-centric care –
            all in one platform.
          </p>

          {/* Buttons */}
          <div className="sm:flex-row sm:space-x-4 gap-4 sm:gap-0 justify-center flex flex-row">
            <div className=" flex justify-center items-center px-3 py-2 bg-green-600 text-white sm:px-6 sm:py-3 rounded hover:bg-green-700 transition ">
              <Link to="/register">Get Started</Link>
            </div>

            <a
              href="#about"
              className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded hover:bg-green-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            About AyurSutra
          </h2>

          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            AyurSutra is a Panchakarma patient management software designed to
            simplify therapy scheduling, track progress, and ensure patient
            safety. It helps patients book sessions and receive reminders while
            enabling doctors to manage therapy schedules efficiently.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-green-50 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Key Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                title: "Automated Scheduling",
                text: "Plan and manage therapy sessions with ease.",
              },
              {
                title: "Pre/Post Notifications",
                text: "Get alerts for precautions before and after therapy.",
              },
              {
                title: "Progress Tracking",
                text: "Monitor recovery milestones and therapy history.",
              },
              {
                title: "Feedback & Reporting",
                text: "Report symptoms and improvements after each session.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded shadow text-center hover:shadow-lg transition"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">How It Works</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: "1. Sign Up",
                text: "Create an account as a Patient or Doctor.",
              },
              {
                step: "2. Book / Schedule Sessions",
                text: "Automatically schedule therapies without conflicts.",
              },
              {
                step: "3. Receive Notifications",
                text: "Get reminders for procedure precautions.",
              },
              {
                step: "4. Track Progress",
                text: "Monitor therapy and give feedback.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border rounded shadow-sm">
                <h3 className="font-semibold mb-2">{item.step}</h3>
                <p className="text-sm sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-green-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">
            What Our Users Say
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                msg: "AyurSutra made therapy scheduling so simple, I never miss a session!",
                user: "– Patient A",
              },
              {
                msg: "Managing patients and their progress is now effortless.",
                user: "– Doctor B",
              },
              {
                msg: "Notifications help patients follow precautions perfectly.",
                user: "– Doctor C",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded shadow">
                <p className="text-sm sm:text-base">{item.msg}</p>
                <h4 className="font-semibold mt-4">{item.user}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Join AyurSutra Today
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-0 sm:space-x-4">
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

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">
            © 2025 AyurSutra. All rights reserved.
          </p>

          <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4">
            <a href="#" className="hover:underline text-sm sm:text-base">
              Home
            </a>
            <a href="#about" className="hover:underline text-sm sm:text-base">
              About
            </a>
            <a
              href="#features"
              className="hover:underline text-sm sm:text-base"
            >
              Features
            </a>
            <a href="#contact" className="hover:underline text-sm sm:text-base">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
