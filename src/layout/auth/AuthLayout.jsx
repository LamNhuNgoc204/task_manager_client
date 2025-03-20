import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../../pages/login";
import Register from "../../pages/register";
import { useParams } from "react-router";

const AuthLayout = () => {
  const { type } = useParams(); // Lấy login hoặc register từ URL
  const isLogin = type === "login";

  return (
    <div className="flex justify-center items-center h-screen">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <Login isLogin={isLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Register isLogin={isLogin} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
