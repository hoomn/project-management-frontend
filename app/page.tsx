import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { ActivityProps } from "@/types";

import ActivityList from "@/components/activity/activity-list";
import NotificationList from "@/components/notification/notification-list";
import TodoList from "@/components/todo/todo-list";

import api from "@/lib/api";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["activities", "page", 1],
    queryFn: () => api.get<ActivityProps[]>("/activities/?page=1"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-4">
        <NotificationList />
      </div>
      <div className="mt-4">
        <TodoList />
      </div>
      <div className="mt-4">
        <ActivityList />
      </div>
    </HydrationBoundary>
  );
}
