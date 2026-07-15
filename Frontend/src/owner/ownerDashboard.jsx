  import { motion } from "framer-motion";
  import { 
    ClipboardList, 
    ToggleRight, 
    Gauge, 
    History, 
    TrendingUp, 
    AlertCircle, 
    QrCode ,
    Wrench
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";




  export default function OwnerDashboard() {
    const navigate = useNavigate();
    const [pumpInfo, setPumpInfo] = useState(null);
    const [stats, setStats] = useState({
      activeBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
    
    });
    useEffect(() => {
      fetchDashboard();
    }, []);

const fetchDashboard = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await api.get(
      "/booking/owner-dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats(res.data);

  } catch (err) {

    console.log(err);

  }
};
    const dashboardStats = [
  {
    label: "Active Bookings",
    value: stats.activeBookings,
    icon: ClipboardList,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  }
];

    const quickActions = [
      { title: "Manage Bookings", desc: "View & validate daily queue", path: "/pumpBookings", icon: ClipboardList },
      {
        title: "Manage Pump Status",
        desc: "Control pump availability & closures",
        path: "/managePump",
        icon: Wrench,
      },
      { title: "Live Analytics", desc: "Monitor peak usage times", path: "/owner/analytics", icon: TrendingUp },
    ];
const fetchPumpStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/pump/my-status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPumpInfo(res.data);

    const now = new Date();

    let stationStatus = "Online";

    if (!res.data.isOpen) {
      stationStatus = "Offline";
    } else if (
      res.data.closedFrom &&
      res.data.closedTo &&
      now >= new Date(res.data.closedFrom) &&
      now <= new Date(res.data.closedTo)
    ) {
      stationStatus = "Offline";
    }

    setStats(prev => ({
      ...prev,
      stationStatus,
    }));

  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  fetchDashboard();
  fetchPumpStatus();
}, []);



const getPumpStatus = () => {
  if (!pumpInfo) {
    return {
      isCurrentlyOpen: true,
      reason: "",
    };
  }

  const now = new Date();

  // Emergency closed
  if (!pumpInfo.isOpen) {
    return {
      isCurrentlyOpen: false,
      reason: pumpInfo.closureReason,
    };
  }

  // Scheduled closure
  if (pumpInfo.closedFrom && pumpInfo.closedTo) {
    const from = new Date(pumpInfo.closedFrom);
    const to = new Date(pumpInfo.closedTo);

    if (now >= from && now <= to) {
      return {
       
        isCurrentlyOpen: false,
        reason: pumpInfo.closureReason,
      };
    }
  }

  return {
    isCurrentlyOpen: true,
    reason: "",
  };
};

const currentStatus = getPumpStatus();
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#030712] p-6 lg:p-12 text-slate-900 dark:text-white transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight">Station Dashboard</h1>
              <p className="text-slate-500">Welcome back, manager. Overview of your facility.</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/scanQR")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-green-600/20 flex items-center gap-3"
            >
              <QrCode size={22} />
              Scan Customer QR
            </motion.button>
          </header>

          {/* Stats Grid */}
          <section className="grid sm:grid-cols-3 gap-6">
            {dashboardStats.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="p-6 rounded-3xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-white/[0.08] shadow-sm flex items-center gap-5"
              >
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Action Grid */}
          <section className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <motion.button
                whileHover={{ y: -5 }}
                key={i}
                onClick={() => navigate(action.path)}
                className="p-8 rounded-3xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-white/[0.08] hover:border-green-500/50 transition-all text-left group space-y-4 shadow-sm hover:shadow-2xl hover:shadow-green-500/10"
              >
                <div className="p-3 w-fit rounded-2xl bg-slate-100 dark:bg-slate-800 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <action.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{action.title}</h3>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
              </motion.button>
            ))}
          </section>

          {/* Alert Banner */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row justify-between gap-6"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold dark:text-white">Pump Availability</h3>

              {currentStatus.isCurrentlyOpen ? (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold">
                    🟢 Open
                  </span>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold">
                    🔴 Closed
                  </span>
                  
                  {/* Responsive grid for status details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <p className="text-sm text-slate-500 col-span-full">
                      <strong className="text-slate-700 dark:text-slate-300">Reason:</strong> {pumpInfo?.closureReason}
                    </p>
                    <p className="text-sm text-slate-500">
                      <strong className="text-slate-700 dark:text-slate-300">From:</strong>{" "}
                      {pumpInfo?.closedFrom ? new Date(pumpInfo.closedFrom).toLocaleString("en-IN", { dateStyle: 'short', timeStyle: 'short' }) : "-"}
                    </p>
                    <p className="text-sm text-slate-500">
                      <strong className="text-slate-700 dark:text-slate-300">To:</strong>{" "}
                      {pumpInfo?.closedTo ? new Date(pumpInfo.closedTo).toLocaleString("en-IN", { dateStyle: 'short', timeStyle: 'short' }) : "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Button container - fixed position on mobile or full width */}
            <div className="sm:flex-none">
              <button
                onClick={() => navigate("/managePump")}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
              >
                Change Status
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    );
  }