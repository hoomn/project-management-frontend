import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import ProjectForm from "../components/project/ProjectForm";

export default function ProjectAdd() {
  const menuItems = [
    {
      icon: <Icon icon={"chevron-left"} />,
      name: "all projects",
      url: "/projects",
    },
  ];

  return (
    <>
      <BreadcrumbMenu title="New Project" items={menuItems} />
      <ProjectForm />
    </>
  );
}
