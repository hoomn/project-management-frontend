import axiosClient from "./axios";

export async function createComment(token: TokenProps, newComment: CommentProps) {
  const res = await axiosClient(token).post("comments/", newComment);
  return res.data;
}

export async function fetchComments(token: TokenProps, content_type: number, object_id: number) {
  const res = await axiosClient(token).get("comments/", {
    params: { content_type, object_id },
  });
  return res.data;
}

export async function updateComment(token: string, updatedComment: CommentProps) {
  const res = await axiosClient(token).put(`comments/${updatedComment.id}/`, updatedComment);
  return res.data;
}

export async function deleteComment(token: TokenProps, commentId: number) {
  const res = await axiosClient(token).delete(`comments/${commentId}/`);
  return res.data;
}
