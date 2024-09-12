import { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import ProjectList from "../components/project/ProjectList";
import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { fetchProjects } from "../api/project";
import Loading from "../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { ProjectProps } from "../types";
import FormLabel from "../components/FormLabel";

export default function Projects() {
  const authHeader: string = useAuthHeader() || "";

  const [searchParams, setSearchParams] = useSearchParams({
    sort: "priority_r",
  });

  const titleFilter = searchParams.get("title") || "";
  const sort = searchParams.get("sort") || "";

  const {
    isPending,
    isError,
    data: projects,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(authHeader),
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(
      (prev) => {
        prev.set(name, value);
        return prev;
      },
      { replace: true }
    );
  };

  if (isPending) return <Loading />;
  if (isError) {
    throw new Response(error.message);
    // return <Message variant={"danger"} text={`Error: ${error.message}`} />;
  }

  const menuItems = [{ icon: <Icon icon={"plus-circle"} />, name: "new project", url: "/projects/add" }];

  // Sort logic
  const sortedData = projects.sort((a: ProjectProps, b: ProjectProps) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "start_date") {
      // Custom sorting for start date
      if (!a.start_date && !b.start_date) return 0; // If both dates are null, leave them in the same order
      if (!a.start_date) return 1; // If a's start date is null, push it to the end
      if (!b.start_date) return -1; // If b's start date is null, push it to the end
      //@ts-ignore
      return new Date(a.start_date) - new Date(b.start_date); // Compare non-null dates
    }
    if (sort === "end_date") {
      if (!a.end_date && !b.end_date) return 0;
      if (!a.end_date) return 1;
      if (!b.end_date) return -1;
      //@ts-ignore
      return new Date(a.end_date) - new Date(b.end_date);
    }
    if (sort === "priority") return a.priority - b.priority;
    if (sort === "priority_r") return b.priority - a.priority;
    if (sort === "status") return a.status - b.status;
    if (sort === "status_r") return b.status - a.status;
    return 0;
  });

  // Filter logic
  const filteredData = sortedData.filter((task: ProjectProps) => {
    return task.title.toLowerCase().includes(titleFilter.toLowerCase());
  });

  return (
    <div>
      <BreadcrumbMenu title="Projects" items={menuItems} />

      {/* Filter components */}
      <div className="row g-3 bg-light pb-3 mt-2 mb-4">
        <div className="col-md-3">
          <FormLabel label="Search" parent="title" />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by title"
            name="title"
            id="title"
            value={titleFilter}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <FormLabel label="Sort by" parent="sort" />
          <select className="form-select" name="sort" id="sort" value={sort} onChange={handleFilterChange}>
            <option value="">-</option>
            <option value="title">Title</option>
            <option value="start_date">Start Date</option>
            <option value="end_date">End Date</option>
            <option value="status">Status</option>
            <option value="status_r">Status Reverse</option>
            <option value="priority">Priority Low to High</option>
            <option value="priority_r">Priority High to Low</option>
          </select>
        </div>
        <div className="col d-flex justify-content-end align-items-end">
          <div>
            <button className="btn btn-outline-dark" onClick={() => setSearchParams({})}>
              <Icon icon="arrow-clockwise" me={0} />
            </button>
          </div>
        </div>
      </div>
      {/* /Filter components */}

      <ProjectList projects={filteredData} />
    </div>
  );
}
