import { useParams } from "react-router-dom";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import SubtaskForm from "../components/subtask/SubtaskForm";

export default function SubtaskAdd() {
  // Get and convert the string parameter to a number
  const { id } = useParams();
  const taskId = id ? parseInt(id, 10) : 0;

  // const menuItems = [
  //   { name: "back to project", url: `/projects/${task.project}`, icon: <Icon icon={"chevron-left"} /> },
  // ];

  return (
    <>
      <BreadcrumbMenu title="New Subtask" />
      <SubtaskForm taskId={taskId} />
    </>
  );
}
