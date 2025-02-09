import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { FloatingLabel, Form } from "react-bootstrap";

interface FloatingInputProps {
  type?: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
}

export default function FloatingInput({
  type = "text",
  label,
  register,
  error,
  className = "mb-2",
}: FloatingInputProps) {
  return (
    <FloatingLabel label={label} className={className}>
      <Form.Control type={type} placeholder={label} isInvalid={!!error} {...register} />
      {error?.message && <Form.Control.Feedback type="invalid">{error?.message as string}</Form.Control.Feedback>}
    </FloatingLabel>
  );
}
