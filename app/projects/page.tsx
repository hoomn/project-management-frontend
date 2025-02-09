import { Suspense } from "react";

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { ProjectProps } from "@/types";

import ProjectsList from "@/components/project/project-list";
import Icon from "@/components/ui/icon";
import PageHeader from "@/components/ui/page-header";

import api from "@/lib/api";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<ProjectProps[]>("/projects/"),
  });

  const menuItems = [
    {
      icon: <Icon icon={"plus-circle"} />,
      name: "new project",
      url: "/projects/new",
    },
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader title="Projects" items={menuItems} />
      <Suspense>
        <ProjectsList />
      </Suspense>
    </HydrationBoundary>
  );
}
