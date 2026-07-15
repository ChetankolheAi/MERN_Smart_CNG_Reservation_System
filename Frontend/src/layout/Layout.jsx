import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [collapse, setCollapse] = useState(false);
  return (
    <div className="flex h-screen">

      <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapse={collapse}
          setCollapse={setCollapse}
      />


      <div className="flex-1 flex flex-col">

        <Navbar
              setSidebarOpen={setSidebarOpen}
          />

        <main className="flex-1 overflow-y-auto ">
          <Outlet />
        </main>

      </div>

    </div>
  );
}