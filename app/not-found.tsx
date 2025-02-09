import Link from "next/link";

export default function NotFound() {
  return (
    <div className="d-flex justify-content-center pt-5">
      <div className="d-flex align-items-center border-end p-3">
        <h1 className="display-1">404</h1>
      </div>
      <div className="p-3">
        <h2 className="fw-normal fs-3">Page Not Found</h2>
        <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link className="btn btn-outline-secondary" href="/">
          <i className="bi bi-house-door me-2"></i>
          Home
        </Link>
      </div>
    </div>
  );
}
