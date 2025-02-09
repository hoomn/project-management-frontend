export default function SectionHeader({ title, borderColor = "" }: { title: string; borderColor?: string }) {
  return (
    <div className="mt-4">
      <h5 className={`fw-light text-muted border-bottom border-4 mb-0 border-${borderColor}`}>{title}</h5>
    </div>
  );
}
