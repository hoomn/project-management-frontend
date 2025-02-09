export default function Version() {
  const version = process.env.NEXT_PUBLIC_VERSION || "-.-.-";
  return <small className="text-muted fst-italic">v{version}</small>;
}
