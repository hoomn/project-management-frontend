"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { NotificationProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import Notification from "./notification";

export default function Notifications() {
  const defaultRowsDisplayed = 5;

  const [show, setShow] = useState<boolean>(false);
  const [rowsDisplayed, setRowsDisplayed] = useState(defaultRowsDisplayed);

  const queryClient = useQueryClient();

  const {
    isLoading,
    data = [],
    error,
  } = useQuery<NotificationProps[]>({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications/"),
    staleTime: 30 * 1000, // 30 seconds
  });

  const mutation = useMutation({
    mutationFn: () => api.post("/notifications/mark_all_as_viewed/"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: handleMutationError,
  });

  const handleDismissAll = () => {
    mutation.mutate();
  };

  const handleShowMoreRows = () => {
    setRowsDisplayed((prev) => prev + defaultRowsDisplayed);
  };

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  if (data.length === 1) return;

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <button className="btn btn-link p-0 me-auto" onClick={() => setShow((curr) => !curr)}>
              <Icon icon="app-indicator" /> Notifications
            </button>
            <span className="badge rounded-pill text-bg-primary ms-2">{data.length < 10 ? data.length : "10+"}</span>
          </div>
          {mutation.isPending ? (
            <Loading />
          ) : (
            show && (
              <>
                <ul className="list-group list-group-flush mt-2 p-2">
                  {data.slice(0, rowsDisplayed).map((notification: NotificationProps) => (
                    <Notification key={notification.id} notification={notification} />
                  ))}
                </ul>
                <div className="text-center">
                  {rowsDisplayed < data.length && (
                    <button className="btn btn-sm btn-link" onClick={handleShowMoreRows}>
                      load more
                    </button>
                  )}
                  {defaultRowsDisplayed !== rowsDisplayed && (
                    <button className="btn btn-sm btn-link" onClick={() => setRowsDisplayed(defaultRowsDisplayed)}>
                      reset
                    </button>
                  )}
                  {data.length > 1 && (
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={handleDismissAll}
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "dismissing..." : "dismiss all"}
                    </button>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}
