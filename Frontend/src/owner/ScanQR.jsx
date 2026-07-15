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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Scan Customer QR</h1>
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4">
        <div id="reader" className="w-full"></div>
        
        <div className="flex gap-2 mt-4">
          {/* Camera Button */}
          <button
            onClick={isScanning ? stopScanning : startScanning}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-colors ${
              isScanning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <Camera size={18} />
            {isScanning ? "Stop Camera" : "Start Camera"}
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
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 transition-colors"
          >
            <Upload size={18} />
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}