import React, { useState } from "react";
import { FaChair } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("seats");

  // Example seats layout (rows A-D, columns 1-5)
  const initialSeats = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    label: `Seat ${i + 1}`,
  }));

  const [seats, setSeats] = useState(initialSeats);

 const addSeat = () => {
  // Find max current seat id
  const maxId = seats.length > 0 ? Math.max(...seats.map((s) => s.id)) : 0;
  const newId = maxId + 1;

  setSeats([...seats, { id: newId, label: `Seat ${newId}` }]);
};


  // Remove seat
  const removeSeat = (id) => {
    setSeats(seats.filter((seat) => seat.id !== id));
  };

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
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "seats"
              ? "bg-blue-900 text-white"
              : "bg-white shadow hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("seats")}
        >
          Manage Seats
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "reservations"
              ? "bg-blue-900 text-white"
              : "bg-white shadow hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("reservations")}
        >
          Manage Reservations
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "reports"
              ? "bg-blue-900 text-white"
              : "bg-white shadow hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          View Reports
        </button>
      </div>

      {/* Content Area */}
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
                  key={seat.id}
                  className="flex flex-col items-center p-2 bg-gray-200 rounded-lg shadow"
                >
                  <FaChair className="text-3xl text-blue-700 mb-1" />
                  <span className="text-sm font-semibold mb-1">{seat.label}</span>
                  <button
                    onClick={() => removeSeat(seat.id)}
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
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p className="text-gray-600 mb-4">View system reports and statistics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
