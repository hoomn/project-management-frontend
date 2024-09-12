interface PriorityProps {
  description: string | undefined;
  level: number | undefined;
}

export default function Priority({ description, level }: PriorityProps) {
  return (
    <div className={`priority-${level}`}>
      <small className="ms-2">{description}</small>
    </div>
  );
}
