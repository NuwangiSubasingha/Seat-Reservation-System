import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

const Login = () => {
  const [form, setForm] = useState({ Email: "", Password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      if (user.Role === "Admin") navigate("/admin-dashboard");
      else navigate("/home");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-400">
      <motion.div initial={{ opacity: 0, y: -50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-extrabold mb-8 text-blue-900 text-center">
          Welcome Back
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input type="email" name="Email" placeholder="Email" onChange={handleChange} required whileFocus={{ scale: 1.05 }} className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500" />
          <motion.input type="password" name="Password" placeholder="Password" onChange={handleChange} required whileFocus={{ scale: 1.05 }} className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500" />
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg">
            Login
          </motion.button>
        </form>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;