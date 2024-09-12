import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useQuery } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";

import { fetchComments } from "../../api/comment";

import CommentForm from "./CommentForm";
import Comment from "./Comment";
import Loading from "../Loading";

import { CommentProps } from "../../types";

type CommentListProps = {
  contentType: number;
  objectId: number;
};

export default function CommentList({ contentType, objectId }: CommentListProps) {
  const authHeader: string = useAuthHeader() || "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["comments", contentType, objectId],
    queryFn: () => fetchComments(authHeader, contentType, objectId),
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return (
    <div className="my-4">
      <h5 className={`fw-light text-muted border-bottom border-4 mb-0 border-${contentType}`}>Comments</h5>
      {data.length !== 0 ? (
        data?.map((comment: CommentProps) => <Comment key={comment.id} comment={comment} />)
      ) : (
        <div className="text-center border-top border-bottom bg-light py-2">
          <small className="text-muted fst-italic">no comments</small>
        </div>
      )}
      <CommentForm contentType={contentType} objectId={objectId} />
    </div>
  );
}
