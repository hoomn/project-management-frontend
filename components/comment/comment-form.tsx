import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

import { CommentProps } from "@/types";

import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

type CommentFormProps = {
  contentType: string;
  objectId: string;
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

  const {
    formState: { isDirty },
    reset,
    register,
    handleSubmit,
  } = useForm<CommentProps>({ defaultValues: comment ? comment : { text: "" } });

  const mutation = useMutation({
    mutationFn: comment
      ? (updatedComment: CommentProps) => api.put(`/comments/${comment.id}/`, updatedComment)
      : (newComment: CommentProps) =>
          api.post("/comments/", { ...newComment, content_type: contentType, object_id: objectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentType, objectId] });
      if (toggleUpdate) toggleUpdate();
      reset();
    },
    onError: handleMutationError,
  });

  const onSubmit: SubmitHandler<CommentProps> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}
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

          <div className="text-end mt-2">
            {mutation.isPending ? (
              <Loading />
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
