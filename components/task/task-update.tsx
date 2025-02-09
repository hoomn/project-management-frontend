"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

import { TaskProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import TaskForm from "./task-form";

export default function TaskUpdate({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => api.get<TaskProps>(`/tasks/${id}/`),
  });

  const mutation = useMutation({
    mutationFn: (updatedTask: TaskProps) => api.put(`/tasks/${id}/`, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      router.push(`/tasks/${id}`);
    },
    onError: handleMutationError,
  });

  const onSubmit: SubmitHandler<TaskProps> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <TaskForm onSubmit={onSubmit} defaultValues={data} />
    </>
  );
}
