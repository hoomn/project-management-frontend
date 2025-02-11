"use client";

import { useQuery } from "@tanstack/react-query";

import { SubtaskProps } from "@/types";

import SubtaskHeader from "@/components/subtask/subtask-header";
import SubtaskRow from "@/components/subtask/subtask-row";
import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import NoData from "@/components/ui/no-data";

import api from "@/lib/api";

import Table from "react-bootstrap/Table";

export default function TaskSubtaskList({ taskId }: { taskId: string }) {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["subtasks", { task: taskId }],
    queryFn: () => api.get<SubtaskProps[]>(`tasks/${taskId}/subtasks/`),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {data.length === 0 ? (
        <NoData type="tasks" />
      ) : (
        <Table responsive="md">
          <SubtaskHeader />
          <tbody>
            {data.map((task: SubtaskProps) => (
              <SubtaskRow key={task.id} subtask={task} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
