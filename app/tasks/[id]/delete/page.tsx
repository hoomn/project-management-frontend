import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { TaskProps } from "@/types";

import TaskDelete from "@/components/task/task-delete";
import PageHeader from "@/components/ui/page-header";

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
      <PageHeader title="Delete Task" />
      <TaskDelete id={id} />
    </HydrationBoundary>
  );
}
