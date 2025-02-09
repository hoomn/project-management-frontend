import { useState } from "react";

import { SortableColumn, TaskProps } from "@/types";

import NoData from "@/components/ui/no-data";
import SortableHeader from "@/components/ui/sortable-header";

import { Table } from "react-bootstrap";

import TaskRow from "./task-row";

interface TaskGridProps {
  tasks: TaskProps[];
  sortField: string;
  sortOrder: string;
  onSort: (field: string) => void;
}

export default function TaskGrid({ tasks, sortField, sortOrder, onSort }: TaskGridProps) {
  const [showDoneTasks, setShowDoneTasks] = useState(false);

  if (tasks.length === 0) return <NoData type="tasks" />;

  const columns: SortableColumn[] = [
    { key: "owner", label: "Owner" },
    { key: "title", label: "Title", sortable: true },
    { key: "icon", label: "" },
    { key: "assigned_to", label: "Assigned to", sortable: true },
    { key: "start_date", label: "Start Date", sortable: true },
    { key: "end_date", label: "End Date", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "priority", label: "Priority", sortable: true },
    { key: "action", label: "" },
  ];

  const activeTasks = tasks.filter((task) => task.status !== 1);
  const doneTasks = tasks.filter((task) => task.status === 1);
  const hasDoneTasks = doneTasks.length > 0;

  return (
    <>
      <Table responsive="md">
        <SortableHeader sortField={sortField} sortOrder={sortOrder} onSort={onSort} columns={columns} />
        <tbody>
          {activeTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </tbody>
      </Table>
      {hasDoneTasks && (
        <div className="text-center mb-4">
          <button className="btn btn-sm btn-link" onClick={() => setShowDoneTasks((prev) => !prev)}>
            {showDoneTasks ? "hide done tasks" : "show done tasks"}
          </button>
        </div>
      )}
      {showDoneTasks && hasDoneTasks && (
        <Table responsive="md" striped>
          <tbody>
            {doneTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
