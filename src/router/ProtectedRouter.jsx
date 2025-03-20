import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const ProtectedRouter = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  return user ? children : <Navigate to="/auth/login" replace />;
};

export default ProtectedRouter;
