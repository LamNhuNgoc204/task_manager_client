import React from "react";
import SideBar from "../../components/Home/SideBar";
import { Outlet } from "react-router";
import ProtectedRouter from "../../router/ProtectedRouter";

const Home = () => {
  return (
    <ProtectedRouter>
      <div className="flex items-center w-full justify-center h-screen">
        <div className="relative w-full flex h-[98vh] gap-4 items-center">
          <div className="w-1/6 rounded-xl h-[98vh] border-yellow-100 border-2 p-4 flex justify-between flex-col bg-blue-200/50 text-white">
            <SideBar />
          </div>
          <div className="rounded-xl h-[98vh] border-yellow-100 border-2 p-4 w-5/6 overflow-y-auto scrollbar-hide">
            <Outlet />
          </div>
        </div>
      </div>
    </ProtectedRouter>
  );
};

export default Home;
