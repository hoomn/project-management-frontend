import { getSession } from "next-auth/react";

import axios, { AxiosInstance } from "axios";

import { auth } from "@/auth";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseURL: string;
  private clientApi: AxiosInstance;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    // Initialize the client-side axios instance
    this.clientApi = axios.create({
      baseURL: this.baseURL,
      timeout: 3000,
      paramsSerializer: {
        indexes: null,
      },
    });

    // Add request interceptor for client-side auth
    this.clientApi.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        const accessToken = session?.user?.access;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor for consistent error handling
    this.clientApi.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        const data: Record<string, unknown> = error.response?.data || {};
        throw new ApiError(message, status, data);
      },
    );
  }

  // Helper method to determine if code is running on server
  private isServer(): boolean {
    return typeof window === "undefined";
  }
  // Helper method to sanitize the paths
  private createURL(path: string, baseURL: string): URL {
    // When we have a trailing slash in path and a leading slash in baseURL,
    // the URL constructor will treat the path as absolute rather than relative
    path = path.replace(/^\/+/, ""); // Remove leading slashes
    baseURL = baseURL.replace(/\/+$/, ""); // Remove trailing slashes
    return new URL(path, baseURL + "/");
  }

  // Helper method for server-side auth token
  private async getServerToken(): Promise<string | undefined> {
    const session = await auth();
    return session?.user?.access;
  }

  // Universal get method that works on both client and server
  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    if (this.isServer()) {
      // Server-side fetch
      const token = await this.getServerToken();
      const url = this.createURL(path, this.baseURL);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(data?.message || response.statusText, response.status, data);
      }

      return response.json();
    }

    // Client-side fetch using existing axios setup
    return this.clientApi.get(path, { params });
  }

  // Universal post method
  async post<T>(path: string, data?: Record<string, unknown>, headers?: Record<string, string>): Promise<T> {
    if (this.isServer()) {
      const token = await this.getServerToken();
      const url = this.createURL(path, this.baseURL);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers, // Merge custom headers
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData?.message || response.statusText, response.status, errorData);
      }

      return response.json();
    }

    return this.clientApi.post(path, data, { headers }); // Pass headers to axios request
  }

  // Universal put method
  async put<T>(path: string, data?: Record<string, unknown>, headers?: Record<string, string>): Promise<T> {
    if (this.isServer()) {
      const token = await this.getServerToken();
      const url = this.createURL(path, this.baseURL);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData?.message || response.statusText, response.status, errorData);
      }

      return response.json();
    }

    return this.clientApi.put(path, data, { headers });
  }

  // Universal delete method
  async delete<T>(path: string): Promise<T> {
    if (this.isServer()) {
      const token = await this.getServerToken();
      const url = this.createURL(path, this.baseURL);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData?.message || response.statusText, response.status, errorData);
      }

      return response.json();
    }

    return this.clientApi.delete(path);
  }
}

// Export a singleton instance
const api = new ApiClient();
export default api;
