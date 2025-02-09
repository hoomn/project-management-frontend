import { useState } from "react";

import Link from "next/link";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ActivityDescriptionProps, NotificationProps } from "@/types";

import Icon from "@/components/ui/icon";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

export default function NotificationItem({ notification }: { notification: NotificationProps }) {
  const [show, setShow] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<NotificationProps> & { id: string }) => api.put(`/notifications/${data.id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: handleMutationError,
  });

  const handleChange = (id: string) => {
    const data = {
      id: id,
      viewed: true,
    };
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
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
                    <Link href={notification.url}>
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
