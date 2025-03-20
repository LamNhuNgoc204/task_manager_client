import { GRAPHQL_URI } from "./contants";

export const graphQLRequest = async (payload, option = {}) => {
  const response = await fetch(GRAPHQL_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      ...option,
    },
    body: JSON.stringify(payload),
  });

  const  data  = await response.json();
  return data;
};
