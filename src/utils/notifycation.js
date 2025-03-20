import { toast } from "react-toastify";

export const notify = (message) =>
  toast(message, {
    position: "top-right",
    autoClose: 3000,
  });
