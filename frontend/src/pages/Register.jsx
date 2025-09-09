// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api";

// const Register = () => {
//   const [form, setForm] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     password: "",
//     role: "Intern",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/auth/register", form);
//       alert("✅ Registration successful!");
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-900">
//       <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
//         <h2 className="text-4xl font-extrabold mb-8 text-blue-900 text-center">
//           Create Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="text"
//             name="userId"
//             placeholder="User ID"
//             onChange={handleChange}
//             required
//             className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />

//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             onChange={handleChange}
//             required
//             className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             required
//             className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             onChange={handleChange}
//             required
//             className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />

//           <select
//             name="role"
//             onChange={handleChange}
//             className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
//           >
//             <option value="Intern">Intern</option>
//             <option value="Admin">Admin</option>
//           </select>

//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition-colors"
//           >
//             Register
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-500">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-600 font-semibold hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import registerImage from "../assets/register-bg.jpg"; // Add your image here

const Register = () => {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    role: "Intern",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("✅ Registration successful!");
      navigate("/login"); // Make sure /login route exists
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-500">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={registerImage}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-4xl font-extrabold mb-8 text-blue-900 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="userId"
              placeholder="User ID"
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <select
              name="role"
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="Intern">Intern</option>
              <option value="Admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition-colors"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
