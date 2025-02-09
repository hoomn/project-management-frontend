import { useQuery } from "@tanstack/react-query";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { OptionProps } from "@/types";

import api from "@/lib/api";
import { formatLabel } from "@/utils/form-label";

import Form from "react-bootstrap/Form";

import FormLabel from "./form-label";

type APISelectProps = {
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  label?: string;
  fetchUrl: string;
  className?: string;
};

export default function APISelect({ name, register, error, label, fetchUrl, className = "col-md-3" }: APISelectProps) {
  const {
    data: options = [],
    isLoading,
    isError,
  } = useQuery<OptionProps[]>({
    queryKey: ["select-options", fetchUrl],
    queryFn: () => api.get(fetchUrl),
  });

  return (
    <div className={className}>
      <FormLabel label={label || formatLabel(name)} />
      {isLoading && (
        <Form.Select disabled>
          <option>Loading...</option>
        </Form.Select>
      )}
      {isError && (
        <Form.Select disabled>
          <option>Error fetching</option>
        </Form.Select>
      )}
      {options.length > 0 && (
        <Form.Select {...register} isInvalid={!!error} disabled={isLoading || isError}>
          <option value="">{isLoading ? "Loading..." : isError ? "Error fetching" : "-- select --"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      )}
      {error && <Form.Control.Feedback type="invalid">{error?.message as string}</Form.Control.Feedback>}
    </div>
  );
}
