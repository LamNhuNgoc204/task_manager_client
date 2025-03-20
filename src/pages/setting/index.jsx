import React, { useContext, useState } from "react";
import { graphQLRequest } from "../../utils/request";
import { updateUser } from "../graphql/user";
import { notify } from "../../utils/notifycation";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../../context/AuthProvider";

const Settings = () => {
  const User = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = User?.id || "";
  const { information, setInformation, user } = useContext(AuthContext);
  const userInLocal = localStorage.getItem("user");
  const userInfo = JSON.parse(userInLocal);

  const [formData, setFormData] = useState({
    name: userInfo.name || information.name || "",
    email: userInfo.email || information.email || "",
    password: "",
  });

  console.log("information", information);
  console.log("user", user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const variables = {
        updateInfoId: userId,
        password: formData.password,
        email: formData.email,
        name: formData.name,
      };
      const payload = { query: updateUser, variables };
      const res = await graphQLRequest(payload);
      const data = res.data.updateInfo;
      if (data) {
        setInformation(data);
        notify("Xong rồi đóa! Thông tin của bạn đã được cập nhật rồi nè! 🎉");
      }
    } catch (error) {
      console.error("Xảy ra lỗi: ", error);
    }
    console.log("Updated Profile Data:", formData);
  };

  return (
    <div>
      <ToastContainer />
      <div className="max-w-lg mx-auto align-middle justify-center">
        <div className="flex align-middle justify-center m-0">
          <img
            className="h-[270px] w-[350px]"
            src="https://i.pinimg.com/originals/1e/d7/ef/1ed7efe4afd6dcc9e00bc9d57edb7c52.gif"
            alt=""
          />
        </div>

        <h2 className="text-xl font-bold mb-3 text-center">
          Chỉnh sửa thông tin cá nhân
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Họ và Tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full text-[#333] border rounded-lg p-2"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block text-[#333] w-full border rounded-lg p-2"
              placeholder="Nhập email"
            />
          </div>

          {!user.uid && (
            <div>
              <label className="block text-sm font-medium">Mật khẩu mới</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border text-[#333] rounded-lg p-2"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-[#2770a9] text-white px-4 py-2 rounded-lg w-full mt-5 hover:opacity-80"
          >
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
