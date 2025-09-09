import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi"; // Heroicons arrow
import bgImage from "../assets/home-bg.jpg";

const Home = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Welcome to <span className="text-yellow-400">Seat Reservation System </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Book your seats easily and quickly. Manage your reservations with ease!
        </p>

        {/* Animated Book Now Button with Icon */}
        <Link
          to="/booking"
          className="group inline-flex items-center px-8 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition"
        >
          Book Now
          <HiArrowRight className="ml-2 w-6 h-6 transform transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
