import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const PrivateRoute = ({ children }) => {
  const { session, loading } = userAuth();

  if (loading) {
    return (<div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>);
    
  }

  return session ? children : <Navigate to="/signup" />;
};

export default PrivateRoute;
