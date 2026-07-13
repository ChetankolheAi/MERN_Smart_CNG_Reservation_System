import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Menu,
  Search,
  ChevronLeft,
  LogOut,
  ArrowLeft,
  Fuel
} from "lucide-react";

import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sidebarData from "../Data/sidebarData";


export default function Sidebar() {
  const [collapse, setCollapse] = useState(true);
const navigate = useNavigate();
 const user = JSON.parse(localStorage.getItem("user"));

  return (
    <motion.div
      animate={{
        width: collapse ? 85 : 290,
      }}
      transition={{ duration: .3 }}
      className="h-screen bg-slate-900 border-r border-slate-800 flex flex-col"
    >
      {/* Logo */}
      
      <div className="flex items-center justify-between px-5 py-6">

        {!collapse && (
         <div className="flex flex-col">
  <h1
    onClick={() => navigate("/")}
    className="text-xl font-bold cursor-pointer w-[180px]"
  >
    {user ? (
      <>
        Welcome, <span className="text-green-500">{user.name} 👋</span>
      </>
    ) : ( 
      <div className="text-white">
        Welcome to <span className="text-green-500">BookMyCNG👋</span>
      </div>
    )}
  </h1>

  <p className="mt-1 text-[10px] text-slate-400 leading-4 ">
    {user
      ? "Ready to book your next CNG slot."
      : "Sign in to reserve slots and skip the queue."}
  </p>
</div>
        )}
<button
  onClick={() => setCollapse(!collapse)}
  className="
    w-11 h-11
    flex items-center justify-center
    rounded-full
    bg-gradient-to-r from-green-400 to-emerald-500
    text-white
    shadow-lg shadow-green-500/30
    hover:scale-110
    hover:shadow-xl hover:shadow-green-500/50
    active:scale-95
    transition-all duration-300
  "
>
  {collapse ? <Menu size={20} /> : <ArrowLeft size={20} />}
</button>

      </div>

      {/* User */}
      {
  user ? (
    <div className="px-4">
      <div className="rounded-2xl flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100"
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />

        {!collapse && (
          <div>
            <h2 className="text-white font-semibold">
              Chetan Kolhe
            </h2>
            <p className="text-slate-400 text-sm">
              User
            </p>
          </div>
        )}
      </div>
    </div>
  ) : (
 <></>
  )
}
      

     

      {/* Menus */}

     <div className="mt-8 flex-1 px-3">
  {sidebarData
  .filter(item => item.public || user)
  .map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.title}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center justify-between rounded-xl px-5 py-3 mb-2 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-green-700 to-emerald-500 text-white shadow-lg shadow-green-500/20"
              : "text-slate-300 hover:bg-slate-800"
          }`
        }
      >
        <div className="flex items-center gap-3">
          <Icon size={22} />
          {!collapse && <span>{item.title}</span>}
        </div>

        {!collapse && item.badge && (
          <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  })}
</div>
{!user?(<Link
  to="/login"
  className="
    mx-5 mt-4
    flex items-center justify-center gap-2
    py-3
    rounded-xl
    bg-gradient-to-r from-green-500 to-emerald-600
    text-white font-semibold
    hover:scale-[1.03]
    transition-all duration-300
    shadow-lg shadow-green-500/30
    mb-4
  "
>
  <LogIn size={18} />
  {!collapse && <span>Login</span>}
</Link>):(
    <></>
)}
      {/* Logout */}

      {user && (
  <div className="p-4">
    <button
      className="w-full p-3 flex items-center justify-center gap-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
    >
      <LogOut size={20} />
      {!collapse && "Logout"}
    </button>
  </div>
)}

    </motion.div>
  );
}