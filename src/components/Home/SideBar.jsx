import React, { useContext, useEffect, useRef, useState } from "react";
import { SIDEBAR } from "../../constants/data";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { notify } from "../../utils/notifycation";
import { getAuth } from "firebase/auth";
import { FaBell } from "react-icons/fa";
import { createClient } from "graphql-ws";
import {
  DEADLINE_REMINDER_SUBSCRIPTION,
  queryLstNoti,
} from "../../pages/graphql/task";
import { graphQLRequest } from "../../utils/request";
import { ToastContainer } from "react-toastify";

const client = createClient({
  url: "ws://localhost:5000/graphql",
});

const SideBar = () => {
  const {
    user: { displayName, email },
  } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const infor = authContext.information;
  const auth = getAuth();
  const navigate = useNavigate();
  const userInLocal = localStorage.getItem("user");
  const userInfo = JSON.parse(userInLocal);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isvisible, setIsvisible] = useState(false);
  const [newNoti, setNewNoti] = useState(null);
  const [lstNoti, setLstNoti] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || "";

  const notiBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiBoxRef.current && !notiBoxRef.current.contains(event.target)) {
        setIsOpenNoti(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenNotiBox = async () => {
    setIsOpenNoti(!isOpenNoti);
  };

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        await auth.signOut();
      }

      localStorage.clear();
      authContext.setUser({});

      notify("Đăng xuất thành công! Hẹn gặp lại nhé! 💖");
      navigate("/auth/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      notify("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const fetchNoti = async () => {
      try {
        const variables = { userId: userId };
        const payload = { query: queryLstNoti, variables };
        const res = await graphQLRequest(payload);
        const data = res.data.notifications;
        if (data) {
          setLstNoti(data);
        }
      } catch (error) {
        console.log("Xay ra loi khi get list notifications");
      }
    };

    fetchNoti();
  }, []);

  useEffect(() => {
    if (newNoti) {
      setLstNoti((prevNotis) => [newNoti, ...prevNotis]);
    }
  }, [newNoti]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      { query: DEADLINE_REMINDER_SUBSCRIPTION, variables: { userId: userId } },
      {
        next: (data) => {
          setIsvisible(true);
          console.log("🔔data:", data);
          if (data) {
            setNewNoti(data.data.deadlineReminder.message);
          }
        },
        error: (error) => {
          console.error("⚠️ Lỗi khi nhận subscription:", error);
        },
        complete: () => {
          console.log("✅ Subscription hoàn thành.");
        },
      }
    );

    return () => {
      console.log("🛑 Unsubscribing...");
      unsubscribe();
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-full justify-between">
        <div className=" justify-between align-middle">
          <div>
            <h2 className="break-words">
              Há lô{" "}
              {userInfo ? userInfo.name : infor ? infor.name : displayName}
            </h2>
            <h4 className="my-1 text-sm break-words">
              {userInfo ? userInfo.email : infor ? infor.email : email}
            </h4>
            <hr className="bg-blue-900 text-[red]" />
          </div>
          <div className="relative">
            <div className="text-center mt-2">
              <button className="relative" onClick={(e) => handleOpenNotiBox()}>
                <FaBell className="text-white text-2xl" />
                {isvisible && (
                  <div className="p-1 bg-red-700 absolute top-0 left-3.5 rounded-full"></div>
                )}
              </button>
            </div>

            <div
              ref={notiBoxRef}
              className={`${
                isOpenNoti ? "block" : "hidden"
              } absolute left-2/3 top-0 bg-gray-100 z-50 rounded-lg p-4 w-64`}
            >
              <h1 className="text-sm font-semibold mb-2 text-black">
                📢 Thông báo mới
              </h1>
              <ul
                className="space-y-2 text-sm text-pink-500 max-h-[50vh] w-full
             overflow-y-auto no-scrollbar"
              >
                {lstNoti.length > 0 ? (
                  [...lstNoti].reverse().map((noti, index) => (
                    <li
                      key={index}
                      className="p-2 bg-blue-100 rounded-md hover:bg-gray-200 transition"
                    >
                      {noti.content}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">Không có thông báo nào</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div>
          {SIDEBAR.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="my-2 text-sm flex items-center hover:bg-[#2770a9] rounded-md p-1 transition-all duration-300"
            >
              <span className="mr-1">{item.icon && <item.icon />}</span>
              {item.title}
            </Link>
          ))}
        </div>

        <div>
          <button
            onClick={() => handleLogout()}
            className="bg-[#2770a9] w-full rounded text-white outline-none py-1"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
