import { TokenProps } from "../types";
import axiosClient from "./axios";
import axios from "axios";

export async function fetchDomain(token: TokenProps, domainId: number) {
  const res = await axiosClient(token).get(`domains/${domainId}/`);
  return res.data;
}

export async function fetchDomainChoices(token: TokenProps) {
  const res = await axiosClient(token).get("domains/choices/");
  return res.data;
}

export async function fetchPriorityChoices(token: TokenProps) {
  const res = await axiosClient(token).get("projects/priority/choices/");
  return res.data;
}

export async function fetchStatusChoices(token: TokenProps) {
  const res = await axiosClient(token).get("projects/status/choices/");
  return res.data;
}

export async function fetchNotifications(token: TokenProps) {
  const res = await axiosClient(token).get("notifications/");
  return res.data;
}

export async function dismissAllNotification(token: TokenProps) {
  const res = await axiosClient(token).post("notifications/mark_all_as_viewed/");
  return res.data;
}

export async function fetchVersion() {
  const res = await axios.get("/version.json");
  return res.data;
}
