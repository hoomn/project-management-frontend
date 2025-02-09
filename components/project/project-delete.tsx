"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ProjectProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import { Alert } from "react-bootstrap";

export default function ProjectDelete({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<ProjectProps>(`/projects/${id}/`),
  });

  const mutation = useMutation({
    mutationFn: () => api.delete(`/projects/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/projects/");
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
          Are you sure you want to delete &quot;{data?.title}&quot; project?
          <br />
          <strong>This action cannot be undone!</strong>
        </Alert>
        <div className="text-end">
          <Link className="btn btn-outline-dark me-2" href={`/projects/${id}/`}>
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
