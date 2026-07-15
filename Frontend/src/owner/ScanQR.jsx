import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Upload } from "lucide-react"; // Install lucide-react if you haven't
import api from "../api/api";
import toast from "react-hot-toast";

export default function ScanQR() {
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCode = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");
    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current.stop();
      }
    };
  }, []);

  // Handle Camera Scanning
  const startScanning = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        await html5QrCode.current.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            stopScanning();
            verifyBooking(decodedText);
          }
        );
        setIsScanning(true);
      }
    } catch (err) {
      toast.error("Camera access failed");
    }
  };

  const stopScanning = async () => {
    if (html5QrCode.current?.isScanning) {
      await html5QrCode.current.stop();
      setIsScanning(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const decodedText = await html5QrCode.current.scanFile(file, true);
      verifyBooking(decodedText);
    } catch (err) {
      toast.error("Could not scan QR from file");
    }
  };

  const verifyBooking = async (qrToken) => {
    const loading = toast.loading("Verifying...");
    try {
      const res = await api.post("/booking/verify-booking", { qrToken }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(res.data.message, { id: loading });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed", { id: loading });
    }
  };

  return (
   <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center px-4 py-8">
  <h1 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">
    Scan Customer QR
  </h1>
  
  <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-3 border border-slate-100 dark:border-slate-800">
    {/* QR Scanner Container: maintains a square aspect ratio */}
    <div id="reader" className="w-full aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950"></div>
    
    <div className="flex gap-3 mt-4">
      {/* Camera Button */}
      <button
        onClick={isScanning ? stopScanning : startScanning}
        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all active:scale-[0.98] ${
          isScanning 
            ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" 
            : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
        }`}
      >
        <Camera size={18} />
        {isScanning ? "Stop" : "Start"}
      </button>

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
      >
        <Upload size={18} />
        Upload
      </button>
    </div>
  </div>
</div>
  );
}