import axiosClient from "./axios";

export async function fetchNotifications(token: TokenProps) {
  const res = await axiosClient(token).get("notifications/");
  return res.data;
}

export async function updateNotification(token: TokenProps, updatedNotification: NotificationProps) {
  const res = await axiosClient(token).put(`notifications/${updatedNotification.id}/`, updatedNotification);
  return res.data;
}

export async function dismissAllNotification(token: TokenProps) {
  const res = await axiosClient(token).post("notifications/mark_all_as_viewed/");
  return res.data;
}
