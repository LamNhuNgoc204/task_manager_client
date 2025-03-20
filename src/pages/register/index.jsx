import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import "./styles.css";
import ComeOnGif from "/gif/co_vu.gif";
import { useNavigate } from "react-router-dom";
import { graphQLRequest } from "../../utils/request";
import { ToastContainer, toast } from "react-toastify";
import { mutation } from "../graphql/user";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const notify = (message) => toast(message);

  const validateForm = () => {
    let errors = {};

    if (!name.trim()) {
      errors.name = "Tên không được để trống!";
    } else if (!/^[\p{L}\s]+$/u.test(name)) {
      errors.name = "Tên chỉ được chứa chữ cái và khoảng trắng!";
    }

    if (!email.trim()) {
      errors.email = "Email không được để trống!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email không hợp lệ!";
    }

    if (!password.trim()) {
      errors.password = "Mật khẩu không được để trống!";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const variables = { name, email, password };
  const payload = { query: mutation, variables };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const data = await graphQLRequest(payload);
      console.log("data: ", data.register);

      if (data.errors) {
        console.error("Lỗi API:", data.errors);

        // Lấy thông báo lỗi từ API
        const errorMessage = data.errors[0]?.message || "Đăng ký thất bại!";

        // Hiển thị thông báo lỗi
        toast.error(errorMessage);

        setLoading(false);
        return;
      }

      if (data.errors) {
        console.error("Lỗi API:", data.errors);
        return;
      }

      if (data.data && data.data.register) {
        console.log("Đăng ký thành công:", data.data.register);
        setLoading(false);
        notify("Đăng ký thành công!");

        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        notify("Đăng ký thất bại!");
        console.error("Đăng ký thất bại!", data.error);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
      if (error[0].message === "Email already exists.") {
        notify("Email đã tồn tại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container relative w-[850px] min-h-[600px] bg-white rounded-[30px]">
      <ToastContainer />
      <div>
        <div className="absolute right-0 w-1/2 h-full flex flex-col text-center items-center justify-between p-[40px] form-box login">
          <div>
            <p className="text-center text-2xl font-semibold p--0">
              Sẵn sàng chưa? Đăng ký ngay!
            </p>
            <p className="text-sm">
              Thêm một bước nhỏ, bớt một việc lo! Bắt đầu nhẹ nhàng, hoàn thành
              dễ dàng!
            </p>
          </div>
          <div className="flex justify-center item-center w-full">
            <img className="w-60 h-30" src={ComeOnGif} alt="ComeOnGif" />
          </div>
          <div>
            <p className="text-sm">
              Có tài khoản rồi thì mình{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="underline outline-none text-sm text-[#106299]"
              >
                đăng nhập
              </button>{" "}
              thôi nè!😊💖
            </p>
          </div>
        </div>
        <div className="absolute left-0 w-1/2 h-full flex text-center items-center bg-[#9fb6fe] p-[40px] form-box login">
          <form className="w-full" action="">
            <h1 className="text-[36px] mx-0 my-[10px] font-semibold">
              Đăng ký
            </h1>
            <div>
              <div className="input-box relative mx-0 mt-[30px]">
                <input
                  required
                  name="name"
                  className="w-full pr-[50px] pl-[20px] py-[13px] bg-[#eee] rounded-[8px] border-none outline-none text-[16px] text-[#333] font-medium "
                  type="text"
                  placeholder="Nhập tên..."
                  onChange={(e) => setName(e.target.value)}
                />
                <i className="bx bxs-user"></i>
              </div>
              {errors.name && (
                <p className="text-red-600 text-[15px] mt-1 p-0 text-start">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="my-[15px]">
              <div className="input-box relative mx-0 ">
                <input
                  required
                  name="email"
                  className="w-full pr-[50px] pl-[20px] py-[13px] bg-[#eee] rounded-[8px] border-none outline-none text-[16px] text-[#333] font-medium "
                  type="email"
                  placeholder="Nhập email..."
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i className="bx bxs-envelope"></i>
              </div>
              {errors.email && (
                <p className="text-red-600 text-[15px] mt-1 p-0 text-start">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="my-[20px]">
              <div className="input-box relative mx-0 ">
                <input
                  required
                  name="password"
                  className="w-full pr-[50px] pl-[20px] py-[13px] bg-[#eee] rounded-[8px] border-none outline-none text-[16px] text-[#333] font-medium"
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              {errors.password && (
                <p className="text-red-600 text-[15px] mt-1 p-0 text-start">
                  {errors.password}
                </p>
              )}
            </div>
            <button
              onClick={() => handleRegister()}
              type="button"
              className="btn border-none cursor-pointer font-semibold text-white text-[16px] w-full h-[48px] bg-[#7494ec] rounded-[8px]  "
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
            <p className="mt-2">hoặc</p>
            <p className="text-[14.5px] mx-[15px] mb-2">
              Đăng ký với các nền tảng xã hội
            </p>
            <div className="social-icons">
              <a
                className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#fff] my-0 mx-[8px]"
                href="#"
              >
                <i className="bx bxl-google-plus"></i>
              </a>
              <a
                className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#fff] my-0 mx-[8px]"
                href="#"
              >
                <i className="bx bxl-facebook-circle"></i>
              </a>
              <a
                className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#fff] my-0 mx-[8px]"
                href="#"
              >
                <i className="bx bxl-github"></i>
              </a>
              <a
                className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#fff] my-0 mx-[8px]"
                href="#"
              >
                <i className="bx bxl-linkedin-square"></i>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
