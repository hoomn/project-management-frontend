import { useParams } from "react-router-dom";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import TaskForm from "../components/task/TaskForm";

export default function TaskAdd() {
  // Get and convert the string parameter to a number
  const { id } = useParams();
  const projectId = id ? parseInt(id, 10) : 0;

  // const menuItems = [
  //   { name: "back to project", url: `/projects/${task.project}`, icon: <Icon icon={"chevron-left"} /> },
  // ];

  return (
    <>
      <BreadcrumbMenu
        title="New Task"
        //projectId={projectId}
      />
      <TaskForm projectId={projectId} />
    </>
  );
}
