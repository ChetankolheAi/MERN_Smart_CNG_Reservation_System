import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import UserDashboard from "./users/Dashboards/userDashboard";
import FindNearBYCNG from "./Components/findNearbyCNG";
import BookingPage from "./users/BookingPage";
import UserBookings from './users/UserBookings';

// Auth & Admin Components (Ensure these paths are correct)
import ProtectedRoute from "./routes/ProtectedRoute"; 
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import OwnerRoute from "./routes/OwnerRoute";
import GuestRoute from "./routes/GuestRoute";

import AdminDashboard from "./admin/AdminDash"; // <-- Check this path!
import OwnerDashboard from "./owner/ownerDashboard";
import PumpBookings from "./owner/PumpBookings";
import ManagePump from "./owner/managePump";
import Aboutus from "./Pages/Aboutus";
import Contactus from "./Pages/Contactus";
import Notifications from './Pages/Notifications'
import UserManagement from "./admin/UserManagement";
import ScanQR from "./owner/ScanQR";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={
          <GuestRoute>
          <Login />
          </GuestRoute>} />
        <Route path="signup" element={
          <GuestRoute>
            <Signup />
          </GuestRoute>} />
        
        //userRoutes
          <Route path="userDashboard" element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>} />
          <Route path="findNearbyCNG" element={<UserRoute>
            <FindNearBYCNG />
            </UserRoute>} /> 
          <Route path="bookingPage" element={
            <UserRoute>
            <BookingPage />
            </UserRoute>} />
          <Route path="userBookings" element={<UserRoute>
              <UserBookings />
            </UserRoute>}/>

          <Route
          path="/userManagement"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route path="admin-dashboard" element={
             <AdminRoute>
            <AdminDashboard />
             </AdminRoute>
        } />

        //PumpRoutes
        <Route path="ownerDashboard" element={
          <OwnerRoute>
            <OwnerDashboard />
          </OwnerRoute>} />
        <Route path="pumpBookings" element={     
          <OwnerRoute>
            <PumpBookings />
          </OwnerRoute>} />
        <Route path="managePump" element={     
          <OwnerRoute>
            <ManagePump />
        </OwnerRoute>} />


        //GeneralRoutes
        <Route path="about" element={<Aboutus />} />
        <Route path="contact" element={<Contactus />} />
        <Route path="notifications" element={<Notifications />} />
          <Route
    path="scanQR"
    element={
        <OwnerRoute>
            <ScanQR/>
        </OwnerRoute>
    }
/>

      </Route> 
    </Routes>
  );
}