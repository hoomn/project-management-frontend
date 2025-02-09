interface StatusProps {
  description: string | undefined;
  level: number | undefined;
}

export default function Status({ description, level }: StatusProps) {
  return (
    <div className={`status-${level}`}>
      <small className="ms-2">{description}</small>
    </div>
  );
}
