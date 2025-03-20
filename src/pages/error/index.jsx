import React from "react";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation(); // Lấy thông tin URL không hợp lệ

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
      <h2 className="text-2xl mt-4">Trang không tồn tại.</h2>
      <p className="mt-2 text-gray-500">
        Đường dẫn không hợp lệ: <code>{location.pathname}</code>
      </p>
    </div>
  );
};

export default ErrorPage;
