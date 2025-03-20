import React, { useEffect, useState } from "react";
import Cards from "../../components/Home/Cards";
import { completedTask } from "../graphql/task";
import { graphQLRequest } from "../../utils/request";

const Completed_tasks = () => {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || "";

  const getData = async () => {
    if (!userId) {
      console.error("Lỗi: userId không tồn tại!");
      return [];
    }
    const variables = { userId: userId, status: "done" };
    const payload = { query: completedTask, variables };

    const res = await graphQLRequest(payload);

    console.log("ress----------------", res);

    const data = res.data.TasksOfStatus;
    if (data) {
      return data;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      if (data) {
        setTasks(data);
      }
    };
    fetchData();
  }, []);

  console.log("CompletedTasks", tasks);

  return (
    <div>
      <h3>Task đã hoàn thành!</h3>
      <Cards home={false} tasks={tasks} />
    </div>
  );
};

export default Completed_tasks;
