import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { ProjectProps } from "@/types";

import ProjectTaskList from "@/components/project/project-task-list";

import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", { project: id }],
    queryFn: () => api.get<ProjectProps>(`projects/${id}/tasks/`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectTaskList projectId={id} />
    </HydrationBoundary>
  );
}
