export default function NoData({ type = "data", my = 5 }: { type?: string; my?: number }) {
  return (
    <div className="text-center">
      <p className={`text-muted fst-italic mb-0 py-${my}`}>
        <small>No {type ? type : "data"} found.</small>
      </p>
    </div>
  );
}
