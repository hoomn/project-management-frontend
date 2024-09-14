import axios from "axios";

function getAuthToken(): string {
  // Split the cookies into an array
  var cookies = document.cookie.split(";");
  const type_key = "_auth_type=";
  const token_key = "_auth=";

  let authType = undefined;
  let authToken = undefined;

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();

    // Check if this cookie starts with the provided name
    if (cookie.indexOf(type_key) === 0) authType = cookie.substring(type_key.length);
    if (cookie.indexOf(token_key) === 0) authToken = cookie.substring(token_key.length);
    // Extract and return the token
    if (authType !== undefined && authToken !== undefined) return `${authType} ${authToken}`;
  }

  // Return undefined if cookie not found
  return "";
}

export function axiosClientWithAuth() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: getAuthToken(),
  };

  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 2500,
    headers: headers,
    withCredentials: true,
  });

  return instance;
}

export default function axiosClient(token: TokenProps | undefined = undefined) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 2500,
    headers: headers,
  });

  if (token !== undefined) {
    instance.defaults.headers.common["Authorization"] = token;
    // instance.defaults.withCredentials = true;
  }

  return instance;
}

export function axiosClientFile(token: TokenProps | undefined = undefined) {
  const headers: HeadersInit = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  };

  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
    headers: headers,
  });

  if (token !== undefined) {
    instance.defaults.headers.common["Authorization"] = token;
    // instance.defaults.withCredentials = true;
  }

  return instance;
}
