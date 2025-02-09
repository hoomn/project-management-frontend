import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { TaskProps } from "@/types";

import SubtaskDelete from "@/components/subtask/subtask-delete";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["subtasks", id],
    queryFn: () => api.get<TaskProps>(`/subtasks/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader title="Delete Subtask" />
      <SubtaskDelete id={id} />
    </HydrationBoundary>
  );
}
