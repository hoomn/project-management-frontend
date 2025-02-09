import React from "react";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { formatLabel } from "@/utils/form-label";

import { Form } from "react-bootstrap";

import FormLabel from "./form-label";

type FormInputFieldProps = {
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  label?: string;
  type?: string;
  className?: string;
};

export default function FormInputField({
  name,
  register,
  error,
  label,
  type = "text",
  className = "col-md-6",
}: FormInputFieldProps) {
  return (
    <div className={className}>
      <FormLabel label={label || formatLabel(name)} />
      {type === "textarea" ? (
        <Form.Control as="textarea" rows={5} {...register} isInvalid={!!error} />
      ) : (
        <Form.Control type={type} {...register} isInvalid={!!error} />
      )}
      {error && <Form.Control.Feedback type="invalid">{error.message as string}</Form.Control.Feedback>}
    </div>
  );
}
