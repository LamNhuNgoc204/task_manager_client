import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdOutlineAddCircle } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import wink from "../../../public/gif/wink.gif";
import CreateTask from "../Input/CreateTask";
import { AuthContext } from "../../context/AuthProvider";
import { graphQLRequest } from "../../utils/request";
import {
  deleteTassk,
  importantQuery,
  updateTaskStatusQuery,
} from "../../pages/graphql/task";
import { notify } from "../../utils/notifycation";
import { ToastContainer } from "react-toastify";
import { BsBookmarkHeartFill } from "react-icons/bs";

const Cards = ({ home, tasks }) => {
  const { setIsShowDiv, selectedTask, setSelectedTask } =
    useContext(AuthContext);
  const [CARDS, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (tasks) {
      setCards(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (selectedTask) {
      setIsShowDiv("fixed");
    } else {
      setIsShowDiv("hidden");
    }
  }, [selectedTask]);

  const confirmDeleteTask = (id) => {
    setTaskToDelete(id);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) {
      notify("Lỗi: ID không hợp lệ!");
      return;
    }

    try {
      const variables = { deleteTaskId: taskToDelete };
      const payload = { query: deleteTassk, variables };
      const res = await graphQLRequest(payload);

      if (res?.data?.deleteTask) {
        notify("Task đã bay màu!🧹 Task đã biến mất như một cơn gió... 🍃");
        setCards((prev) => prev.filter((task) => task.id !== taskToDelete));
      }
    } catch (error) {
      console.error("Lỗi khi xóa Task:", error);
      notify("Lỗi: Xóa Task thất bại!");
    } finally {
      setIsModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const addImportantTask = async (id) => {
    try {
      const variables = { isImportantTaskId: id };
      const payload = { query: importantQuery, variables };
      const res = await graphQLRequest(payload);
      const data = res.data.isImportantTask;
      if (data) {
        setCards((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, important: !task.important } : task
          )
        );
        notify("🔥 Task này đã đã được cập nhật độ quan trọng! 🚀");
      }
    } catch (error) {
      console.log("error", error);
      notify("Ây da! Bị trục trặt xíu, thử lại nhaaaa :3");
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const payload = {
        query: updateTaskStatusQuery,
        variables: { updateStatusId: id, status: newStatus },
      };
      const res = await graphQLRequest(payload);

      console.log("res", res);

      if (res?.data?.updateStatus) {
        setCards((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
        notify(`🎉 Yay! Đã chuyển trạng thái thành công!`);
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      notify("❌ Ây da... Không thể cập nhật trạng thái!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-4 gap-4 p-4 cursor-pointer">
        {CARDS.length > 0 ? (
          CARDS.map((item, i) => (
            <div
              key={i}
              onClick={() => setSelectedTask(item)}
              className="bgc rounded-md p-4 flex flex-col justify-between relative"
            >
              <div>
                <h3 className="text-xl text-blue-950 font-semibold">
                  {item.title}
                </h3>
                <p className="break-words text-gray-500 my-2 flex-1">
                  {item.desc || item.desciption}
                </p>
              </div>
              <div className="mt-4 w-full flex justify-between items-center">
                {/* <button
                  className={` ${
                    item.status !== "Complete" ? "bg-red-400" : "bg-green-700"
                  } text-white py-1 px-2 rounded text-sm hover:opacity-80 hover:cursor-pointer`}
                >
                  {item.status}
                </button> */}
                <select
                  value={item.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(item.id, e.target.value);
                  }}
                  className={`${
                    item.status == "todo"
                      ? "bg-red-400"
                      : item.status == "in_progress"
                      ? "bg-blue-700"
                      : "bg-green-700"
                  } text-white py-1 px-2 rounded text-sm hover:opacity-80 cursor-pointer`}
                >
                  <option value="todo" className="text-black">
                    Cần làm
                  </option>
                  <option value="in_progress" className="text-black">
                    Đang làm
                  </option>
                  <option value="done" className="text-black">
                    Hoàn thành
                  </option>
                </select>
                <div className=" text-white text-lg font-semibold">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addImportantTask(item.id);
                    }}
                    className={`${
                      item.important ? "text-blue-950" : "text-white"
                    } hover:scale-105 hover:cursor-pointer transition-all duration-300 p-1`}
                  >
                    {item.important ? (
                      <BsBookmarkHeartFill />
                    ) : (
                      <BsBookmarkHeart />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteTask(item.id);
                    }}
                    className="hover:scale-105 hover:cursor-pointer transition-all duration-300 p-1"
                  >
                    <RiDeleteBinFill />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 flex flex-col items-center justify-center text-center p-10">
            <img src={wink} alt="No Tasks" />
            <h2 className="text-2xl font-semibold text-white mt-4">
              Bạn chưa có nhiệm vụ nào! ✨
            </h2>
            <p className="text-white mt-2">
              Hãy thêm nhiệm vụ mới để bắt đầu công việc nào! 🚀
            </p>
            {home === true && (
              <button
                onClick={() => setIsShowDiv("fixed")}
                className="mt-4 flex items-center bg-[#5b98ee] text-white px-4 py-2 rounded-md
                hover:scale-105 transition-all duration-300"
              >
                <MdOutlineAddCircle className="text-2xl mr-2" />
                Thêm nhiệm vụ mới
              </button>
            )}
          </div>
        )}

        {CARDS.length > 0 && home === true && (
          <button
            onClick={() => setIsShowDiv("fixed")}
            className="flex flex-col justify-center items-center bg-[#5b98ee] rounded-md p-4 
    hover:scale-105 hover:cursor-pointer transition-all duration-300"
          >
            <MdOutlineAddCircle className="font-semibold text-4xl text-white" />
            <h2 className="text-white text-xl font-semibold mt-2">Thêm mới</h2>
          </button>
        )}

        {/* Hiển thị modal khi có selectedTask */}
        {selectedTask && <CreateTask />}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-blue-300 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold">Xác nhận xóa</h2>
              <p>Bạn chắc chắn muốn tạm biệt nhiệm vụ này chứ? 🥺</p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Thôi, giữ lại đi! 😚
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  Xóa luôn 😢
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cards;
