type FormLabelProps = {
  label: string;
  htmlFor?: string;
};

export default function FormLabel({ label, htmlFor = undefined }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor} className="form-label text-muted fw-lighter">
      {label}
    </label>
  );
}
