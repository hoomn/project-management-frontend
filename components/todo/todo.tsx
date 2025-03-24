import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Markdown from "react-markdown";

import { TodoProps } from "@/types";

import DateTime from "@/components/ui/date-time";
import Icon from "@/components/ui/icon";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import { Alert } from "react-bootstrap";

export default function Todo({ todo }: { todo: TodoProps }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation<TodoProps, Error, TodoProps>({
    mutationFn: (data) =>
      data.completed ? api.post(`/todos/${data.id}/mark_undone/`) : api.post(`/todos/${data.id}/mark_done/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: handleMutationError,
  });

  const deleteMutation = useMutation<TodoProps, Error, TodoProps>({
    mutationFn: (data) => api.delete(`/todos/${data.id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: handleMutationError,
  });

  return (
    <>
      {toggleMutation.isError && (
        <Alert variant="danger" onClose={() => toggleMutation.reset()} dismissible>
          {toggleMutation.error.message}
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert variant="danger" onClose={() => deleteMutation.reset()} dismissible>
          {deleteMutation.error.message}
        </Alert>
      )}
      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
        <div className="ms-2 me-auto">
          {toggleMutation.isPending ? (
            <span className="me-2">
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            </span>
          ) : (
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={todo.completed}
              onChange={() => toggleMutation.mutate(todo)}
              disabled={toggleMutation.isPending}
            />
          )}
          <span className={`mb-0 ${todo.completed ? "text-decoration-line-through" : ""}`}>
            <Markdown>{todo.description}</Markdown>
          </span>
        </div>

        <div className="text-muted">
          <small>Due: </small>
          <DateTime dateString={todo.due_date} />
        </div>
        <div>
          <button className="btn btn-sm text-danger ms-2" onClick={() => deleteMutation.mutate(todo)}>
            <Icon icon="trash" me={0} />
          </button>
        </div>
      </li>
    </>
  );
}
