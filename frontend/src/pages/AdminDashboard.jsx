import React, { useState, useEffect } from "react";
import { FaChair } from "react-icons/fa";
import API from "../api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("seats");
  const [seats, setSeats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState({ type: "date", value: "" });

  // Fetch seats
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

  // Add seat
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

  // Remove seat
  const removeSeat = async (seatId) => {
    try {
      await API.delete(`/seats/${seatId}`);
      setSeats(seats.filter((seat) => seat._id !== seatId));
    } catch (err) {
      console.error("Error removing seat", err);
      alert("Failed to remove seat.");
    }
  };

  // Fetch reservations (admin view)
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

  // Fetch reservations when Reservations or Reports tab is active
  useEffect(() => {
    if (activeTab === "reservations" || activeTab === "reports") {
      fetchReservations();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Welcome, Admin! Here you can manage the system.
      </p>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        {["seats", "reservations", "reports"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === tab
                ? "bg-blue-900 text-white"
                : "bg-white shadow hover:bg-gray-200"
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
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {activeTab === "seats" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Manage Seats</h2>
            <div className="mb-4">
              <button
                onClick={addSeat}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 mr-2"
              >
                ➕ Add Seat
              </button>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {seats.map((seat) => (
                <div
                  key={seat._id}
                  className="flex flex-col items-center p-2 bg-gray-200 rounded-lg shadow"
                >
                  <FaChair className="text-3xl text-blue-700 mb-1" />
                  <span className="text-sm font-semibold mb-1">
                    {seat.SeatNumber}
                  </span>
                  <button
                    onClick={() => removeSeat(seat._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
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
            <h2 className="text-2xl font-bold mb-4">Manage Reservations</h2>
            <p className="text-gray-600 mb-4">
              View, approve, or cancel reservations.
            </p>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-4">
              <select
                value={filter.type}
                onChange={(e) =>
                  setFilter({ ...filter, type: e.target.value, value: "" })
                }
                className="px-3 py-2 border rounded-lg"
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
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={fetchReservations}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                🔍 Search
              </button>
            </div>

            {/* Reservations Table */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Reservation ID</th>
                  <th className="border border-gray-300 px-4 py-2">Intern ID</th>
                  <th className="border border-gray-300 px-4 py-2">Seat</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Time Slot</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((r) => (
                    <tr key={r.ReservationID}>
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
                        {r.Status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500"
                    >
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
        

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Seat Summary</h3>
                <p>Total Seats: {seats.length}</p>
                <p>
                  Available Seats: {seats.filter((s) => s.Status !== "Unavailable").length}
                </p>
                <p>
                  Unavailable Seats: {seats.filter((s) => s.Status === "Unavailable").length}
                </p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Reservation Summary</h3>
                <p>Total Reservations: {reservations.length}</p>
                <p>
                  Active Reservations: {reservations.filter((r) => r.Status === "Active").length}
                </p>
                <p>
                  Cancelled Reservations: {reservations.filter((r) => r.Status === "Cancelled").length}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Reservations Per Date</h3>
              {reservations.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-gray-200">
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
                        className="hover:bg-gray-100 transition-colors duration-200"
                      >
                        <td className="border border-gray-300 px-4 py-2 font-medium">{date}</td>
                        <td className="border border-gray-300 px-4 py-2">{data.total}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                            Active: {data.active}
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Cancelled: {data.cancelled}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-4">No reservation data available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
