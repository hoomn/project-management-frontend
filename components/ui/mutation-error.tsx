import { Alert } from "react-bootstrap";

type MutationErrorProps = {
  error: unknown;
  reset: () => void;
};

export default function MutationError({ error, reset }: MutationErrorProps) {
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <Alert variant="danger" onClose={() => reset} dismissible>
      {errorMessage}
    </Alert>
  );
}
