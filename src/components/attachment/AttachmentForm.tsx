import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { createAttachment, updateAttachment } from "../../api/attachment";

import { AttachmentProps, UserProps } from "../../types";
import Loading from "../Loading";
import { Alert } from "react-bootstrap";
import Icon from "../Icon";

type AttachmentFormProps = {
  contentType: number;
  objectId: number;
  attachment?: AttachmentProps | null;
  toggleUpdate?: () => void;
};

export default function AttachmentForm({
  contentType,
  objectId,
  attachment = null,
  toggleUpdate = undefined,
}: AttachmentFormProps) {
  const queryClient = useQueryClient();
  const authHeader: string = useAuthHeader() || "";
  //@ts-ignore
  const auth: UserProps = useAuthUser();

  const {
    formState: { isDirty, errors },
    reset,
    register,
    handleSubmit,
  } = useForm<AttachmentProps>({ defaultValues: attachment ? attachment : {} });

  const mutation = useMutation({
    mutationFn: attachment
      ? (updatedAttachment: AttachmentProps) => updateAttachment(authHeader, updatedAttachment)
      : (newAttachment: AttachmentProps) =>
          createAttachment(authHeader, { ...newAttachment, content_type: contentType, object_id: objectId }),
    onSuccess: () => {
      // Reset the form after successful submission
      reset();
      queryClient.invalidateQueries({ queryKey: ["attachments", contentType, objectId] });
      if (toggleUpdate) toggleUpdate();
    },
  });

  const onSubmit: SubmitHandler<AttachmentProps> = (data) => {
    data = { ...data, file: data.file[0] };
    mutation.mutate(data);
  };

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" className="mb-0" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      {/* <form style={{ marginTop: -1 }} onSubmit={handleSubmit}> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input {...register("file", { required: "This is required." })} type="file" className="form-control" />
          <ErrorMessage
            errors={errors}
            name="file"
            render={({ message }) => <p className="alert alert-danger mb-0 p-2">{message}</p>}
          />
          <input
            {...register("description", {
              maxLength: {
                value: 255,
                message: "This input exceed maxLength.",
              },
            })}
            className="form-control"
            placeholder="description (optional)"
          />
          <ErrorMessage
            errors={errors}
            name="description"
            render={({ message }) => <p className="alert alert-danger mb-0 p-2">{message}</p>}
          />
        </div>

        <div className="text-end mt-2">
          {mutation.isPending ? (
            <Loading size={"sm"} />
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
