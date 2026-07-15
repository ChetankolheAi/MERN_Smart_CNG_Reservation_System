import { useState, useEffect } from "react";
import { Calendar, XCircle, Loader2, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import QRCode from "react-qr-code";
import api from "../api/api";
import toast from "react-hot-toast";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // State to toggle visibility

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/booking/user-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedBookings = res.data
        .map((booking) => ({
          ...booking,
          bookingDate: new Date(booking.bookingDate),
          createdAt: new Date(booking.createdAt),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setBookings(formattedBookings);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (id, token) => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const link = document.createElement("a");
      link.download = `FastPass-${token}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Determine which bookings to show based on the toggle
  const displayedBookings = showAll ? bookings : bookings.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold dark:text-white">My Bookings</h1>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <XCircle className="mx-auto text-slate-400" size={55} />
              <h2 className="mt-4 font-bold text-xl dark:text-white">No Bookings Yet</h2>
            </div>
          ) : (
            <>
              {displayedBookings.map((b) => (
                <div key={b._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                  {/* ... same card content as before ... */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {b.qrToken} • {b.createdAt.toLocaleString("en-IN")}
                      </p>
                      <h3 className="font-bold dark:text-white">{b.ownerId?.pumpName}</h3>
                      <h3 className="font-bold dark:text-white/70 text-xs">{b.vehicleNumber}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${b.status === "Pending" ? "bg-slate-800 text-yellow-500" : "bg-slate-800 text-green-500"}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> {b.bookingDate.toLocaleDateString("en-IN")} | {b.slot}
                    </div>
                  </div>
                  <div className="hidden">
                    <QRCode id={`qr-${b._id}`} value={b.qrToken} size={160} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    {b.status === "Pending" && (
                      <button onClick={() => downloadQR(b._id, b.qrToken)} className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">
                        Download QR Pass
                      </button>
                    )}
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-200">
                      <Navigation size={14} /> Get Route
                    </a>
                  </div>
                </div>
              ))}

              {bookings.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showAll ? (
                    <>Show Less <ChevronUp size={16} /></>
                  ) : (
                    <>Show All Bookings ({bookings.length}) <ChevronDown size={16} /></>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}