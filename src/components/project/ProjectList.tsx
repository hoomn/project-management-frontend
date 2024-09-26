import Table from "react-bootstrap/Table";

import Project from "./Project";
import ProjectHeader from "./ProjectHeader";

export default function ProjectList({ projects }: { projects: ProjectProps[] }) {
  return (
    <>
      {projects.length === 0 ? (
        <div className="text-center border-top border-bottom py-2">
          <small className="text-muted fst-italic">no projects</small>
        </div>
      ) : (
        <Table responsive="md">
          <ProjectHeader />
          <tbody>{projects?.map((project: ProjectProps) => <Project key={project.id} project={project} />)}</tbody>
        </Table>
      )}
    </>
  );
}
