import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { ProjectProps } from "@/types";

import ProjectRetrieve from "@/components/project/project-retrieve";

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
      <ProjectRetrieve id={id} />
    </HydrationBoundary>
  );
}
