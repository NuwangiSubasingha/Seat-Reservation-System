import React, { useState, useEffect } from "react";
import { FaChair } from "react-icons/fa";
import API from "../api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("seats");
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState({ type: "date", value: "" });

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await API.get("/seats");
        setSeats(res.data);
      } catch (err) {
        console.error("Error fetching seats", err);
      }
    };
    fetchSeats();
  }, []);

  const addSeat = async () => {
    const seatNumbers = seats.map(
      (s) => parseInt(s.SeatNumber.replace(/\D/g, "")) || 0
    );
    const maxNumber = seatNumbers.length > 0 ? Math.max(...seatNumbers) : 0;
    const newNumber = maxNumber + 1;

    const newSeat = {
      seatId: `S${(seats.length + 1).toString().padStart(3, "0")}`,
      SeatNumber: `Seat ${newNumber}`,
      Location: "Default Location",
    };

    try {
      const res = await API.post("/seats", newSeat);
      setSeats([...seats, res.data]);
    } catch (err) {
      console.error("Error adding seat", err);
      alert("Failed to add seat.");
    }
  };

  const removeSeat = async (seatId) => {
    try {
      await API.delete(`/seats/${seatId}`);
      setSeats(seats.filter((seat) => seat._id !== seatId));
    } catch (err) {
      console.error("Error removing seat", err);
      alert("Failed to remove seat.");
    }
  };

  const fetchReservations = async () => {
    try {
      let url = "/reservations/admin";
      if (filter.value) {
        url += `?${filter.type}=${filter.value}`;
      }
      const res = await API.get(url);
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations", err);
      alert("Failed to fetch reservations.");
    }
  };

  useEffect(() => {
    if (activeTab === "reservations" || activeTab === "reports") {
      fetchReservations();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-r from-blue-100 to-blue-200">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-lg">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-700 mb-8 text-lg">
        Welcome, Admin! Here you can manage the system.
      </p>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        {["seats", "reservations", "reports"].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
              activeTab === tab
                ? "bg-blue-900 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "seats"
              ? "Manage Seats"
              : tab === "reservations"
              ? "Manage Reservations"
              : "View Reports"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl">
        {activeTab === "seats" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2">
              Manage Seats
            </h2>
            <div className="mb-6">
              <button
                onClick={addSeat}
                className="px-5 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300"
              >
                ➕ Add Seat
              </button>
            </div>

            <div className="grid grid-cols-5 gap-6">
              {seats.map((seat) => (
                <div
                  key={seat._id}
                  className="flex flex-col items-center p-4 bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <FaChair className="text-4xl text-blue-700 mb-2" />
                  <span className="text-sm font-bold mb-2">{seat.SeatNumber}</span>
                  <button
                    onClick={() => removeSeat(seat._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs shadow-sm transition-all duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reservations" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2">
              Manage Reservations
            </h2>
            <p className="text-gray-700 mb-4">
              View, approve, or cancel reservations.
            </p>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <select
                value={filter.type}
                onChange={(e) =>
                  setFilter({ ...filter, type: e.target.value, value: "" })
                }
                className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="date">Filter by Date</option>
                <option value="intern">Filter by Intern</option>
              </select>
              <input
                type={filter.type === "date" ? "date" : "text"}
                placeholder={
                  filter.type === "intern"
                    ? "Enter Intern ID"
                    : "Select a Date"
                }
                value={filter.value}
                onChange={(e) =>
                  setFilter({ ...filter, value: e.target.value })
                }
                className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={fetchReservations}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300"
              >
                🔍 Search
              </button>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead className="bg-blue-100">
                  <tr>
                    {[
                      "Reservation ID",
                      "Intern ID",
                      "Seat",
                      "Date",
                      "Time Slot",
                      "Status",
                    ].map((th) => (
                      <th
                        key={th}
                        className="border border-gray-300 px-4 py-2 text-left text-gray-700"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reservations.length > 0 ? (
                    reservations.map((r) => (
                      <tr
                        key={r.ReservationID}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          {r.ReservationID}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {r.InternID}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {r.SeatID?.SeatNumber || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {r.Date}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {r.TimeSlot}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full font-semibold ${
                              r.Status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {r.Status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

   {activeTab === "reports" && (
  <div>
    <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2">
      Reports
    </h2>

    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="font-extrabold text-2xl mb-3 text-blue-700">
          Seat Summary
        </h3>
        <p>Total Seats: {seats.length}</p>
        <p>
          Available Seats: {seats.filter((s) => s.Status !== "Unavailable").length}
        </p>
        <p>
          Unavailable Seats: {seats.filter((s) => s.Status === "Unavailable").length}
        </p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="font-extrabold text-2xl mb-3 text-blue-700">
          Reservation Summary
        </h3>
        <p>Total Reservations: {reservations.length}</p>
        <p>
          Active Reservations: {reservations.filter((r) => r.Status === "Active").length}
        </p>
        <p>
          Cancelled Reservations: {reservations.filter((r) => r.Status === "Cancelled").length}
        </p>
      </div>
    </div>

    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="font-extrabold text-2xl mb-4 text-blue-700">
        Reservations Per Date
      </h3>
      {reservations.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Reservation Count</th>
              <th className="border border-gray-300 px-4 py-2">Status Summary</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              reservations.reduce((acc, r) => {
                if (!acc[r.Date]) {
                  acc[r.Date] = { total: 0, active: 0, cancelled: 0 };
                }
                acc[r.Date].total += 1;
                if (r.Status === "Active") acc[r.Date].active += 1;
                if (r.Status === "Cancelled") acc[r.Date].cancelled += 1;
                return acc;
              }, {})
            ).map(([date, data]) => (
              <tr
                key={date}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="border border-gray-300 px-4 py-2 font-medium">{date}</td>
                <td className="border border-gray-300 px-4 py-2">{data.total}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2">
                    Active: {data.active}
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    Cancelled: {data.cancelled}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center py-4 italic">No reservation data available.</p>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
