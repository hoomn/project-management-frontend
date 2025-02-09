"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ProjectProps } from "@/types";

import APIMultiSelect from "@/components/form/api-multi-select";
import APISelect from "@/components/form/api-select";
import FormInputField from "@/components/form/form-input-field";
import Icon from "@/components/ui/icon";

import { projectSchema } from "@/lib/zod";

import Form from "react-bootstrap/Form";

type ProjectFormProps = {
  defaultValues?: ProjectProps;
  onSubmit: (data: ProjectProps) => void;
};

export default function ProjectForm({ defaultValues, onSubmit }: ProjectFormProps) {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    control,
  } = useForm<ProjectProps>({ resolver: zodResolver(projectSchema), defaultValues });

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className="row g-3" noValidate>
        <FormInputField name="title" register={register("title")} error={errors.title} />

        <APISelect
          name="domain"
          register={register("domain")}
          error={errors.domain}
          fetchUrl="/options/domain/"
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

        <APIMultiSelect<ProjectProps>
          name="assigned_to"
          defaultValue={defaultValues?.assigned_to || []}
          control={control}
          fetchUrl="/options/user/"
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
