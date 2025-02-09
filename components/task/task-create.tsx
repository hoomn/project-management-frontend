"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

import { TaskProps } from "@/types";

import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";

import TaskForm from "./task-form";

export default function TaskCreate({ projectId }: { projectId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<TaskProps, Error, TaskProps>({
    mutationFn: (data: TaskProps) => api.post("/tasks/", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] });
      router.push(`/tasks/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<TaskProps> = (data) => {
    data.project = projectId;
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <TaskForm onSubmit={onSubmit} />
    </>
  );
}
