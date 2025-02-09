import { Suspense } from "react";

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { TaskProps } from "@/types";

import TaskList from "@/components/task/task-list";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get<TaskProps[]>("/tasks/"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader title="Tasks" />
      <Suspense>
        <TaskList />
      </Suspense>
    </HydrationBoundary>
  );
}
