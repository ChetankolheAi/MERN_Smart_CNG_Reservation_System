import { useState, useMemo,useEffect } from "react";
import QRCode from "react-qr-code";
import { ArrowLeft, Fuel, CreditCard, CheckCircle2 ,Navigation } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/api";
import { useNavigate } from "react-router-dom";


import { useLocation } from "react-router-dom";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
const generateTimeSlots = () => {
  const slots = [];
  let hour = 8;
  let minute = 0;
  
  while (hour < 20) { // Up to 8:00 PM
    const timeString = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? "00" : "30"} ${hour >= 12 ? "PM" : "AM"}`;
    slots.push({ time: timeString, available: Math.random() > 0.3 }); // Random availability for demo
    minute += 30;
    if (minute === 60) {
      hour++;
      minute = 0;
    }
  }
  return slots;
};

// Use this inside your component:
export default function BookingPage({ userLocation = { lat: 18.5204, lon: 73.8567 } }) {
  const [selectedPump, setSelectedPump] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [range, setRange] = useState(30);
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    pump: "",
    pumpId: "",
    date: "",
    time: "",
    carModel: "",
    carPlate: "",
  });
  
  const location = useLocation();
  
useEffect(() => {
  if (location.state?.pump) {
    setSelectedPump(location.state.pump);

    setFormData((prev) => ({
      ...prev,
      pump: location.state.pump.pumpName,
      pumpId: location.state.pump._id,
    }));

    setStep(2);
  }
}, [location.state]);const [stations, setStations] = useState([]);
const dates = useMemo(
  () =>
    Array.from({ length: 3 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);

      return {
        day: d.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", {
          month: "short",
        }), // Jul
        monthFull: d.toLocaleDateString("en-US", {
          month: "long",
        }), // July
        year: d.getFullYear(), // 2026
        full: d.toISOString().split("T")[0],
      };
    }),
  []
);

const filteredStations = useMemo(() => {
  return stations
    .map((s) => {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        Number(s.latitude),
        Number(s.longitude)
      );

      console.log("Pump:", s.pumpName);
      console.log("Distance:", dist);

      return {
        ...s,
        dist,
      };
    })
    .filter((s) => s.dist <= range)
    .sort((a, b) => a.dist - b.dist);
}, [stations, range, userLocation]);

const [bookingToken, setBookingToken] = useState("");

const processPayment = async () => {

    const loading = toast.loading("Booking your slot...");
    console.log(formData)
    try{

        const token = localStorage.getItem("token");

        const res = await api.post(
            "/booking/create",
            {
                pumpId: formData.pumpId,
                bookingDate: formData.date,
                bookingTime: formData.time,
                vehicleNumber: formData.carPlate,

                vehicleType: formData.carModel,
                bookingAmount:20
            },
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        console.log(res)
        toast.success("Booking Confirmed",{
            id:loading
        });
        setBookingToken(res.data.booking.qrToken);

        setStep(5);

    }
    catch(err){

        toast.error(
            err.response?.data?.message || "Booking Failed",
            {
                id:loading
            }
        );
    }

}

useEffect(() => {
  const fetchStations = async () => {
    try {
      const res = await api.get("/pump/all");
      console.log("API Response:", res.data);
      setStations(res.data);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load CNG Stations");
    }
  };

  fetchStations();
}, []);


const fetchAvailableTimeslots = async (pumpId, date) => {
  try {
    const res = await api.get(
      `/booking/available-slots/${pumpId}`,
      {
        params: { date },
      }
    );
    setTimeSlots(res.data);
  } catch (err) {
    console.log(err);
    console.log(err.response);
    toast.error("Failed to load available slots");
  }
};


useEffect(() => {
  if (formData.pumpId && formData.date) {
    fetchAvailableTimeslots(formData.pumpId, formData.date);
  }
 
}, [formData.pumpId, formData.date]);

const isPumpClosedOnDate = (date) => {
  if (!selectedPump) return false;

  // No scheduled closure
  if (!selectedPump.closedFrom || !selectedPump.closedTo) {
    return false;
  }

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const from = new Date(selectedPump.closedFrom);
  from.setHours(0, 0, 0, 0);

  const to = new Date(selectedPump.closedTo);
  to.setHours(23, 59, 59, 999);

  return selected >= from && selected <= to;
};



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 ">

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
        
        {/* //Step 1  */}
        {step === 1 && (
         <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-2xl mx-auto">
          
          {/* Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Search Radius</span>
              <span className="text-green-500">{range} KM</span>
            </div>
            <input 
              type="range" min="5" max="100" value={range} 
              onChange={(e) => setRange(Number(e.target.value))} 
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600" 
            />
          </div>

          {/* Station Fetching */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">1. Choose Station</label>
            
            <div className="space-y-4">
              {filteredStations.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => {
                    setSelectedPump(p);
                    setFormData({ ...formData, pump: p.pumpName, pumpId: p._id });
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.pump === p.pumpName
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  {/* Main Card Content */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    
                    {/* Left side: Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`p-3 rounded-xl shrink-0 ${formData.pump === p.pumpName ? "bg-green-100 text-green-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                        <Fuel size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold dark:text-white truncate">{p.pumpName}</p>
                        <p className="text-xs text-slate-400 truncate">{p.address}</p>
                        <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-1">
                          {p.dist.toFixed(1)} km away
                        </p>
                      </div>
                    </div>

                    {/* Right side: Action Button */}
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevent card selection when clicking route
                      className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-white text-xs font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <Navigation size={14} /> Get Route
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              disabled={!formData.pump} 
              onClick={() => setStep(2)} 
              className="w-full bg-slate-950 dark:bg-green-500 text-white dark:text-slate-950 py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-30 transition-all active:scale-[0.98]"
            >
              Confirm Selection
            </button>
          </div>
        </div>
        )}


        {/* //Step :- 2 */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 w-full max-w-2xl mx-auto">
              <button 
                onClick={() => setStep(1)} 
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-green-600 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>

              {/* Date Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  2. Select Date (Next 2 Days)
                </label>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {dates.map((d) => {
                    const closed = isPumpClosedOnDate(d.full);
                    return (
                      <button 
                        key={d.full} 
                        disabled={closed}
                        onClick={() => setFormData({...formData, date: d.full, time: ""})} 
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 min-w-[90px] transition-all ${
                          closed
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed border-dashed opacity-70"
                          : formData.date === d.full 
                            ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20" 
                            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-950 dark:text-white hover:border-green-500"
                        }`}
                      >
                        <span className="text-[10px] font-bold opacity-70 uppercase">{d.day}</span>
                        <span className="text-lg font-black">{d.date}</span>
                        <p className="text-[10px] font-bold opacity-70 uppercase">{d.month}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  3. Available Hours (8 AM – 8 PM)
                </label>
                
                {/* Responsive Grid: 3 columns on mobile, 6 on desktop */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.isFull}
                      onClick={() => setFormData({ ...formData, time: slot.time })}
                      className={`group flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all 
                        ${slot.isFull
                          ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-50"
                          : formData.time === slot.time
                          ? "bg-green-600 border-green-600 text-white shadow-lg scale-[1.02]"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-green-500"
                        }`}
                    >
                      <span className={`text-sm font-bold ${formData.time === slot.time ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                        {slot.time}
                      </span>
                      <span className={`text-[9px] font-bold mt-1 uppercase ${
                        slot.isFull ? "text-slate-400" : formData.time === slot.time ? "text-green-100" : "text-green-600"
                      }`}>
                        {slot.isFull ? "Full" : `${slot.available} Left`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <div className="pt-4">
                <button 
                  disabled={!formData.date || !formData.time} 
                  onClick={() => setStep(3)} 
                  className="w-full bg-slate-950 dark:bg-green-500 text-white dark:text-slate-950 py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-30 transition-all active:scale-[0.98]"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          )}

        {/* //Step :- 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <ArrowLeft size={14} /> Back to Selection
            </button>
            <h2 className="text-xl font-bold dark:text-white mb-4">Vehicle Details</h2>
            
            <div className="space-y-3">
             
             {/* //Vehicle Type Selection */}
              <select 
                value={formData.carModel} 
                onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 dark:text-white focus:border-green-500 outline-none"
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Commercial">Commercial/Taxi</option>
              </select>

              {/* //Vehical Number  */}
              <input 
                type="text" 
                placeholder="License Plate (e.g. MH12AB1234)" 
                required 
                value={formData.carPlate}
                onChange={(e) => setFormData({...formData, carPlate: e.target.value.toUpperCase()})}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 dark:text-white focus:border-green-500 outline-none uppercase" 
              />
            </div>

          <button 
              // 1. Ensure you check against the correct state variable
              disabled={!formData.carModel || !formData.carPlate}
              onClick={() => {
                // 2. Define the pattern (India format: 2 letters, 2 numbers, 2 letters, 4 numbers)
                const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
                
                // 3. Test the correct variable (carPlate)
                if (!vehicleRegex.test(formData.carPlate.toUpperCase())) {
                  toast.error("Enter a valid license plate (e.g., MH12AB1234)");
                } else {
                  setStep(4);
                }
              }} 
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all mt-4"
            >
              Lock Dynamic Slot
            </button>
          </div>

        )}


          {/* Step :- 4 */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 w-full max-w-2xl mx-auto">
              <h2 className="text-xl font-black dark:text-white">Booking Overview</h2>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                
                <div className="space-y-4">
                  {[
                    { label: "Station", value: formData.pump },
                    { label: "Schedule", value: `${formData.date} @ ${formData.time}` },
                    { label: "Vehicle", value: formData.carModel },
                    { label: "Plate", value: formData.carPlate.toUpperCase() },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{item.label}</span>
                      <span className="font-bold dark:text-white text-sm sm:text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800" />
                
                {/* Price Section */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-900 dark:text-white font-bold">Total Payable</span>
                  <span className="text-2xl font-black text-green-500">₹20.00</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button 
                onClick={processPayment} 
                className="w-full bg-slate-950 dark:bg-green-500 text-white dark:text-slate-950 py-4 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-green-500/20"
              >
                <CreditCard size={20} /> Pay & Confirm
              </button>
            </div>
          )}

        {/* Step :- 5 */}
    
     {step === 5 && (
  <div className="flex justify-center p-4 sm:py-6">
    <div className="text-center space-y-8 animate-in zoom-in duration-300 w-full max-w-[400px] bg-slate-800 dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl">
      
      {/* Success Header */}
      <div className="space-y-3">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/5">
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Pass Secured</h2>
          <p className="text-sm text-slate-400 mt-1">
            Thank you for choosing <span className="font-bold text-green-400">BOOKMYCNG</span>
          </p>
        </div>
      </div>

      {/* QR Card */}
      <div className="relative p-6 bg-white rounded-3xl shadow-inner">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-1 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest border border-slate-700">
          Secure Token
        </div>
        
        <div id="qr-code-container" className="flex justify-center mb-6">
          <div className="p-2 bg-slate-100 rounded-xl">
            {/* Using max-w-full to prevent QR from overflowing on tiny phones */}
            <QRCode id="qr-code-svg" value={bookingToken} size={160} className="w-full h-auto max-w-[160px]" />
          </div>
        </div>

        <div className="font-mono text-lg font-bold text-slate-900 tracking-tighter bg-slate-100 py-3 rounded-xl border border-slate-200">
          {bookingToken}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button 
          onClick={() => {
            const svg = document.getElementById("qr-code-svg");
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
              const downloadLink = document.createElement("a");
              downloadLink.download = `FastPass-${bookingToken}.png`;
              downloadLink.href = canvas.toDataURL("image/png");
              downloadLink.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(svgData);
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-600/20 transition-all active:scale-[0.98]"
        >
          Download QR Pass
        </button>

        <button 
          onClick={() => navigate("/")} 
          className="w-full text-slate-400 hover:text-white text-sm font-bold py-2 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
      
    </div>
  </div>
)}
        
      </div>
    </div>
  );
}