import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

import { AttachmentProps } from "@/types";

import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import MutationError from "@/components/ui/mutation-error";

import api from "@/lib/api";
import { handleMutationError } from "@/utils/form-error-handler";

type AttachmentFormProps = {
  contentType: string;
  objectId: string;
  attachment?: AttachmentProps | null;
  toggleUpdate?: () => void;
};

export default function AttachmentForm({ contentType, objectId, attachment, toggleUpdate }: AttachmentFormProps) {
  const queryClient = useQueryClient();

  const {
    formState: { isDirty },
    reset,
    register,
    handleSubmit,
  } = useForm<AttachmentProps>({ defaultValues: attachment ? attachment : { file: "", description: "" } });

  const mutation = useMutation({
    mutationFn: attachment
      ? (data: AttachmentProps) =>
          api.put(`/attachments/${attachment.id}/`, data, { "Content-Type": "multipart/form-data" })
      : (data: AttachmentProps) =>
          api.post(
            "/attachments/",
            { ...data, content_type: contentType, object_id: objectId },
            { "Content-Type": "multipart/form-data" },
          ),
    onSuccess: () => {
      // Reset the form after successful submission
      reset();
      queryClient.invalidateQueries({ queryKey: ["attachments", contentType, objectId] });
      if (toggleUpdate) toggleUpdate();
    },
    onError: handleMutationError,
  });

  const onSubmit: SubmitHandler<AttachmentProps> = (data) => {
    data = { ...data, file: data.file[0] };
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && <MutationError error={mutation.error} reset={mutation.reset} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input {...register("file", { required: "This is required." })} type="file" className="form-control" />
          <input
            {...register("description", {
              maxLength: {
                value: 255,
                message: "This input exceed maxLength.",
              },
            })}
            className="form-control"
            placeholder="description"
          />
        </div>

        <div className="text-end mt-2">
          {mutation.isPending ? (
            <Loading />
          ) : (
            <button type="submit" className="btn btn-sm btn-outline-dark" disabled={!isDirty}>
              <Icon icon={attachment ? "floppy" : "cloud-upload"} me={2} />
              {attachment ? "save" : "upload"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
