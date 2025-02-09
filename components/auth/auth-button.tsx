import { Button } from "react-bootstrap";

type AuthButtonProps = {
  title: string;
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function AuthButton({
  title = "Submit",
  isLoading = false,
  disabled = false,
  onClick,
}: AuthButtonProps) {
  return (
    <Button
      variant="outline-secondary"
      type="submit"
      className="w-100"
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
          <span role="status">Loading...</span>
        </>
      ) : (
        title
      )}
    </Button>
  );
}
