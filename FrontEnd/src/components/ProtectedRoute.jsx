import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Example: Replace this with your actual authentication logic
const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ redirectPath = "/login" }) => {
    if (!isAuthenticated()) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;