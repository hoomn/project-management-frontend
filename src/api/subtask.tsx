import axiosClient from "./axios";

export async function createSubtask(token: string, newSubtask: SubtaskProps) {
  const res = await axiosClient(token).post("subtasks/", newSubtask);
  return res.data;
}

export async function fetchSubtasks(token: string, taskId: number | undefined) {
  const res = await axiosClient(token).get(`tasks/${taskId}/subtasks/`);
  return res.data;
}

export async function fetchSubtasksCurrentUser(token: string) {
  const res = await axiosClient(token).get("subtasks/current_user");
  return res.data;
}

export async function fetchSubtask(token: string, subtaskId: number | undefined) {
  const res = await axiosClient(token).get(`subtasks/${subtaskId}/`);
  return res.data;
}

export async function updateSubtask(token: string, updatedSubtask: SubtaskProps) {
  const res = await axiosClient(token).put(`subtasks/${updatedSubtask.id}/`, updatedSubtask);
  return res.data;
}

export async function patchSubtask(token: string, updatedSubtask: SubtaskProps) {
  const res = await axiosClient(token).patch(`subtasks/${updatedSubtask.id}/`, updatedSubtask);
  return res.data;
}

export async function deleteSubtask(token: string, subtaskId: number | undefined) {
  const res = await axiosClient(token).delete(`subtasks/${subtaskId}/`);
  return res.data;
}
