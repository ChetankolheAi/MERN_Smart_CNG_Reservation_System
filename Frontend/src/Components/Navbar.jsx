import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
  Bell,
  Sun,
  Settings,
  LogIn,
  Fuel,
  Moon
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ setSidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
const getHomePath = () => {
  if (!user) return "/";
  if (user.role === "admin") return "/admin-dashboard";
  if (user.role === "owner") return "/ownerDashboard"; // Or wherever they should go
  return "/";
};
  return (
    <header className="h-16 px-3 sm:px-5 lg:px-8 flex items-center justify-between shadow-lg bg-gray-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
      {/* Left: Logo & Navigation */}
      <div className="flex items-center gap-8">
            <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
        >
            <Menu size={26}/>
        </button>
      <h1 className="flex items-center gap-2 font-black">
        <Fuel 
          className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 shrink-0" 
        />
        <span 
          className="text-slate-900 dark:text-white cursor-pointer text-lg sm:text-xl md:text-2xl whitespace-nowrap" 
          onClick={() => navigate(getHomePath())}
        >
          BookMy<span className="text-green-500">CNG</span>
        </span>
      </h1>
    
        
        {/* Navigation Buttons */}
        {user?(
            <nav className="hidden md:flex items-center gap-4 text-sm font-semibold pt-1">
          <Link to="/about" className="px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            How it works
          </Link>
          <Link to="/contact" className="px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            Contact Us
          </Link>
        </nav>
    ):(<></>)}
        
      </div>

      {/* Right: Tools & Auth */}
      <div className="flex items-center gap-5">
       

     <button
        onClick={() => setDark(!dark)}
        className="
          p-2
          sm:p-2.5
          rounded-lg
          sm:rounded-xl
          bg-slate-200 dark:bg-slate-700
          hover:bg-slate-300 dark:hover:bg-slate-600
          transition-all duration-300
          flex items-center justify-center
        "
      >
        {dark ? (
          <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>


        {user ? (
         <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="https://i.pravatar.cc/100"
            alt="Profile"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-green-400"
          />

          <div className="hidden sm:block">
            <h3 className="font-semibold text-sm sm:text-base">
              {user.fullName.split(" ")[0]}
            </h3>
            <p className="text-xs text-slate-500 capitalize">
              {user.role}
            </p>
          </div>
        </div>
        ) : (
          <Link
            to="/login"
            className="
              flex items-center justify-center gap-2
              px-3 py-2
              sm:px-5 sm:py-2.5
              rounded-xl sm:rounded-2xl
              bg-gradient-to-r from-green-500 to-emerald-600
              text-white font-semibold
              text-sm sm:text-base
              hover:scale-105
              transition-all duration-300
              shadow-lg shadow-green-500/30
              whitespace-nowrap
            "
          >
            <LogIn size={18} className="sm:w-[18px] sm:h-[18px] w-5 h-5" />

            <span className="hidden xs:inline">
              Join us
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}