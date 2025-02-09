import dynamic from "next/dynamic";

import { useQuery } from "@tanstack/react-query";
import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";

import { OptionProps } from "@/types";

import api from "@/lib/api";
import { formatLabel } from "@/utils/form-label";

import FormLabel from "./form-label";

// Dynamically import react-select with SSR disabled
const Select = dynamic(() => import("react-select"), { ssr: false });

type APIMultiSelectProps<T extends FieldValues> = {
  name: Path<T>;
  defaultValue: PathValue<T, Path<T>>;
  control: Control<T>;
  label?: string;
  fetchUrl: string;
  className?: string;
};

export default function APIMultiSelect<T extends FieldValues>({
  name,
  defaultValue,
  control,
  label,
  fetchUrl,
  className = "col-md-12",
}: APIMultiSelectProps<T>) {
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
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value, ref } }) => (
          <Select
            ref={ref}
            options={options}
            value={options.filter((option) => (Array.isArray(value) ? value.includes(option.value) : false))}
            onChange={(val) => onChange((val as OptionProps[]).map((c) => c.value))}
            isMulti
            isLoading={isLoading}
            isDisabled={isError}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                borderRadius: 0,
              }),
            }}
          />
        )}
      />
    </div>
  );
}
