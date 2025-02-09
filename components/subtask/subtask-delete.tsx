"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SubtaskProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import { Alert } from "react-bootstrap";

export default function SubtaskDelete({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["subtasks", id],
    queryFn: () => api.get<SubtaskProps>(`/subtasks/${id}/`),
  });

  const mutation = useMutation({
    mutationFn: () => api.delete(`/subtasks/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", `${data!.task}`, "subtasks"] });
      router.push(`/tasks/${data!.task}`);
    },
    onError: handleMutationError,
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <div className="mx-auto mt-5" style={{ maxWidth: 600 }}>
        <Alert variant={"danger"}>
          Are you sure you want to delete &quot;{data?.title}&quot; subtask?
          <br />
          <strong>This action cannot be undone!</strong>
        </Alert>
        <div className="text-end">
          <Link className="btn btn-outline-dark me-2" href={`/tasks/${id}/`}>
            never mind
          </Link>
          <button className="btn btn-danger" onClick={() => mutation.mutate()}>
            delete
          </button>
        </div>
      </div>
    </>
  );
}
