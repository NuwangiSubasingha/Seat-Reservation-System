import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { QRCodeSVG } from "qrcode.react";

const MyAccount = () => {
  const [user, setUser] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          navigate("/");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Updated: download QR as larger PNG
  const downloadQR = (id, filename) => {
    const svg = document.getElementById(id);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      const scale = 4; // make PNG 3x larger
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");

      ctx.scale(scale, scale); // scale content for high-res
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngFile;
      a.download = `${filename}.png`;
      a.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
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
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      <div className="relative z-10 max-w-5xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-blue-200">
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

        <h2 className="text-2xl font-semibold mb-8 text-gray-800 border-b-4 border-blue-900 pb-3">
          ✨ Your Reservations
        </h2>

        {reservations.length === 0 ? (
          <p className="text-gray-600 italic text-center bg-white p-8 rounded-2xl shadow-inner border border-gray-300">
            You don’t have any reservations yet.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {reservations.map((resv) => {
              const reservationDate = new Date(resv.Date);
              const isFuture = reservationDate >= new Date() && resv.Status === "Active";

              const qrId = `qr-${resv.ReservationID || resv._id}`;
              const qrValue = `${resv.SeatID?.SeatNumber || "Unknown"} - ${user.name || "Guest"}`;
              const fileName = `Seat-${resv.SeatID?.SeatNumber || "Unknown"}-${user.name || "Guest"}`;

              return (
                <div
                  key={resv.ReservationID || resv._id}
                  className={`p-3 rounded-xl shadow-md border transition transform hover:scale-[1.01] hover:shadow-lg bg-blue-50 flex justify-between items-start gap-4`}
                >
                  {/* Left: Details */}
                  <div className="flex-1 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Seat Number:</span>{" "}
                      <span className="text-blue-800 font-bold">{resv.SeatID?.SeatNumber || "Unknown"}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Booking Date:</span>{" "}
                      <span>{reservationDate.toLocaleDateString()}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Time Slot:</span>{" "}
                      <span>{resv.TimeSlot}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`${
                          resv.Status === "Active" ? "text-sky-700 font-bold" : "text-red-600 font-bold"
                        }`}
                      >
                        {resv.Status}
                      </span>
                    </p>

                    {isFuture && (
                      <button
                        onClick={() => cancelReservation(resv.ReservationID || resv._id)}
                        className="mt-2 w-full px-3 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Right: QR Code */}
                  {isFuture ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative">
                        <QRCodeSVG
                          id={qrId}
                          value={qrValue}
                          size={100} // keeps display size small
                          bgColor="#ffffff"
                          fgColor="#0ea5e9"
                          level="H"
                          includeMargin={true}
                        />
                        <span className="absolute -top-4 -right-1 bg-sky-600 text-white text-[10px] font-bold px-1 py-[1px] rounded">
                          Upcoming
                        </span>
                      </div>
                      <button
                        onClick={() => downloadQR(qrId, fileName)}
                        className="px-3 py-0.5 bg-green-500 text-white text-sm rounded-md shadow-sm hover:bg-green-600 transition"
                      >
                        Download QR
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 text-center text-gray-500 italic py-1">Past / Cancelled</span>
                  )}
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
