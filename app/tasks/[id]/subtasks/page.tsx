import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { SubtaskProps } from "@/types";

import TaskSubtaskList from "@/components/task/task-subtask-list";

import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", id, "subtasks"],
    queryFn: () => api.get<SubtaskProps>(`/tasks/${id}/subtasks/`),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskSubtaskList taskId={id} />
    </HydrationBoundary>
  );
}
