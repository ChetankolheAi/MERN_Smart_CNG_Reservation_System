import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Car, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/api";
export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  mobile: "",
  vehicleNumber: "",
  vehicleType: "",
  password: "",
  confirmPassword: "",
});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSignup = async (e) => {
  e.preventDefault();
  try {

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await api.post("/auth/signup", {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      vehicleNumber: formData.vehicleNumber,
      vehicleType: formData.vehicleType,
      password: formData.password,
    });
console.log("Response:", res);
    alert(res.data.message);

    navigate("/login");

  } catch (err) {
    console.log(err);

    alert(
    err.response?.data?.message ||
    err.message ||
    "Signup Failed"
    );
  }
};
  return (
    <div className="min-h-screen flex bg-green-50 dark:bg-slate-950 items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Register to continue</p>

         <form
            onSubmit={handleSignup}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
            >
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Full Name</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <User className="text-slate-500 dark:text-slate-400" size={16} />
                <input
                 type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                  className="bg-transparent py-2.5 px-3 outline-none w-full text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Email</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Mail className="text-slate-500 dark:text-slate-400" size={16} />
                <input
                  type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  className="bg-transparent py-2.5 px-3 outline-none w-full text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Mobile Number</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Phone className="text-slate-500 dark:text-slate-400" size={16} />
                <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                  className="bg-transparent py-2.5 px-3 outline-none w-full text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Vehicle Number</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Car className="text-slate-500 dark:text-slate-400" size={16} />
                <input
                   type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="MH12AB1234"
                  className="bg-transparent py-2.5 px-3 outline-none w-full text-slate-900 dark:text-white text-sm uppercase placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="sm:col-span-2">
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Vehicle Type</label>
              <select 
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-lg py-2.5 px-3 text-slate-900 dark:text-white text-sm outline-none border border-slate-200 dark:border-none appearance-none">
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto Rickshaw</option>
                <option value="taxi">Taxi</option>
                <option value="bus">Bus</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Password</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Lock className="text-slate-500 dark:text-slate-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  className="bg-transparent py-2.5 px-3 outline-none w-full text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium">Confirm Password</label>
              <div className="mt-1.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3">
                <Lock className="text-slate-500 dark:text-slate-400" size={16} />
                <input
                  type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                  className="bg-transparent py-2.5 px-3 outline-none w-full text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="terms" className="accent-green-600 w-4 h-4 rounded cursor-pointer" />
              <label htmlFor="terms" className="text-slate-600 dark:text-slate-400 text-xs cursor-pointer">
                I agree to the Terms & Conditions
              </label>
            </div>

            {/* Button */}
            <button 
              type="submit" 
              className="sm:col-span-2 w-full mt-2 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-slate-600 dark:text-slate-400">Already have an account?</span>
            <button 
              onClick={() => navigate("/login")}
              className="ml-2 text-green-600 dark:text-green-400 font-medium hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}