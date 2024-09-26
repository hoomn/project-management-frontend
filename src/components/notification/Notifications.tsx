import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import Alert from "react-bootstrap/Alert";

import Icon from "../Icon";
import Loading from "../Loading";
import NotificationItem from "./NotificationItem";

import { dismissAllNotification, fetchNotifications } from "../../api/notification";

export default function Notifications() {
  const defaultRowsDisplayed = 5;

  const [show, setShow] = useState<boolean>(false);
  const [rowsDisplayed, setRowsDisplayed] = useState(defaultRowsDisplayed);

  const authHeader: string | null = useAuthHeader();

  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(authHeader),
  });

  const mutation = useMutation({
    mutationFn: () => dismissAllNotification(authHeader),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleDismissAll = () => {
    mutation.mutate();
  };

  const handleShowMoreRows = () => {
    setRowsDisplayed((prev) => prev + defaultRowsDisplayed);
  };

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  if (data.length < 1) return;

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
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
                    <NotificationItem key={notification.id} notification={notification} />
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
