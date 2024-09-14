import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { createComment, updateComment } from "../../api/comment";

import Loading from "../Loading";
import Alert from "react-bootstrap/Alert";
import Icon from "../Icon";

type CommentFormProps = {
  contentType: number;
  objectId: number;
  comment?: CommentProps | null;
  toggleUpdate?: () => void;
};

export default function CommentForm({
  contentType,
  objectId,
  comment = null,
  toggleUpdate = undefined,
}: CommentFormProps) {
  const queryClient = useQueryClient();
  const authHeader: string = useAuthHeader() || "";
  // @ts-ignore
  const auth: UserProps = useAuthUser();

  const {
    formState: { isDirty, errors },
    reset,
    register,
    handleSubmit,
  } = useForm<CommentProps>({ defaultValues: comment ? comment : { text: "" } });

  const mutation = useMutation({
    mutationFn: comment
      ? (updatedComment: CommentProps) => updateComment(authHeader, updatedComment)
      : (newComment: CommentProps) =>
          createComment(authHeader, { ...newComment, content_type: contentType, object_id: objectId }),
    onSuccess: () => {
      // Reset the form after successful submission
      reset();
      queryClient.invalidateQueries({ queryKey: ["comments", contentType, objectId] });
      if (toggleUpdate) toggleUpdate();
    },
  });

  const onSubmit: SubmitHandler<CommentProps> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible className="mb-0">
          {mutation.error.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <textarea
            {...register("text", {
              required: "This is required.",
              maxLength: {
                value: 1000,
                message: "This input exceed maxLength.",
              },
            })}
            className="form-control"
            placeholder="write a comment..."
            rows={2}
          />
          <ErrorMessage
            errors={errors}
            name="text"
            render={({ message }) => <p className="alert alert-danger mb-0 p-2">{message}</p>}
          />
          <div className="text-end mt-2">
            {mutation.isPending ? (
              <Loading size={"sm"} />
            ) : (
              <button type="submit" className="btn btn-sm btn-outline-dark" disabled={!isDirty}>
                <Icon icon={comment ? "floppy" : "send"} me={2} />
                {comment ? "save" : "post"}
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
