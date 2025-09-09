// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api";


// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", form);
//       const { token, user } = res.data;

//       // Save token + user in localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Role-based redirection
//       if (user.role === "Admin") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/home");
//       }
//     } catch (err) {
//       alert(err.response?.data?.msg || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//   <form
//     onSubmit={handleSubmit}
//     className="w-full max-w-md p-8 bg-yellow-400 text-black rounded-lg shadow-lg"
//   >
//     <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//     <input
//       type="email"
//       name="email"
//       placeholder="Email"
//       onChange={handleChange}
//       required
//       className="w-full mb-4 p-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-yellow-500"
//     />
//     <input
//       type="password"
//       name="password"
//       placeholder="Password"
//       onChange={handleChange}
//       required
//       className="w-full mb-4 p-3 rounded bg-white border border-gray-300 focus:outline-none focus:border-yellow-500"
//     />
//     <button
//       type="submit"
//       className="w-full bg-yellow-500 hover:bg-yellow-600 p-3 rounded font-bold transition"
//     >
//       Login
//     </button>
//   </form>
// </div>



//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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

      if (user.role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-400">
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl"
      >
        {/* Title Animation */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-extrabold mb-8 text-blue-900 text-center"
        >
          Welcome Back
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          {/* Button Animation */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full py-3 bg-blue-900 hover:bg-blue-1000 text-white font-bold rounded-xl shadow-lg"
          >
            Login
          </motion.button>
        </form>

        {/* Link Animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-center text-gray-500"
        >
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
