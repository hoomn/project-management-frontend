import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { UserProps } from "@/types";

import UserUpdate from "@/components/auth/user-update";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users", "current"],
    queryFn: () => api.get<UserProps>("/auth/users/me"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader title="Update Profile" />
      <div className="max-25 mx-auto">
        <div className="text-center mb-4">
          <i className="bi bi-person-bounding-box auth-icon"></i>
        </div>
        <UserUpdate />
      </div>
    </HydrationBoundary>
  );
}
