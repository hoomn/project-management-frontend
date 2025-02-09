"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TaskProps } from "@/types";

import APIMultiSelect from "@/components/form/api-multi-select";
import APISelect from "@/components/form/api-select";
import FormInputField from "@/components/form/form-input-field";
import Icon from "@/components/ui/icon";

import { taskSchema } from "@/lib/zod";

import Form from "react-bootstrap/Form";

type TaskFormProps = {
  defaultValues?: TaskProps;
  onSubmit: (data: TaskProps) => void;
};

export default function TaskForm({ defaultValues, onSubmit }: TaskFormProps) {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    control,
  } = useForm<TaskProps>({ resolver: zodResolver(taskSchema), defaultValues });

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="row g-3" noValidate>
        <FormInputField name="title" register={register("title")} error={errors.title} />

        <FormInputField
          name="description"
          type="textarea"
          register={register("description")}
          error={errors.title}
          className="col-md-12"
        />

        <FormInputField
          name="start_date"
          type="date"
          register={register("start_date")}
          error={errors.title}
          className="col-md-3"
        />

        <FormInputField
          name="end_date"
          type="date"
          register={register("end_date")}
          error={errors.title}
          className="col-md-3"
        />

        <APISelect
          name="status"
          register={register("status")}
          error={errors.status}
          fetchUrl="/projects/options/status/"
        />

        <APISelect
          name="priority"
          register={register("priority")}
          error={errors.priority}
          fetchUrl="/projects/options/priority/"
        />

        <APIMultiSelect<TaskProps>
          name="assigned_to"
          defaultValue={defaultValues?.assigned_to || []}
          control={control}
          fetchUrl="/accounts/options/user/"
        />

        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-sm btn-outline-success" disabled={!isDirty}>
            {defaultValues ? (
              <>
                <Icon icon="floppy" />
                save
              </>
            ) : (
              <>
                <Icon icon="plus-circle" />
                add
              </>
            )}
          </button>
        </div>
      </Form>
    </>
  );
}
