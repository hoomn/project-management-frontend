import { Controller } from "react-hook-form";
import Select from "react-select";

type MultiSelectProps = {
  options: OptionProps[];
  defaultValue: number[];
  isPending: boolean;
  control: any;
  name: string;
  label: string;
};

export default function MultiSelect({
  options,
  defaultValue = [],
  isPending = true,
  control,
  name,
  label,
}: MultiSelectProps) {
  return (
    <>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      {isPending ? (
        <Select isLoading isDisabled />
      ) : (
        <>
          <Controller
            name={name}
            control={control}
            defaultValue={options.filter(({ value }: { value: number }) => defaultValue.includes(value))}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                options={options}
                value={options.filter((option: OptionProps) => value.includes(option.value))}
                onChange={(val) => onChange(val.map((c) => c.value))}
                isMulti
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: 0,
                  }),
                }}
              />
            )}
          />
        </>
      )}
    </>
  );
}
