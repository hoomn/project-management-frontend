"use client";

import { useQuery } from "@tanstack/react-query";

import { TaskProps } from "@/types";

import TaskHeader from "@/components/task/task-header";
import TaskRow from "@/components/task/task-row";
import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import NoData from "@/components/ui/no-data";

import api from "@/lib/api";

import Table from "react-bootstrap/Table";

export default function ProjectTaskList({ projectId }: { projectId: string }) {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks", { project: projectId }],
    queryFn: () => api.get<TaskProps[]>(`projects/${projectId}/tasks/`),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {data.length === 0 ? (
        <NoData type="tasks" />
      ) : (
        <Table responsive="md">
          <TaskHeader />
          <tbody>
            {data.map((task: TaskProps) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
