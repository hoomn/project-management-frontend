import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import Alert from "react-bootstrap/Alert";
import UserAvatar from "../user/UserAvatar";
import Loading from "../Loading";
import Icon from "../Icon";

import { fetchAllActivities } from "../../api/activity";

export default function ActivityDashBox() {
  const authHeader: string = useAuthHeader() || "";

  const [page, setPage] = useState(1);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["activities", "all", page],
    queryFn: () => fetchAllActivities(authHeader, page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return (
    <>
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">Activities</h5>

          {data.results.length === 0 ? (
            <div className="text-center border-top border-bottom py-2">
              <small className="text-muted fst-italic">no activities</small>
            </div>
          ) : (
            <>
              {data.results.map((activity: ActivityProps) => (
                <div className="d-flex align-items-center border-bottom pb-1 mb-1" key={activity.id}>
                  <div className="d-flex text-muted align-items-center me-auto">
                    <UserAvatar userId={activity.created_by} />
                    {activity.get_action_display}d a {activity.content_type}
                  </div>
                  <small className="fst-italic p-2">{activity.time_since_creation}</small>
                </div>
              ))}
              <div className="d-flex align-items-center justify-content-center mt-3">
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => setPage(data.previous)}
                  disabled={!data.previous}
                >
                  <Icon icon="chevron-left" />
                </button>
                <span>
                  page {data.number} of {data.num_pages}
                </span>
                <button className="btn btn-sm btn-link" onClick={() => setPage(data.next)} disabled={!data.next}>
                  <Icon icon="chevron-right" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
