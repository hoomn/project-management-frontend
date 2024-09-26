import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy } from "react";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AuthRoot from "./routes/AuthRoot";
import ErrorBoundary from "./routes/ErrorBoundary";
import Root from "./routes/Root";

import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = lazy(() => import("./routes/Login"));
const LoginWithCode = lazy(() => import("./routes/LoginWithCode"));

const Profile = lazy(() => import("./routes/Profile"));

const Dashboard = lazy(() => import("./routes/Dashboard"));

const Project = lazy(() => import("./routes/Project"));
const Projects = lazy(() => import("./routes/Projects"));
const ProjectAdd = lazy(() => import("./routes/ProjectAdd"));
const ProjectDelete = lazy(() => import("./routes/ProjectDelete"));

const Task = lazy(() => import("./routes/Task"));
const TaskAdd = lazy(() => import("./routes/TaskAdd"));
const TaskDelete = lazy(() => import("./routes/TaskDelete"));

const TaskListCurrentUser = lazy(() => import("./components/task/TaskListCurrentUser"));
const TaskListCurrentDomain = lazy(() => import("./components/task/TaskListCurrentDomain"));

const Subtask = lazy(() => import("./routes/Subtask"));
const SubtaskAdd = lazy(() => import("./routes/SubtaskAdd"));
const SubtaskDelete = lazy(() => import("./routes/SubtaskDelete"));

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Dashboard /> },

      { path: "profile", element: <Profile /> },

      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <Project /> },
      { path: "projects/add", element: <ProjectAdd /> },
      { path: "projects/:id/delete", element: <ProjectDelete /> },

      { path: "tasks", element: <TaskListCurrentDomain /> },
      { path: "my-tasks", element: <TaskListCurrentUser /> },
      { path: "tasks/:id", element: <Task /> },
      { path: "projects/:id/tasks/add", element: <TaskAdd /> },
      { path: "tasks/:id/delete", element: <TaskDelete /> },

      { path: "subtasks/:id", element: <Subtask /> },
      { path: "tasks/:id/subtasks/add", element: <SubtaskAdd /> },
      { path: "subtasks/:id/delete", element: <SubtaskDelete /> },
    ],
  },
  {
    path: "/login",
    element: <AuthRoot />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "code",
        element: <LoginWithCode />,
      },
    ],
  },
]);

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <AuthProvider store={store}>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
