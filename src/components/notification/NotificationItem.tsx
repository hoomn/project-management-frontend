import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Icon from "../Icon";

import { updateNotification } from "../../api/notification";

export default function NotificationItem({ notification }: { notification: NotificationProps }) {
  const authHeader: string | null = useAuthHeader();
  const [show, setShow] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedNotification: NotificationProps) => updateNotification(authHeader, updatedNotification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleChange = (id: number) => {
    const data: any = {
      id: id,
      viewed: true,
    };
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <li className="list-group-item d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
          {mutation.isPending ? (
            <span className="me-2">
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            </span>
          ) : (
            <input
              type="checkbox"
              className="form-check-input me-2"
              onChange={() => handleChange(notification.id)}
              disabled={mutation.isPending}
            />
          )}
          <span className="cursor-pointer" onClick={() => setShow((curr) => !curr)}>
            {notification.content_type} {notification.action}d
            {Array.isArray(notification.description) && (notification.description.length > 0 || notification.url) && (
              <span className="text-primary ms-2">{show ? <Icon icon="dash-lg" /> : <Icon icon="plus-lg" />}</span>
            )}
          </span>
          {show &&
            Array.isArray(notification.description) &&
            (notification.description.length > 0 || notification.url) && (
              <ul className="text-muted fst-italic ms-4 my-1">
                {notification.description?.map((description: ActivityDescriptionProps, index: number) => (
                  <li key={index}>{description.verbose_name} changed</li>
                ))}
                {notification.url && (
                  <li>
                    <Link to={notification.url}>
                      Go to {notification.content_type}
                      <Icon icon="box-arrow-up-right" ms={2} />
                    </Link>
                  </li>
                )}
              </ul>
            )}
        </div>
        <small className="text-muted fst-italic">{notification.time_since_creation}</small>
      </li>
    </>
  );
}
