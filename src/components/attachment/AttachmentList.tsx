import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import Loading from "../Loading";
import Attachment from "./Attachment";
import AttachmentForm from "./AttachmentForm";

import { fetchAttachments } from "../../api/attachment";

type AttachmentListProps = {
  contentType: number;
  objectId: number;
  borderColor: "gray" | "burgundy" | "navy" | "cyan";
};

export default function AttachmentList({ contentType, objectId, borderColor = "gray" }: AttachmentListProps) {
  const authHeader: string | null = useAuthHeader();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["attachments", contentType, objectId],
    queryFn: () => fetchAttachments(authHeader, contentType, objectId),
  });

  if (isPending) return <Loading />;

  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div className="my-4">
      <h5 className={`fw-light text-muted border-bottom border-4 mb-0 border-${borderColor}`}>Attachments</h5>
      {data.length !== 0 ? (
        data?.map((attachment: AttachmentProps) => <Attachment key={attachment.id} attachment={attachment} />)
      ) : (
        <div className="text-center border-top border-bottom bg-light py-2">
          <small className="text-muted fst-italic">no attachments</small>
        </div>
      )}
      <AttachmentForm contentType={contentType} objectId={objectId} />
    </div>
  );
}
