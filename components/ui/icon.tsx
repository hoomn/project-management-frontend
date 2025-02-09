export type IconProps = {
  icon: string;
  color?: "text-primary" | "text-secondary" | "text-dark" | "text-danger" | "text-success" | "";
  title?: string;
  me?: number;
  ms?: number;
};

export default function Icon({ icon, me = 2, ms = 0, color = "", title = "" }: IconProps) {
  return <i className={`bi bi-${icon} me-${me} ms-${ms} ${color}`} title={title}></i>;
}
