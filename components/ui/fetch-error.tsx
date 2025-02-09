import { Alert } from "react-bootstrap";

export default function FetchError({ message = "" }: { message?: string }) {
  const errorMessage = message || "An unexpected error occurred. Please try again later.";
  return <Alert variant="danger">{errorMessage}</Alert>;
}
