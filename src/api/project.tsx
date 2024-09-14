import axiosClient from "./axios";

export async function createProject(token: string, newProject: ProjectProps) {
  const res = await axiosClient(token).post("projects/", newProject);
  return res.data;
}

export async function fetchProjects(token: string) {
  const res = await axiosClient(token).get("projects/");
  return res.data;
}

export async function fetchProjectsGantt(token: string) {
  const res = await axiosClient(token).get("projects/gantt");
  return res.data;
}

export async function fetchProject(token: string, projectId: number | undefined) {
  const res = await axiosClient(token).get(`projects/${projectId}/`);
  return res.data;
}

export async function updateProject(token: string, updatedProject: ProjectProps) {
  const res = await axiosClient(token).put(`projects/${updatedProject.id}/`, updatedProject);
  return res.data;
}

export async function deleteProject(token: string, projectId: number | undefined) {
  const res = await axiosClient(token).delete(`projects/${projectId}/`);
  return res.data;
}
