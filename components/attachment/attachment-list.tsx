import { useQuery } from "@tanstack/react-query";

import { AttachmentProps, BorderColor } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";
import NoData from "@/components/ui/no-data";
import SectionHeader from "@/components/ui/section-header";

import api from "@/lib/api";

import Attachment from "./attachment";
import AttachmentForm from "./attachment-form";

type AttachmentListProps = {
  contentType: string;
  objectId: string;
  borderColor: BorderColor;
};

export default function AttachmentList({ contentType, objectId, borderColor = "gray" }: AttachmentListProps) {
  const { isPending, data, error } = useQuery<AttachmentProps[]>({
    queryKey: ["attachments", contentType, objectId],
    queryFn: () => api.get("/attachments/", { content_type: contentType, object_id: objectId }),
  });

  if (isPending) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      <SectionHeader title="Attachments" borderColor={borderColor} />
      {data.length === 0 ? (
        <NoData type="attachments" my={2} />
      ) : (
        data?.map((attachment: AttachmentProps) => <Attachment key={attachment.id} attachment={attachment} />)
      )}
      <AttachmentForm contentType={contentType} objectId={objectId} />
    </>
  );
}
