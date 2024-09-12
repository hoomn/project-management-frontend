import axiosClient from "./axios";
import { TokenProps } from "../types";

export async function fetchActivities(token: TokenProps, content_type: number, object_id: number) {
  const res = await axiosClient(token).get("activities/", {
    params: { content_type, object_id },
  });
  return res.data;
}

export async function fetchAllActivities(token: TokenProps, page: number) {
  const res = await axiosClient(token).get("activities/", { params: { page } });
  return res.data;
}
