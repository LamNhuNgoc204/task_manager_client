import { GiNotebook } from "react-icons/gi";
import { MdOutlineImportantDevices } from "react-icons/md";
import { TbNotebookOff } from "react-icons/tb";
import { BsUiChecks } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

export const SIDEBAR = [
  {
    title: "Tất cả tasks",
    icon: () => <GiNotebook size={24} />,
    link: "/",
  },
  {
    title: "Quan trọng",
    icon: () => <MdOutlineImportantDevices size={24} />,
    link: "/important-tasks",
  },
  {
    title: "Đã hoàn thành",
    icon: () => <BsUiChecks size={24} />,
    link: "/completed-tasks",
  },
  {
    title: "Chưa hoàn thành",
    icon: () => <TbNotebookOff size={24} />,
    link: "/incompleted-tasks",
  },
  {
    title: "Cài đặt",
    icon: () => <IoSettingsOutline size={24} />,
    link: "/setting",
  },
];
