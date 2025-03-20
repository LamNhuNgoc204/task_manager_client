import React, { useContext, useEffect, useState } from "react";
import winkGif from "/gif/wink.gif";
import { IoClose } from "react-icons/io5";
import { notify } from "../../utils/notifycation";
import { ToastContainer } from "react-toastify";
import { graphQLRequest } from "../../utils/request";
import { taskPayload, updateTask } from "../../pages/graphql/task";
import { AuthContext } from "../../context/AuthProvider";

const CreateTask = ({ setTasks }) => {
  const { isShowDiv, setIsShowDiv, selectedTask, setSelectedTask } =
    useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const addSubtask = () => {
    setTask({
      ...task,
      subtasks: [...task.subtasks, { title: "", completed: false }],
    });
  };

  const addChecklistItem = () => {
    setTask({
      ...task,
      checklist: [...task.checklist, { item: "", checked: false }],
    });
  };

  const [task, setTask] = useState({
    id: "",
    title: "",
    description: "",
    icon: "",
    deadline: "",
    priority: "low",
    important: false,
    subtasks: [{ title: "", completed: false }],
    checklist: [{ item: "", checked: false }],
  });

  useEffect(() => {
    if (selectedTask && Object.keys(selectedTask).length > 0) {
      setTask({
        id: selectedTask.id || "",
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        icon: selectedTask.icon || "",
        deadline: selectedTask.deadline
          ? selectedTask.deadline.split("T")[0]
          : "",
        priority: selectedTask.priority || "low",
        important: selectedTask.important || false,
        subtasks: selectedTask.subtasks || [{ title: "", completed: false }],
        checklist: selectedTask.checklist || [{ item: "", checked: false }],
      });
    }
  }, [selectedTask]);

  function resetForm() {
    setTask({
      title: "",
      description: "",
      icon: "",
      deadline: "",
      priority: "low",
      important: false,
      subtasks: [{ title: "" }],
      checklist: [{ item: "" }],
    });
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubtaskChange = (index, field, value) => {
    setTask((prevTask) => {
      const newSubtasks = prevTask.subtasks.map((subtask, i) =>
        i === index
          ? {
              ...subtask,
              [field]: field === "completed" ? value === "true" : value,
            }
          : subtask
      );

      return { ...prevTask, subtasks: newSubtasks };
    });
  };

  const handleDeleteSubtask = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: prevTask.subtasks.filter((_, i) => i !== index),
    }));
  };

  const handleChecklistChange = (index, value, field = "item") => {
    setTask((prevTask) => {
      const newChecklist = prevTask.checklist.map((check, i) =>
        i === index
          ? { ...check, [field]: field === "checked" ? value : value }
          : check
      );

      return { ...prevTask, checklist: newChecklist };
    });
  };

  const handleDeleteChecklist = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const deadline = new Date(task.deadline);
    const errors = {};
    const regex = /^[\p{L}0-9\s,.\-]+$/u;

    if (
      !task.title.trim() ||
      task.title.length < 2 ||
      !regex.test(task.title)
    ) {
      errors.title =
        "Oops! 📢 Tiêu đề phải có ít nhất 2 ký tự và không chứa ký tự đặc biệt nha! 💕";
    }

    if (
      !task.description.trim() ||
      task.description.length < 2 ||
      !regex.test(task.description)
    ) {
      errors.description =
        "🌸 Mô tả cần ít nhất 2 ký tự và không được dùng ký tự đặc biệt đâu nha! 😘";
    }

    if (!task.deadline) {
      errors.deadline =
        "⏰ Deadline đâu rồi ta? Nhập vào để không bị trễ nhé! 😆";
    } else {
      const deadlineDate = new Date(task.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.deadline =
          "⏰ Bạn không thể quay ngược thời gian đâu! Hãy chọn một deadline từ hôm nay trở đi nha! 😆";
      }
    }

    if (
      Array.isArray(task.subtasks) &&
      task.subtasks.some((subtask) => subtask.title.trim() !== "") &&
      task.subtasks.some(
        (subtask) =>
          typeof subtask.title !== "string" ||
          subtask.title.trim().length < 2 ||
          !regex.test(subtask.title)
      )
    ) {
      errors.subtasks =
        "🐾 Tiêu đề subtask phải có ít nhất 2 ký tự nha! Đừng làm biếng quá chứ! 😆";
    }

    if (
      Array.isArray(task.checklist) &&
      task.checklist.some((checklist) => checklist.item.trim() !== "") &&
      task.checklist.some(
        (checklist) =>
          typeof checklist.item !== "string" ||
          checklist.item.trim().length < 2 ||
          !regex.test(checklist.item)
      )
    ) {
      errors.checklist =
        "🐾 Tiêu đề checklist ít quá nè! Viết thêm cho chắc ăn nha! 😆";
    }

    const emojiPattern = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

    const icon = task.icon;
    if (!emojiPattern.test(icon.trim())) {
      errors.icon =
        "🚫 Biểu tượng này bị lỗi rồi! Đừng để nó dỗi, chọn cái khác đi nào! 😆";
    }

    if (Object.keys(errors).length > 0) {
      notify(
        `🚨 Oops! Có lỗi rồi nè:\n ${
          errors.title ||
          errors.deadline ||
          errors.description ||
          errors.subtasks ||
          errors.checklist ||
          errors.icon
        }`
      );
      console.log("Lỗi nhập liệu:", errors);
      return;
    }

    console.log("Dữ liệu form:", task);

    try {
      if (selectedTask) {
        //updatee
        const variables = {
          updateTaskId: selectedTask.id,
          title: task.title,
          description: task.description,
          icon: task.icon,
          important: task.important,
          priority: task.priority,
          deadline: deadline,
          userId: user?.id,
          subtasks: task.subtasks,
          checklist: task.checklist,
        };
        const payload = { query: updateTask, variables };
        const res = await graphQLRequest(payload);

        const data = res.data.updateTask;
        console.log("res update", data);
        console.log("Payload gửi lên:", payload);

        if (data) {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === data.id ? { ...task, ...data } : task
            )
          );
          notify("Yay! Task đã được cập nhật thành công! 🎉✨");
        } else {
          notify("Ôi không! Hệ thống hơi bị lú 😵, thử lại lần nữa nha! 🥺");
        }
      } else {
        // create
        const variables = {
          title: task.title,
          description: task.description,
          icon: task.icon,
          important: task.important,
          priority: task.priority,
          deadline: deadline,
          userId: user?.id,
          subtasks: task.subtasks,
          checklist: task.checklist,
        };
        const payload = { query: taskPayload, variables };
        const res = await graphQLRequest(payload);

        const data = res.data.createTask;
        if (data) {
          setTasks((prev) => [...prev, data]);
          notify("Yay! Task mới đã được thêm thành công! 🎉✨");
        } else {
          notify("Ôi không! Hệ thống hơi bị lú 😵, thử lại lần nữa nha! 🥺");
        }
      }
    } catch (error) {
      notify("Hic, có lỗi mất rồi... Nhưng đừng lo! Thử lại nào! ✨😊");
    } finally {
      resetForm();
      setIsShowDiv("hidden");
    }
  };

  function handleClose() {
    if (selectedTask) {
      setSelectedTask(null);
      resetForm();
    } else {
      resetForm();
    }
    setIsShowDiv("hidden");
  }

  return (
    <div>
      <ToastContainer />
      <div
        className={`${isShowDiv} top-0 left-0 bg-gray-600 opacity-80 h-screen w-full`}
      ></div>
      <div
        className={`${isShowDiv} top-0 left-0 flex items-center justify-center h-screen w-full`}
      >
        <div className="w-3/6 bg-[#73b7e5] px-4 py-2 rounded-md max-h-[90vh] overflow-y-auto">
          <div className="w-full flex justify-end text-3xl">
            <button onClick={() => handleClose()}>
              <IoClose />
            </button>
          </div>
          <div className="flex flex-col pb-4 items-center justify-center">
            <img className="w-1/4 h-1/4" src={winkGif} alt="Wink" />
            <h2>
              {selectedTask
                ? "🔍 Xem và chỉnh sửa task! ✨"
                : "✨ Thêm một task, gần hơn một bước! ✨"}
            </h2>
          </div>
          <div className="pb-2">
            <div className="my-1">
              <h3>Tiêu đề: </h3>
              <input
                type="text"
                placeholder="Tiêu đề"
                name="title"
                required
                value={task.title}
                onChange={handleChange}
                className="outline-none text-[#2770a9] px-3 py-1 w-full rounded bg-white/70"
              />
            </div>
            <div className="my-3">
              <h3>Mô tả: </h3>
              <textarea
                cols={30}
                rows={4}
                placeholder="Mô tả..."
                name="description"
                required
                value={task.description}
                onChange={handleChange}
                className="outline-none text-[#2770a9] px-3 py-1 w-full rounded bg-white/70"
              />
            </div>
            <div className="flex justify-between align-middle my-3">
              <div className="w-1/4">
                <h3>Biểu tượng: </h3>
                <input
                  value={task.icon}
                  type="text"
                  placeholder="Icon"
                  name="icon"
                  required
                  onChange={handleChange}
                  className="outline-none text-[#2770a9] px-3 py-1 w-full rounded bg-white/70"
                />
              </div>
              <div className="w-1/4">
                <h3>Độ ưu tiên: </h3>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="outline-none w-full text-[#2770a9] p-1 rounded bg-white/70"
                >
                  <option className="text-[#2770a9]" value="low">
                    Thấp
                  </option>
                  <option className="text-[#2770a9]" value="medium">
                    Trung bình
                  </option>
                  <option className="text-[#2770a9]" value="high">
                    Cao
                  </option>
                </select>
              </div>
              <div className="w-1/2.5">
                <h3>Dealine: </h3>
                <input
                  type="date"
                  name="deadline"
                  value={task.deadline}
                  onChange={handleChange}
                  required
                  className="outline-none text-[#2770a9] px-3 py-1 w-full rounded bg-white/70"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="important"
                checked={task.important}
                onChange={handleChange}
              />{" "}
              Quan trọng
            </div>

            <div className="my-3">
              <h3>Subtasks</h3>
              {task.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Subtask"
                    value={subtask.title}
                    onChange={(e) =>
                      handleSubtaskChange(index, "title", e.target.value)
                    }
                    className="outline-none text-[#2770a9] px-3 py-1 w-full rounded bg-white/70 my-1"
                  />
                  {selectedTask && (
                    <select
                      value={subtask.completed ? "true" : "false"}
                      onChange={(e) =>
                        handleSubtaskChange(index, "completed", e.target.value)
                      }
                      className="px-2 py-1 border outline-none text-[#2770a9] p-1 rounded bg-white/70"
                    >
                      <option value="false">Chưa hoàn thành</option>
                      <option value="true">Hoàn thành</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleDeleteSubtask(index)}
                    className="text-red-500 text-sm hover:text-red-700 hover:transition-all duration-300 hover:scale-105"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={addSubtask}
                className="px-3 py-1 hover:opacity-80 bg-[#2770a9] text-white rounded mt-2"
              >
                + Thêm subtask
              </button>
            </div>

            <div className="my-3">
              <h3>Checklist</h3>
              {task.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2 my-1">
                  {selectedTask && (
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) =>
                        handleChecklistChange(
                          index,
                          e.target.checked,
                          "checked"
                        )
                      }
                    />
                  )}
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) =>
                      handleChecklistChange(index, e.target.value)
                    }
                    placeholder="Checklist item"
                    className="outline-none text-[#2770a9] px-3 py-1 w-full rounded bg-white/70"
                  />
                  <button
                    onClick={() => handleDeleteChecklist(index)}
                    className="text-red-500 text-sm hover:text-red-300 hover:transition-all duration-300 hover:scale-105"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                onClick={addChecklistItem}
                className="px-3 py-1 hover:opacity-80 bg-[#2770a9] text-white rounded mt-2"
              >
                + Thêm mục kiểm tra
              </button>
            </div>
            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="p-1 mr-3 w-1/6 bg-[#2770a9] rounded text-lg text-white hover:opacity-80"
              >
                Lưu
              </button>
              <button
                onClick={() => handleClose()}
                className="p-1 w-1/6 bg-red-500 rounded text-lg text-white hover:opacity-80"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
