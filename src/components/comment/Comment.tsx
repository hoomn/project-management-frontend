import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import { deleteComment } from "../../api/comment";
import { CommentProps, UserProps } from "../../types";

import UserAvatar from "../user/UserAvatar";
import { Alert } from "react-bootstrap";
import Icon from "../Icon";
import CommentForm from "./CommentForm";

export default function Comment({ comment }: { comment: CommentProps }) {
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
    mutationFn: () => deleteComment(authHeader, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.content_type, comment.object_id] });
    },
  });

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <div className="border-bottom bg-light p-3">
        <div className="d-flex align-items-center pb-2">
          <UserAvatar userId={comment.created_by} me={2} />
          <small className="text-muted fs-light fst-italic me-auto">{comment.time_since_creation}</small>
          {!isDelete && !isUpdate && currentUser?.id === comment.created_by && (
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
                <i className="bi bi-exclamation-circle text-danger me-1"></i>Are you sure you want to delete this
                comment?
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
          <CommentForm
            contentType={comment.content_type}
            objectId={comment.object_id}
            comment={comment}
            toggleUpdate={toggleUpdate}
          />
        ) : (
          <div className="d-flex align-items-end px-2">
            <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {comment.text}
              {comment.is_updated && <small className="text-muted fst-italic"> (edited)</small>}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
