export type LabelProps = {
  label: string;
  parent: string;
};

export default function FormLabel({ label, parent }: LabelProps) {
  return (
    <label htmlFor={parent} className="form-label text-muted fw-lighter">
      {label}
    </label>
  );
}
