"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { ProjectProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import ProjectForm from "./project-form";

export default function ProjectUpdate({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<ProjectProps>(`/projects/${id}/`),
  });

  const mutation = useMutation({
    mutationFn: (updatedProject: ProjectProps) => api.put(`/projects/${id}/`, updatedProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      router.push(`/projects/${id}`);
    },
    onError: handleMutationError,
  });

  const onSubmit: SubmitHandler<ProjectProps> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      <PageHeader title="Update Project" />
      {mutation.isError && <MutationError error={error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <ProjectForm onSubmit={onSubmit} defaultValues={data} />
    </>
  );
}
