"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TaskProps } from "@/types";

import APIMultiSelect from "@/components/form/api-multi-select";
import APISelect from "@/components/form/api-select";
import BackButton from "@/components/form/back-button";
import FormInputField from "@/components/form/form-input-field";
import SubmitButton from "@/components/form/submit-button";

import { taskSchema } from "@/lib/zod";

import Form from "react-bootstrap/Form";

type TaskFormProps = {
  defaultValues?: Partial<TaskProps>;
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

        <APISelect
          name="project"
          register={register("project")}
          error={errors.project}
          fetchUrl="/options/project/"
          disabled
          className="col-md-6"
        />

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

        <APISelect name="status" register={register("status")} error={errors.status} fetchUrl="/options/status/" />

        <APISelect
          name="priority"
          register={register("priority")}
          error={errors.priority}
          fetchUrl="/options/priority/"
        />

        <APIMultiSelect<TaskProps>
          name="assigned_to"
          defaultValue={defaultValues?.assigned_to || []}
          control={control}
          fetchUrl="/options/user/"
          queryKey="user"
        />

        <div className="col-md-12 mt-4 text-end">
          <BackButton
            href={defaultValues?.id ? `/tasks/${defaultValues?.id}` : `/projects/${defaultValues?.project}`}
          />
          <SubmitButton isDirty={isDirty} isUpdate={!!defaultValues?.id} />
        </div>
      </Form>
    </>
  );
}
