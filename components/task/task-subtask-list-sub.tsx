"use client";

import { useQuery } from "@tanstack/react-query";

import { SubtaskProps } from "@/types";

import SubtaskRow from "@/components/subtask/subtask-row";
import FetchError from "@/components/ui/fetch-error";

import api from "@/lib/api";

export default function TaskSubtaskListSub({ taskId }: { taskId: string }) {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["subtasks", { task: taskId }],
    queryFn: () => api.get<SubtaskProps[]>(`tasks/${taskId}/subtasks/`),
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
      {data.map((task: SubtaskProps) => (
        <SubtaskRow key={task.id} subtask={task} submenu />
      ))}
    </>
  );
}
