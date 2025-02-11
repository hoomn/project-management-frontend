"use client";

import { useQuery } from "@tanstack/react-query";

import { TaskProps } from "@/types";

import TaskRow from "@/components/task/task-row";
import FetchError from "@/components/ui/fetch-error";

import api from "@/lib/api";

export default function ProjectTaskListSub({ projectId }: { projectId: string }) {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks", { project: projectId }],
    queryFn: () => api.get<TaskProps[]>(`projects/${projectId}/tasks/`),
  });

  if (isLoading)
    return (
      <tr>
        <td>Loading...</td>
      </tr>
    );
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {data.map((task: TaskProps) => (
        <TaskRow key={task.id} task={task} submenu />
      ))}
    </>
  );
}
