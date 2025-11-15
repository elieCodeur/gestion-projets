import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: "student" | "teacher" }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
  return <>{children}</>;
}
