import axiosClient from "./axios";

export async function createTask(token: string, newTask: TaskProps) {
  const res = await axiosClient(token).post("tasks/", newTask);
  return res.data;
}

export async function fetchTasks(token: string, projectId: number) {
  const res = await axiosClient(token).get(`projects/${projectId}/tasks/`);
  return res.data;
}

export async function fetchTasksCurrentUser(token: string) {
  const res = await axiosClient(token).get("tasks/current_user");
  return res.data;
}

export async function fetchTasksCurrentUserDomain(token: string, assignedTo: undefined | string) {
  const res = await axiosClient(token).get("tasks/current_user_domain/", {
    params: assignedTo ? { assigned_to: assignedTo } : {},
  });
  return res.data;
}

export async function fetchTask(token: string, taskId: number | undefined) {
  const res = await axiosClient(token).get(`tasks/${taskId}/`);
  return res.data;
}

export async function updateTask(token: string, updatedTask: TaskProps) {
  const res = await axiosClient(token).put(`tasks/${updatedTask.id}/`, updatedTask);
  return res.data;
}

export async function patchTask(token: string, updatedTask: TaskProps) {
  const res = await axiosClient(token).patch(`tasks/${updatedTask.id}/`, updatedTask);
  return res.data;
}

export async function deleteTask(token: string, taskId: number | undefined) {
  const res = await axiosClient(token).delete(`tasks/${taskId}/`);
  return res.data;
}
