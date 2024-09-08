import { UserProps } from "../types";
import axiosClient from "./axios";

export async function fetchUsers(token: string) {
  const res = await axiosClient(token).get("users");
  return res.data;
}

export async function fetchUser(token: string, userId: number | undefined) {
  const res = await axiosClient(token).get(`users/${userId}/`);
  return res.data;
}

export async function updateUser(token: string, updatedUser: UserProps) {
  const res = await axiosClient(token).put(
    `users/${updatedUser.id}/`,
    updatedUser
  );
  return res.data;
}

export async function fetchUserOptions(token: string) {
  const res = await axiosClient(token).get("user-options/");
  return res.data;
}
