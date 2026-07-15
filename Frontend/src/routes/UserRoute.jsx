import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  if (user.role !== "user") {
    if (user.role === "owner") {
      return <Navigate to="/ownerDashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // Correct role
  return children;
}