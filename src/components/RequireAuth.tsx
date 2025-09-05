import { useLocation } from "react-router-dom";
import { getAccess } from "../utils/api";

import React from "react";
import type { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

import { Link } from "react-router-dom";

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const token = getAccess();
  const loc = useLocation();

  // Always allow access to home page
  if (loc.pathname === "/") {
    return <>{children}</>;
  }

  if (token) {
    return <>{children}</>;
  }

  // Fallback for unauthenticated users on protected routes
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>You must be logged in to view this page.</h2>
      <Link to="/login" style={{ marginRight: 16 }}>Log In</Link>
      <Link to="/signup">Sign Up</Link>
    </div>
  );
};

export default RequireAuth;
