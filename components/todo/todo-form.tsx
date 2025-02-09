import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TodoProps } from "@/types";

import Icon from "@/components/ui/icon";

type TodoFormProps = {
  onSubmit: (data: TodoProps, reset: () => void) => void;
};

const schema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  due_date: z.string().nullable(),
});

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { description: "", due_date: null },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, reset))} className="my-3">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <input {...register("description")} className="form-control" placeholder="Description" />
          {errors.description && <p className="text-danger">{errors.description.message}</p>}
        </div>
        <div className="col-12 col-md-4">
          <input {...register("due_date")} type="date" className="form-control" />
        </div>

        <div className="col-12 col-md-2">
          <button type="submit" className="btn btn-outline-secondary w-100" disabled={!isDirty}>
            <Icon icon="plus-lg" me={0} /> add
          </button>
        </div>
      </div>
    </form>
  );
}
