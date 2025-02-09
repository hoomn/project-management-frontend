import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { SubtaskProps } from "@/types";

import SubtaskRetrieve from "@/components/subtask/subtask-retrieve";

import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["subtasks", id],
    queryFn: () => api.get<SubtaskProps>(`/subtasks/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubtaskRetrieve id={id} />
    </HydrationBoundary>
  );
}
