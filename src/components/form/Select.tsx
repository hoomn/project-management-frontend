import { Controller } from "react-hook-form";
import ReactSelect from "react-select";

type MultiSelectProps = {
  options: OptionProps[];
  defaultValue?: number;
  isPending: boolean;
  control: any;
  required?: boolean;
  name: string;
  label: string;
};

export default function Select({
  options,
  defaultValue,
  isPending = true,
  control,
  required = false,
  name,
  label,
}: MultiSelectProps) {
  return (
    <>
      <label htmlFor={name} className="form-label">
        {label}:
      </label>
      {isPending ? (
        <ReactSelect isLoading isDisabled />
      ) : (
        <>
          <Controller
            name={name}
            control={control}
            rules={required ? { required: `* ${label} is required.` } : {}}
            defaultValue={defaultValue && options.find(({ value }: { value: number }) => value === defaultValue)}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <ReactSelect
                  ref={ref}
                  options={options}
                  value={options.find((option: OptionProps) => option.value === value)}
                  onChange={(val) => onChange(val?.value)}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      borderRadius: 0,
                    }),
                  }}
                />
                {error && <p className="alert alert-danger mb-0 p-2">{error.message}</p>}
              </>
            )}
          />
        </>
      )}
    </>
  );
}
