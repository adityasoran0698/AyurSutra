import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {/* TOP NAV */}
      <div className="flex justify-between items-center py-3 px-5 shadow bg-white sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center font-bold text-2xl">
          <img
            src="https://img.freepik.com/premium-vector/modern-medical-health-care-center-ayurvedic-logo-design-vector-illustration_898869-86.jpg"
            alt=""
            className="h-14 w-14 mr-3"
          />
          <div className="text-emerald-600">
            <span className="text-lg sm:text-2xl">AyurSutra</span>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <ul className="gap-x-5 text-lg font-medium text-teal-700 hidden sm:flex">
          <li>
            <Link
              to="/"
              className="relative text-emerald-700 cursor-pointer
                after:content-[''] after:absolute after:left-0 after:bottom-0 py-1
                after:h-[2px] after:w-0 after:bg-teal-600 
                after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
            >
              Home
            </Link>
          </li>

          <li>
            {user ? (
              user.role === "patient" ? (
                <Link
                  to="/therapies"
                  className="relative text-emerald-700 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
                    after:h-[2px] after:w-0 after:bg-teal-600 
                    after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
                >
                  Book Therapies
                </Link>
              ) : (
                <Link
                  to="/add-therapy"
                  className="relative text-emerald-700 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
                    after:h-[2px] after:w-0 after:bg-teal-600 
                    after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
                >
                  Add Therapies
                </Link>
              )
            ) : (
              <a
                href="#about"
                className="relative text-emerald-700 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
                    after:h-[2px] after:w-0 after:bg-teal-600 
                    after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
              >
                About
              </a>
            )}
          </li>

          <li>
            {user ? (
              <Link
                to={
                  user.role === "patient"
                    ? "/patient-dashboard"
                    : "/doctor-dashboard"
                }
                className="relative text-emerald-700 cursor-pointer
                  after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
                  after:h-[2px] after:w-0 after:bg-teal-600 
                  after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/therapies"
                className="relative text-emerald-700 cursor-pointer
                  after:content-[''] after:absolute after:left-0 after:bottom-0 py-1
                  after:h-[2px] after:w-0 after:bg-teal-600 
                  after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
              >
                Therapies
              </Link>
            )}
          </li>

          <li>
            <Link
              to="/blogs"
              className="relative text-emerald-700 cursor-pointer
                after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
                after:h-[2px] after:w-0 after:bg-teal-600 
                after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
            >
              Blogs
            </Link>
          </li>
        </ul>

        {/* RIGHT SIDE: Login / Username */}
        <div className="hidden sm:flex gap-4 items-center">
          {user ? (
            user.role === "patient" ? (
              <div className="flex items-center gap-3">
                <div className="text-emerald-700 font-bold cursor-pointer hover:text-emerald-900">
                  Hi, {user.fullname}
                </div>
                <IoNotificationsSharp className="text-xl text-emerald-600 cursor-pointer" />
              </div>
            ) : (
              <Link
                to="/doctor-dashboard"
                className="text-emerald-700 font-bold cursor-pointer hover:text-emerald-900"
              >
                Hi, Dr. {user.fullname}
              </Link>
            )
          ) : (
            <Link
              to="/login"
              className="border px-3.5 py-1.5 text-white font-semibold rounded bg-green-900"
            >
              Login
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                Cookies.remove("token");
                setUser(null);
                navigate("/");
              }}
              className="border px-3 py-1 cursor-pointer bg-rose-800 text-white font-semibold rounded"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/register"
              className="border px-3.5 py-1.5 font-semibold text-green-700 rounded"
            >
              Register
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="sm:hidden text-3xl text-emerald-700"
          onClick={() => setOpen(!open)}
        >
          <HiMenu />
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`sm:hidden bg-white shadow px-5 py-3 flex flex-col gap-4 transition-all duration-300 overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Link to="/" onClick={() => setOpen(false)}>
          Home
        </Link>

        {user ? (
          user.role === "patient" ? (
            <Link to="/therapies" onClick={() => setOpen(false)}>
              Book Therapies
            </Link>
          ) : (
            <Link to="/add-therapy" onClick={() => setOpen(false)}>
              Add Therapies
            </Link>
          )
        ) : (
          <a href="#about" onClick={() => setOpen(false)}>
            About
          </a>
        )}

        <Link
          to={
            user
              ? user.role === "patient"
                ? "/patient-dashboard"
                : "/doctor-dashboard"
              : "/therapies"
          }
          onClick={() => setOpen(false)}
        >
          {user ? "Dashboard" : "Therapies"}
        </Link>

        <Link to="/blogs" onClick={() => setOpen(false)}>
          Blogs
        </Link>

        {/* Mobile login/logout */}
        {!user ? (
          <>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="font-semibold text-green-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="font-semibold text-green-700"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              Cookies.remove("token");
              setUser(null);
              setOpen(false);
              navigate("/");
            }}
            className="text-red-700 font-semibold text-left"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
