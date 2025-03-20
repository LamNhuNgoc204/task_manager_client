import React, { useEffect, useState } from "react";
import Cards from "../../components/Home/Cards";
import { graphQLRequest } from "../../utils/request";
import { TasksOfStatus } from "../graphql/task";

const IncompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || "";

  const getData = async () => {
    if (!userId) {
      console.error("Lỗi: userId không tồn tại!");
      return [];
    }
    const variables = { userId: userId };
    const payload = { query: TasksOfStatus, variables };

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

  console.log("IncompletedTasks", tasks);

  return (
    <div>
      <h3>Task chưa hoàn thành!</h3>
      <Cards home={false} tasks={tasks} />
    </div>
  );
};

export default IncompletedTasks;
