import { useState } from "react";

import { ProjectProps, SortableColumn } from "@/types";

import NoData from "@/components/ui/no-data";
import SortableHeader from "@/components/ui/sortable-header";

import { Table } from "react-bootstrap";

import ProjectRow from "./project-row";

interface ProjectGridProps {
  projects: ProjectProps[];
  sortField: string;
  sortOrder: string;
  onSort: (field: string) => void;
}

export default function ProjectGrid({ projects, sortField, sortOrder, onSort }: ProjectGridProps) {
  const [showDoneProjects, setShowDoneProjects] = useState(false);

  if (projects.length === 0) return <NoData type="projects" />;

  const columns: SortableColumn[] = [
    { key: "owner", label: "Owner" },
    { key: "title", label: "Title", sortable: true },
    { key: "icon", label: "" },
    { key: "assigned_to", label: "Assigned to" },
    { key: "start_date", label: "Start Date", sortable: true },
    { key: "end_date", label: "End Date", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "priority", label: "Priority", sortable: true },
    { key: "action", label: "" },
  ];

  const activeProjects = projects.filter((project) => project.status !== 1);
  const doneProjects = projects.filter((project) => project.status === 1);
  const hasDoneProjects = doneProjects.length > 0;

  return (
    <>
      <Table responsive="md">
        <SortableHeader sortField={sortField} sortOrder={sortOrder} onSort={onSort} columns={columns} />
        <tbody>
          {activeProjects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </tbody>
      </Table>
      {hasDoneProjects && (
        <div className="text-center mb-4">
          <button className="btn btn-sm btn-link" onClick={() => setShowDoneProjects((prev) => !prev)}>
            {showDoneProjects ? "hide done projects" : "show done projects"}
          </button>
        </div>
      )}
      {showDoneProjects && hasDoneProjects && (
        <Table responsive="md" striped>
          <tbody>
            {doneProjects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
