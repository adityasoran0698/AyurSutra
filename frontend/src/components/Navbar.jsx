import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/user/me", {
          method: "GET",
          credentials: "include", // send cookies
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
    <div className=" flex justify-between items-center py-3  px-5 shadow bg-white">
      <div className="flex items-center font-bold text-2xl ">
        <img
          src="https://img.freepik.com/premium-vector/modern-medical-health-care-center-ayurvedic-logo-design-vector-illustration_898869-86.jpg"
          alt=""
          className="h-15 w-15 mr-3 "
        />
        <h1 className="text-emerald-600">AyurSutra</h1>
      </div>
      <div>
        <ul className="flex gap-x-5 text-lg font-medium text-teal-700">
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
              user.role === "patient" ? (
                <Link
                  to="/patient-dashboard"
                  className="relative text-emerald-700 cursor-pointer
          after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
          after:h-[2px] after:w-0 after:bg-teal-600 
          after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/doctor-dashboard"
                  className="relative text-emerald-700 cursor-pointer
          after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
          after:h-[2px] after:w-0 after:bg-teal-600 
          after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
                >
                  Dashboard
                </Link>
              )
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
            {user ? (
              user.role === "doctor" ? (
                <Link
                  to="/blogs"
                  className="relative text-emerald-700 cursor-pointer
          after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
          after:h-[2px] after:w-0 after:bg-teal-600 
          after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
                >
                  Blogs
                </Link>
              ) : (
                <Link
                  to="/blogs"
                  className="relative text-emerald-700 cursor-pointer
          after:content-[''] after:absolute after:left-0 after:bottom-0 py-1 
          after:h-[2px] after:w-0 after:bg-teal-600 
          after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
                >
                  Blogs
                </Link>
              )
            ) : (
              <Link
                to="/blogs"
                className="relative text-emerald-700 cursor-pointer
   after:content-[''] after:absolute after:left-0 after:bottom-0 py-1
   after:h-[2px] after:w-0 after:bg-teal-600 
   after:transition-all after:duration-300 hover:after:w-full hover:text-emerald-900"
              >
                Blogs
              </Link>
            )}
          </li>
        </ul>
      </div>
      <div className="flex gap-4">
        {user ? (
          user.role === "patient" ? (
            <div className="flex items-center gap-3">
              <Link
                to="/book-therapies"
                className="relative text-emerald-700 cursor-pointer py-1 hover:text-emerald-900 font-bold"
              >
                Hi, {user.fullname}
              </Link>
              <IoNotificationsSharp className="text-xl text-emerald-600 cursor-pointer" />
            </div>
          ) : (
            <Link
              to="/doctor-dashboard"
              className="relative text-emerald-700 cursor-pointer py-1 hover:text-emerald-900 font-bold"
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
            className="border px-3 py-1  cursor-pointer bg-rose-800 text-white font-semibold rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/register"
            className="border px-3.5 py-1.5 text-green font-semibold rounded"
          >
            Register
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
