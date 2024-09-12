import axiosClient, { axiosClientFile } from "./axios";
import { AttachmentProps, TokenProps } from "../types";

export async function createAttachment(token: TokenProps, newAttachment: AttachmentProps) {
  const res = await axiosClientFile(token).post("attachments/", newAttachment, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function fetchAttachments(token: TokenProps, content_type: number, object_id: number) {
  const res = await axiosClient(token).get("attachments/", {
    params: { content_type, object_id },
  });
  return res.data;
}

export async function updateAttachment(token: string, updatedAttachment: AttachmentProps) {
  const res = await axiosClient(token).put(`attachments/${updatedAttachment.id}/`, updatedAttachment, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function deleteAtachment(token: TokenProps, attachmentId: number) {
  const res = await axiosClient(token).delete(`attachments/${attachmentId}/`);
  return res.data;
}
