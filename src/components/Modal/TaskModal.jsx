import React from "react";

const TaskModal = ({ task, onClose }) => {
  console.log(task);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-black"
        >
          ✖
        </button>
        <h1 className="text-center text-black">Chi tiết task</h1>
        <h2 className="text-xl font-semibold mb-2 text-black">
          Tiêu đề: {task.title}
        </h2>
        <p className="text-gray-600"> Mô tả: {task.description}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-right "
          >
            Đóng
          </button>
          <button
            onClick={onClose}
            className=" bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600 text-right "
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
