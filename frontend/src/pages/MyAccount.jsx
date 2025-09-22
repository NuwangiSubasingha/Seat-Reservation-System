import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import API from "../api";

const MyAccount = () => {
  const [user, setUser] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ hook for navigation

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser({ name: loggedUser.Name, id: loggedUser.ID });
    }

    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in again.");
          navigate("/"); // redirect if not logged in
          return;
        }

        const res = await API.get("/reservations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sorted = res.data.sort((a, b) => {
          const today = new Date();
          const dateA = new Date(a.Date);
          const dateB = new Date(b.Date);

          const isFutureA = dateA >= today && a.Status === "Active";
          const isFutureB = dateB >= today && b.Status === "Active";

          if (isFutureA && !isFutureB) return -1;
          if (!isFutureA && isFutureB) return 1;

          return dateB - dateA;
        });

        setReservations(sorted);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations(reservations.filter((r) => (r.ReservationID || r._id) !== id));
    } catch (err) {
      console.error("Error cancelling reservation:", err);
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // redirect to login
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <p className="text-xl font-bold text-blue-800 animate-pulse bg-white px-6 py-3 rounded-xl shadow-lg border">
          Loading your reservations...
        </p>
      </div>
    );

  return (
  <div className="relative min-h-screen p-10 bg-gradient-to-r from-blue-50 to-blue-300">
  {/* Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-20"></div>

  {/* Content */}
  <div className="relative z-10 max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-blue-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-lg tracking-wide">
            My Account
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {user.name && (
          <p className="text-3xl text-center text-black mb-10">
  Welcome,{" "}
  <span className="font-bold text-3xl text-blue-800 bg-blue-100 px-3 py-1 rounded-lg shadow-sm">
    {user.name}
  </span>
</p>

        )}

        {/* Section Title */}
        <h2 className="text-2xl font-semibold mb-8 text-gray-800 border-b-4 border-blue-900 pb-3">
          ✨ Your Reservations
        </h2>

        {/* Reservations List */}
        {reservations.length === 0 ? (
          <p className="text-gray-600 italic text-center bg-white p-8 rounded-2xl shadow-inner border border-gray-300">
            You don’t have any reservations yet.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {reservations.map((resv) => {
              const reservationDate = new Date(resv.Date);
              const isFuture = reservationDate >= new Date() && resv.Status === "Active";

              return (
   <div
  key={resv.ReservationID || resv._id}
  className={`p-1 rounded-2xl shadow-lg border relative transition transform hover:scale-[1.02] hover:shadow-2xl ${
    isFuture
      ? "bg-gradient-to-br from-sky-100 to-sky-200 border-sky-400"
      : "bg-gradient-to-br from-gray-100 to-blue-100 border-blue-300"
  }`}
>
  {/* Ribbon */}
  <span
    className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-md ${
      isFuture
        ? "bg-sky-600 text-white"
        : "bg-blue-400 text-white"
    }`}
  >
    {isFuture ? "Upcoming" : "Past"}
  </span>

  {/* Details */}
  <div className="space-y-2">
    <p className="font-semibold text-gray-900">
      Seat Number:{" "}
      <span className="text-blue-800 font-bold text-lg">
        {resv.SeatID?.SeatNumber || "Unknown"}
      </span>
    </p>
    <p className="text-gray-700">
      Booking Date:{" "}
      <span className="font-medium">
        {reservationDate.toLocaleDateString()}
      </span>
    </p>
    <p className="text-gray-700">
      Time Slot:{" "}
      <span className="font-medium">{resv.TimeSlot}</span>
    </p>
    <p
      className={`font-bold mt-1 text-lg ${
        resv.Status === "Active"
          ? "text-sky-700"
          : "text-red-600"
      }`}
    >
      Status: {resv.Status}
    </p>
  </div>

  {/* Actions */}
  <div className="mt-4 flex gap-2">
    {isFuture ? (
      <button
        onClick={() =>
          cancelReservation(resv.ReservationID || resv._id)
        }
        className="flex-1 px-5 py-1 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 hover:shadow-lg transition"
      >
        Cancel
      </button>
    ) : (
      <span className="flex-1 text-center text-gray-500 italic py-1">
        Past / Cancelled
      </span>
    )}
  </div>
</div>



              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
