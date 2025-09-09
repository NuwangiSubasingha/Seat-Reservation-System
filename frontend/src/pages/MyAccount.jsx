import { useEffect, useState } from "react";
import API from "../api";

const MyAccount = () => {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT from login
        const res = await API.get("/reservations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReservations(res.data);

        // Get user info from first reservation if exists
        if (res.data.length > 0) {
          setUser({ name: res.data[0].user.name, id: res.data[0].user._id });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      await API.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReservations(reservations.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const modifyReservation = (id) => {
    alert("Modify reservation functionality coming soon!");
  };

  if (loading) return <p className="p-10 text-center">Loading reservations...</p>;

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-2 text-center">My Account</h1>
      {user.name && (
        <p className="text-center text-gray-700 mb-6">
          Welcome, <span className="font-semibold">{user.name}</span> (ID: {user.id})
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
                  <p className="font-semibold">{resv.seat.label}</p>
                  <p className="text-gray-500">
                    {reservationDate.toLocaleDateString()}{" "}
                    {reservationDate.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isFuture ? (
                    <>
                      <button
                        onClick={() => cancelReservation(resv._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => modifyReservation(resv._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Modify
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Past Reservation</span>
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
