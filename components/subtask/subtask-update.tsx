"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

import { SubtaskProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import SubtaskForm from "./subtask-form";

export default function SubtaskUpdate({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["subtasks", id],
    queryFn: () => api.get<SubtaskProps>(`/subtasks/${id}/`),
  });

  const mutation = useMutation({
    mutationFn: (updatedSubtask: SubtaskProps) => api.put(`/subtasks/${id}/`, updatedSubtask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", `${data!.task}`, "subtasks"] });
      router.push(`/subtasks/${id}`);
    },
    onError: handleMutationError,
  });

  const onSubmit: SubmitHandler<SubtaskProps> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <SubtaskForm onSubmit={onSubmit} defaultValues={data} />
    </>
  );
}
