import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { ProjectProps } from "@/types";

import ProjectDelete from "@/components/project/project-delete";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<ProjectProps>(`/projects/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader title="Delete Project" />
      <ProjectDelete id={id} />
    </HydrationBoundary>
  );
}
