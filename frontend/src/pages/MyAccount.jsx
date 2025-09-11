import { useEffect, useState } from "react";
import API from "../api";

const MyAccount = () => {
  const [user, setUser] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser({ name: loggedUser.Name, id: loggedUser.ID });
    }

    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(res.data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(reservations.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error cancelling reservation:", err);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading reservations...</p>;

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-2 text-center">My Account</h1>
      {user.name && (
        <p className="text-center text-gray-700 mb-6">
          Welcome, <span className="font-semibold">{user.name}</span>
        </p>
      )}

      <h2 className="text-xl font-semibold mb-4">Your Reservations</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-600">You have no reservations.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((resv) => {
            const reservationDate = new Date(resv.date);
            const isFuture = reservationDate > new Date();

            return (
              <div
                key={resv._id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    Seats Number: {resv.selectedSeats.join(", ")}
                  </p>
                  <p className="text-gray-500">
                    Booking Date: {reservationDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isFuture ? (
                    <button
                      onClick={() => cancelReservation(resv._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">
                      Past Reservation
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAccount;
