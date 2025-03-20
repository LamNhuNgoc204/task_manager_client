import React, { useContext, useEffect, useState } from "react";
import "boxicons/css/boxicons.min.css";
import "./styles.css";
import FlowerGif from "/gif/tang-hoa.gif";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { graphQLRequest } from "../../utils/request";
import { queryLogin, queryLoginGG, resetPass } from "../graphql/user";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const notify = (message) => toast(message);

  const validateForm = () => {
    let errors = {};

    if (!email.trim()) {
      errors.email = "Email không được để trống!";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  const variables = { email, password };
  const payload = { query: queryLogin, variables };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await graphQLRequest(payload);
      if (res.errors) {
        if (res.errors[0]?.message == "Email is not found.") {
          notify(
            "Oop! Hình như mình chưa là gì của nhau nè! Đăng ký ngay để mình có nhau nhé 😘💕"
          );
        } else if (res.errors[0]?.message == "Password is wrong.") {
          notify("Oops! Mật khẩu không đúng rồi nè 😢. Thử lại nhé! 🔒");
        }
      }

      if (res.data && res.data.loginWithEmail) {
        const data = res.data.loginWithEmail;

        notify("Yay! Bae đã đăng nhập thành công! Chúc mừng người đẹp💕");
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        authContext.setInformation(data.user);

        setTimeout(() => {
          authContext.setUser(data);
        }, 2000);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      notify("Ôi không! Có chút trục trặc rồi, bạn thử lại sau nhé! 😥");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGG = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, provider);
      console.log("res====>", res);
      const variables = {
        googleId: res.user.uid,
        name: res.user.displayName,
        email: res.user.email,
        avatar: res.user.photoURL,
      };
      const payload = { query: queryLoginGG, variables };

      const data = await graphQLRequest(payload);
      authContext.setUser(res.user);
      const user = data.data.loginWithGoogle;
      console.log("user login gg ==============>", user);
      localStorage.setItem("user", JSON.stringify(user));
      authContext.setInformation(user);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      notify("Xảy ra lỗi. Vui lòng thử lại sau ít phút!");
    }
  };

  useEffect(() => {
    if (authContext?.user && Object.keys(authContext.user).length > 0) {
      navigate("/");
    }
  }, [authContext?.user]);

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResetEmail("");
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      notify(
        "Bạn ơi, nhập email vào để tụi mình giúp bạn lấy lại mật khẩu nhé! 💌"
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      notify(
        "Oops! Email không hợp lệ rồi nè, bạn kiểm tra lại giúp mình nhé! 😢"
      );
      return;
    }
    console.log("resetEmail", resetEmail);

    try {
      const variables = { email: resetEmail };
      const payload = { query: resetPass, variables };
      const res = await graphQLRequest(payload);
      const data = res.data.resetPassword;
      if (data) {
        notify("Yay! Mật khẩu mới đã được gửi đến email của bạn rồi nè! 📩");
      }
    } catch (error) {
      console.log("error resetpass==>", error);

      notify("Ôi không! Có chút trục trặc rồi, bạn thử lại sau nhé! 😥");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="container relative w-[850px] min-h-[600px] bg-white rounded-[30px]">
      <ToastContainer />
      <div className="absolute left-0 w-1/2 h-full flex flex-col justify-between text-center items-center  p-[40px] form-box login">
        <div>
          <p className="text-center text-2xl font-semibold p--0">
            Chào mừng trở lại!
          </p>
          <p className="text-sm">
            Ghé một tý, sắp xếp một tẹo, rồi chill thôi!
          </p>
        </div>
        <div className="flex justify-center item-center w-full">
          <img className="w-60 h-30" src={FlowerGif} alt="FlowerGif" />
        </div>
        <div>
          <p className="text-sm">
            Ủa, chưa có tài khoản hả? Không sao,{" "}
            <button
              onClick={() => navigate("/auth/register")}
              className="underline outline-none text-sm text-[#106299]"
            >
              đăng ký
            </button>{" "}
            lẹ nào ~~~
          </p>
        </div>
      </div>

      <div className="absolute right-0 w-1/2 h-full flex text-center items-center bg-[#106299] p-[40px] form-box login">
        <form className="w-full" action="">
          <h1 className="text-[36px] mx-0 my-[10px] font-semibold text-white">
            Đăng nhập
          </h1>
          <div className="my-[30px]">
            <div className="input-box relative mx-0 ">
              <input
                className="w-full pr-[50px] pl-[20px] py-[13px] bg-[#eee] rounded-[8px] border-none outline-none text-[16px] text-[#333] font-medium "
                type="text"
                placeholder="Nhập email..."
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            {errors.email && (
              <p className="text-red-600 text-[15px] mt-1 p-0 text-start">
                {errors.email}
              </p>
            )}
          </div>
          <div className="my-[20px]">
            <div className="input-box relative mx-0">
              <input
                type="password"
                className="w-full pr-[50px] pl-[20px] py-[13px] bg-[#eee] rounded-[8px] border-none outline-none text-[16px] text-[#333] font-medium"
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

          <div className="-mt-[15px] mb-[15px]">
            <button
              onClick={handleForgotPassword}
              type="button"
              className="text-[14.5px] text-white"
              href="#"
            >
              Quên mật khẩu?
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleLogin()}
            className="btn border-none cursor-pointer font-semibold text-white text-[16px] w-full h-[48px] bg-[#7494ec] rounded-[8px]  "
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <p className="mt-2 text-white">hoặc</p>
          <p className="text-[14.5px] mx-[15px] mb-2 text-white">
            Đăng nhập với các nền tảng xã hội
          </p>
          <div className="social-icons">
            <button
              type="button"
              className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#ccc] my-0 mx-[8px]"
              onClick={() => handleLoginGG()}
            >
              <i className="bx bxl-google-plus"></i>
            </button>
            <a
              className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#ccc] my-0 mx-[8px]"
              href="#"
            >
              <i className="bx bxl-facebook-circle"></i>
            </a>
            <a
              className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#ccc] my-0 mx-[8px]"
              href="#"
            >
              <i className="bx bxl-github"></i>
            </a>
            <a
              className="inline-flex p-[10px] border-[1px] border-solid border-[#fff] rounded-[8px] text-[24px] text-[#ccc] my-0 mx-[8px]"
              href="#"
            >
              <i className="bx bxl-linkedin-square"></i>
            </a>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-[#588ccc] p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Bạn quên mật khẩu à?
            </h2>
            <h4 className="mb-4">
              Hãy nhập email của bạn vào đây, tụi mình sẽ gửi ngay mật khẩu mới
              cho bạn nè! 💌
            </h4>
            <input
              type="email"
              className="w-full text-[#333] p-2 border rounded mb-4"
              placeholder="Nhập email của bạn"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-1 bg-red-400 text-white rounded"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-1 bg-blue-400 text-white rounded"
                onClick={handleResetPassword}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
