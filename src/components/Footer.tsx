import Version from "./Version";

export default function Footer() {
  return (
    <div className="bg-light py-3">
      <div className="container">
        <div className="text-center">
          <p className="text-muted mb-0">Project Management</p>
          <Version />
        </div>
      </div>
    </div>
  );
}
