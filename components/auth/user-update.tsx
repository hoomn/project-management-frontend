"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

import { UserProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import UserForm from "./user-form";

export default function UserUpdate() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => api.get<UserProps>("/auth/users/me/"),
  });

  const mutation = useMutation({
    mutationFn: (data: UserProps) => api.put("/auth/users/me/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      router.push("/auth/profile");
    },
    onError: handleMutationError,
  });

  const onSubmit: SubmitHandler<UserProps> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      {mutation.isPending && <Loading />}
      <UserForm onSubmit={onSubmit} defaultValues={data} />
    </>
  );
}
