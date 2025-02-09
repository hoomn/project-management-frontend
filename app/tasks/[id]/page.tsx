import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { TaskProps } from "@/types";

import TaskRetrieve from "@/components/task/task-retrieve";

import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", id],
    queryFn: () => api.get<TaskProps>(`/tasks/${id}`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskRetrieve id={id} />
    </HydrationBoundary>
  );
}
