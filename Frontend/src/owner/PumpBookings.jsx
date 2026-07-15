import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, User, Hash, ChevronDown, ChevronUp } from "lucide-react";
import api from "../api/api"; 

export default function PumpBookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [showAll, setShowAll] = useState(false); // New state for toggle

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/booking/owner-bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Sort by createdAt: newest first
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sorted);
    } catch (err) {
      console.error(err);
    }
  };
const filteredBookings = useMemo(() => {
  if (!Array.isArray(bookings)) return [];

  return bookings.filter((b) => {
    const searchLower = searchTerm.toLowerCase();

    const vehicleNumber = (b.vehicleNumber || "").toLowerCase();
    const qrToken = (b.qrToken || "").toLowerCase();

    const bookingDate = b.bookingDate
      ? new Date(b.bookingDate).toLocaleDateString("en-GB") // 16/07/2026
      : "";

    return (
      vehicleNumber.includes(searchLower) ||
      qrToken.includes(searchLower) ||
      bookingDate.includes(searchLower)
    );
  });
}, [bookings, searchTerm]);

  // Determine items to display based on search or toggle
  const displayCount = showAll ? filteredBookings.length : 3;
  const visibleBookings = filteredBookings.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
  <div className="max-w-xl mx-auto space-y-6">
    
    {/* Search Bar */}
    <div className="relative sticky top-4 z-10">
      <Search className="absolute left-4 top-4 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Search vehicle, token, or date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white text-sm"
      />
    </div>

    {/* Bookings List */}
    <div className="space-y-4">
      {visibleBookings.length > 0 ? (
        <>
          {visibleBookings.map((b) => (
            <div 
              key={b._id} 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-green-500/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                  <Hash className="text-slate-400" size={12} />
                  <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 tracking-wider">
                    {b.qrToken}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                  b.status === "Pending" 
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-500" 
                    : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-500"
                }`}>
                  {b.status}
                </span>
              </div>

              <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3 tracking-tight">
                {b.vehicleNumber || b.carNumber || "No Plate"}
              </h3>

              <div className="flex gap-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-green-500" /> 
                  {new Date(b.bookingDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-green-500" /> 
                  {b.slot}
                </div>
              </div>
            </div>
          ))}

          {/* Toggle Button */}
          {filteredBookings.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-4 flex items-center justify-center gap-2 text-sm font-black text-slate-400 hover:text-green-600 transition-all uppercase tracking-widest"
            >
              {showAll ? (
                <>Show Less <ChevronUp size={16} /></>
              ) : (
                <>View All ({filteredBookings.length}) <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-400 font-bold">No bookings match your search.</p>
        </div>
      )}
    </div>
  </div>
</div>
  );
}