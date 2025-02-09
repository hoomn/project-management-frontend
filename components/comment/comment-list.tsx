import { useQuery } from "@tanstack/react-query";

import { BorderColor, CommentProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import NoData from "@/components/ui/no-data";
import SectionHeader from "@/components/ui/section-header";

import api from "@/lib/api";

import Comment from "./comment";
import CommentForm from "./comment-form";

type CommentListProps = {
  contentType: string;
  objectId: string;
  borderColor: BorderColor;
};

export default function CommentList({ contentType, objectId, borderColor = "gray" }: CommentListProps) {
  const { isPending, data, error } = useQuery<CommentProps[]>({
    queryKey: ["comments", contentType, objectId],
    queryFn: () => api.get("/comments/", { content_type: contentType, object_id: objectId }),
  });

  if (isPending) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      <SectionHeader title="Comments" borderColor={borderColor} />
      {data.length === 0 ? (
        <NoData type="comments" my={2} />
      ) : (
        data?.map((comment: CommentProps) => <Comment key={comment.id} comment={comment} />)
      )}
      <CommentForm contentType={contentType} objectId={objectId} />
    </>
  );
}
