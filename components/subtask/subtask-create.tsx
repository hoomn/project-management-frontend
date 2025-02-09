"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

import { SubtaskProps } from "@/types";

import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";

import SubtaskForm from "./subtask-form";

export default function TaskCreate({ taskId }: { taskId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<SubtaskProps, Error, SubtaskProps>({
    mutationFn: (data: SubtaskProps) => api.post("/subtasks/", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId, "subtasks"] });
      router.push(`/subtasks/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<SubtaskProps> = (data) => {
    data.task = taskId;
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <SubtaskForm onSubmit={onSubmit} />
    </>
  );
}
