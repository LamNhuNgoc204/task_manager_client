import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isShowDiv, setIsShowDiv] = useState("hidden");
  const [selectedTask, setSelectedTask] = useState(null);
  const [information, setInformation] = useState({});

  const auth = getAuth();

  const checkUser = async () => {
    auth.onIdTokenChanged((user) => {
      console.log("user", user);

      if (user) {
        // Nếu user từ Firebase Auth (Google Login)
        if (user?.uid) {
          setUser(user);
          localStorage.setItem("accessToken", user.accessToken);
          return;
        }
      }

      // Nếu user login (Email/Password)
      const userInLocal = localStorage.getItem("user");
      if (userInLocal) {
        // console.log("userInLocal", JSON.parse(userInLocal));

        if (JSON.parse(userInLocal)?.name) {
          setUser(JSON.parse(userInLocal));
          return;
        }
      }

      setUser({});
      localStorage.clear();
      navigate("/auth/login");
    });
  };

  // Gọi checkUser khi khởi động
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isShowDiv,
        setIsShowDiv,
        selectedTask,
        setSelectedTask,
        information,
        setInformation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
