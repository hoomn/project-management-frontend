"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

import { ProjectProps } from "@/types";

import ProjectForm from "@/components/project/project-form";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ProjectProps, Error, ProjectProps>({
    mutationFn: (newProject: ProjectProps) => api.post("/projects/", newProject),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/projects/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<ProjectProps> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <PageHeader title="New Project" />
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <ProjectForm onSubmit={onSubmit} />
    </>
  );
}
