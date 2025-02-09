"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TodoProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import NoData from "@/components/ui/no-data";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

import Todo from "./todo";
import TodoForm from "./todo-form";

export default function TodoList() {
  const [show, setShow] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const queryClient = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => api.get<TodoProps[]>("/todos/"),
  });

  const mutation = useMutation<TodoProps, Error, TodoProps>({
    mutationFn: (data) => api.post("/todos/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (resetForm) resetForm(); // Call reset only after successful mutation
    },
    onError: handleMutationError,
  });

  const onSubmit = (data: TodoProps, reset: () => void) => {
    setResetForm(() => reset);
    mutation.mutate(data);
  };

  const filteredTodos = todos.filter((todo) => showCompleted || !todo.completed);
  const completedTodos = todos.filter((todo) => !todo.completed);

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <div className="card mt-2">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <button className="btn btn-link p-0 me-auto" onClick={() => setShow((curr) => !curr)}>
            <Icon icon="check2-circle" /> Todos
          </button>
          <span className="badge rounded-pill text-bg-primary ms-2">
            {completedTodos.length < 10 ? completedTodos.length : "10+"}
          </span>
        </div>

        {show && (
          <>
            <TodoForm onSubmit={onSubmit} />
            <ul className="list-group list-group-flush mt-2 p-2">
              {filteredTodos.map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
            </ul>

            {filteredTodos.length === 0 && <NoData type="todos" my={3} />}
            <div className="text-center">
              <button className="btn btn-sm btn-link" onClick={() => setShowCompleted((prev) => !prev)}>
                {showCompleted ? "hide done tasks" : "show done tasks"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
