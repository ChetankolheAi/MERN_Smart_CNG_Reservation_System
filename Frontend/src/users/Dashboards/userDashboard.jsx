import { useState ,useEffect  } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CalendarCheck, Car, TrendingUp, Filter, Clock } from "lucide-react";
import api from "../../api/api";// Mock Data - In a real app, this comes from your API
const bookingData = {

};
const getAllMonthsData = (data) => {
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return allMonths.map(month => ({
    name: month,
    bookings: data.find(item => item.name === month)?.bookings || 0
  }));
};
const recentBookings = [
  { id: 1, car: "Toyota Camry", date: "July 12, 2026", status: "Completed" },
  { id: 2, car: "Honda City", date: "July 10, 2026", status: "In Progress" },
];

export default function UserDashboard() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [dashboard, setDashboard] = useState({
    totalBookings: 0,
    activeBookings: 0,
    averageMonthly: 0,
    chartData: [],
    recentBookings: [],
});

useEffect(() => {
    fetchDashboard();
}, [selectedYear]);



const fetchDashboard = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await api.get(
      `/booking/user-dashboard?year=${selectedYear}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDashboard(res.data);

  } catch (err) {
    console.log(err);
  }
};
const currentYear = new Date().getFullYear();

const years = Array.from({ length: 3 }, (_, i) => currentYear - i);
const currentData = getAllMonthsData(bookingData[selectedYear] || []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage and analyze your travel activity</p>
          </div>
          
          <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-white outline-none cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Total Bookings", value: dashboard.totalBookings, icon: <CalendarCheck className="text-green-600" /> },
            { title: "Active Rides", value: dashboard.activeBookings, icon: <Car className="text-blue-600" /> },
            { title: "Avg. Monthly", value: dashboard.averageMonthly, icon: <TrendingUp className="text-purple-600" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 w-full">
  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">
    Bookings ({selectedYear})
  </h3>
  
  {/* Reduced height to 200px for a more compact dashboard feel */}
  <div className="h-[200px] w-full -ml-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dashboard.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
        
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
          // On mobile, show fewer labels to prevent overlap
          interval="preserveStartEnd" 
        />
        
        <YAxis 
          stroke="#94a3b8" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          width={25}
        />
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '12px',
            color: '#fff' 
          }} 
        />
        
        <Line 
          type="monotone" 
          dataKey="bookings" 
          stroke="#22c55e" 
          strokeWidth={2} 
          dot={{ r: 3, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} 
          activeDot={{ r: 5 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

          </div>
      
        
      
    </div>
  );
}