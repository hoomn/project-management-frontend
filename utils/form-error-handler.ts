import { toast } from "react-toastify";

interface ApiError {
  status?: number;
  data?: Record<string, any>;
  message?: string;
}

export const handleMutationError = (error: unknown) => {
  if (error && typeof error === "object" && "status" in error) {
    const apiError = error as ApiError;

    if (apiError.status === 400 && apiError.data) {
      // Extract and display field-specific error messages
      Object.entries(apiError.data).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        } else {
          toast.error(`${field}: ${messages}`);
        }
      });
    } else {
      toast.error(`Oops, something went wrong! ${apiError.message}`);
    }
  } else {
    toast.error("An unknown error occurred.");
  }
};
