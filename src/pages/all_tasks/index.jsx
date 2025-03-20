import React, { useContext, useEffect, useState } from "react";
import Cards from "../../components/Home/Cards";
import { MdOutlineAddCircle } from "react-icons/md";
import CreateTask from "../../components/Input/CreateTask";
import { graphQLRequest } from "../../utils/request";
import { queryTasks } from "../graphql/task";
import { AuthContext } from "../../context/AuthProvider";

const AllTasks = () => {
  const { setIsShowDiv, setSelectedTask } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || "";
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    if (!userId) {
      console.error("Lỗi: userId không tồn tại!");
      return [];
    }
    const variables = { userId: userId };
    const payload = { query: queryTasks, variables };

    const res = await graphQLRequest(payload);

    const data = res.data.tasks;
    if (data) {
      return data;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      if (data) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <div className="w-full flex items-end justify-end px-4 py-2 ">
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsShowDiv("fixed");
            }}
          >
            <MdOutlineAddCircle
              className="text-4xl text-white
           hover:text-gray-100 transition-all duration-300"
            />
          </button>
        </div>
        <Cards home={true} tasks={tasks ?? []} />
      </div>
      <CreateTask setTasks={setTasks} />
    </>
  );
};

export default AllTasks;
