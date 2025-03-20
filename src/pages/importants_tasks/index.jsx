import React, { useEffect, useState } from "react";
import Cards from "../../components/Home/Cards";
import { graphQLRequest } from "../../utils/request";
import { importantTasks } from "../graphql/task";

const ImportantTasks = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || "";
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      if (!userId) {
        console.error("Lỗi: userId không tồn tại!");
        return [];
      }
      const variables = { userId: userId };
      const payload = { query: importantTasks, variables };

      const res = await graphQLRequest(payload);

      const data = res.data.importantTasks;
      if (data) {
        return data;
      }
    } catch (error) {
      console.log("error--->", error);
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

  console.log("tasks", tasks);

  return (
    <div>
      <h3>Task quan trọng!</h3>
      <Cards home={false} tasks={tasks} />
    </div>
  );
};

export default ImportantTasks;
