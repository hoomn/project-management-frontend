import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import { deleteAtachment } from "../../api/attachment";
import { AttachmentProps, UserProps } from "../../types";

import UserAvatar from "../user/UserAvatar";
import { Alert } from "react-bootstrap";
import Icon from "../Icon";
import AttachmentForm from "./AttachmentForm";

export default function Attachment({ attachment }: { attachment: AttachmentProps }) {
  const queryClient = useQueryClient();
  const authHeader: string | null = useAuthHeader();
  const currentUser: UserProps | null = useAuthUser();

  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const toggleDelete = () => {
    setIsDelete((curr) => !curr);
  };

  const toggleUpdate = () => {
    setIsUpdate((curr) => !curr);
  };

  const mutation = useMutation({
    mutationFn: () => deleteAtachment(authHeader, attachment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", attachment.content_type, attachment.object_id] });
    },
  });

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.toString()}
        </Alert>
      )}
      <div className="border-bottom bg-light px-2 py-3">
        <div className="d-flex align-items-center px-2 pb-2">
          <UserAvatar userId={attachment.created_by} me={2} />
          <small className="text-muted fs-light fst-italic me-auto">{attachment.time_since_creation}</small>

          {!isDelete && !isUpdate && currentUser?.id === attachment.created_by && (
            <>
              <button className="btn btn-sm text-dark" onClick={toggleUpdate}>
                <Icon icon="pencil-square" me={0} />
              </button>
              <button className="btn btn-sm text-danger" onClick={toggleDelete}>
                <Icon icon="trash" me={0} />
              </button>
            </>
          )}
          {isUpdate && (
            <div>
              <button className="btn btn-sm btn-outline-dark" onClick={toggleUpdate}>
                never mind
              </button>
            </div>
          )}
          {isDelete && (
            <div>
              <span className="me-2">
                <i className="bi bi-exclamation-circle text-danger me-1"></i>Are you sure you want to delete this file?
              </span>
              <button className="btn btn-sm btn-outline-danger mx-1" onClick={() => mutation.mutate()}>
                yes, delete
              </button>
              <button className="btn btn-sm btn-outline-dark" onClick={toggleDelete}>
                never mind
              </button>
            </div>
          )}
        </div>

        {isUpdate ? (
          <AttachmentForm
            contentType={attachment.content_type}
            objectId={attachment.object_id}
            attachment={attachment}
            toggleUpdate={toggleUpdate}
          />
        ) : (
          <div className="px-2">
            <p className="mb-0">
              <Icon icon={`filetype-${attachment.extension}`} />
              {attachment.file_name}
              {attachment.is_updated && <small className="text-muted fst-italic"> (edited)</small>}
            </p>
            {attachment.description && <p className="text-muted mb-0">{attachment.description}</p>}
            <a href={attachment.file}>
              <Icon icon="cloud-download" />
              download
            </a>
            <small className="text-muted fst-italic ms-2">({attachment.file_size})</small>
          </div>
        )}
      </div>
    </>
  );
}
